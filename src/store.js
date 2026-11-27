// 人脉档案的本地存储：contacts.json + 每人一份 chats/<id>.json。
// 只写 $DSH_HOME/business-cards/，原子写 + 最近 3 份备份。
import { promises as fs } from 'node:fs'
import { dirname, join } from 'node:path'
import { randomUUID } from 'node:crypto'

export const TYPES = ['investor', 'partner', 'client', 'advisor', 'other']
export const ACCENTS = ['orchid', 'peach', 'butter', 'rose', 'sage', 'sky', 'blue']
export const NOTE_KINDS = ['wechat', 'meeting', 'call', 'email', 'note']
export const CHAT_ROLES = ['user', 'assistant', 'tool', 'system', 'error']

export const LIMITS = {
  contacts: 500,
  tags: 4,
  notes: 20_000,
  note: 4_000,
  timeline: 200,
  research: 8_000,
  sources: 8,
  chatEntries: 200,
  chatText: 8_000,
}

export class HttpError extends Error {
  constructor(status, message) {
    super(message)
    this.status = status
  }
}

const TYPE_SET = new Set(TYPES)
const ACCENT_SET = new Set(ACCENTS)
const NOTE_SET = new Set(NOTE_KINDS)
const CHAT_ROLE_SET = new Set(CHAT_ROLES)

const text = (value, max = 500) => (typeof value === 'string' ? value.trim().slice(0, max) : '')
const iso = value => {
  if (!value) return null
  const stamp = Date.parse(value)
  return Number.isFinite(stamp) ? new Date(stamp).toISOString() : null
}
const nowIso = () => new Date().toISOString()
const clone = value => (value === undefined ? undefined : JSON.parse(JSON.stringify(value)))
const pickAccent = id => ACCENTS[[...id].reduce((sum, ch) => sum + ch.charCodeAt(0), 0) % ACCENTS.length]

function normalizeTags(value) {
  const raw = Array.isArray(value) ? value : typeof value === 'string' ? value.split(/[,，、]/) : []
  const out = []
  for (const entry of raw) {
    const tag = text(entry, 24)
    if (tag && !out.includes(tag)) out.push(tag)
    if (out.length >= LIMITS.tags) break
  }
  return out
}

function normalizeSource(value) {
  const url = text(value?.url, 2048)
  if (!url) return null
  try {
    const parsed = new URL(url)
    if (parsed.protocol !== 'http:' && parsed.protocol !== 'https:') return null
    return {
      title: text(value?.title, 200) || parsed.hostname,
      url: parsed.toString(),
      site: text(value?.site, 120) || parsed.hostname.replace(/^www\./, ''),
    }
  } catch {
    return null
  }
}

function normalizeResearch(value) {
  const summary = text(value?.summary, LIMITS.research)
  const sources = Array.isArray(value?.sources)
    ? value.sources.map(normalizeSource).filter(Boolean).slice(0, LIMITS.sources)
    : []
  return {
    summary,
    sources,
    updatedAt: iso(value?.updatedAt) || (summary || sources.length ? nowIso() : null),
  }
}

function normalizeTimeline(value) {
  if (!Array.isArray(value)) return []
  const out = []
  for (const entry of value) {
    const body = text(entry?.text, LIMITS.note)
    if (!body) continue
    out.push({
      id: text(entry?.id, 80) || `t_${randomUUID()}`,
      at: iso(entry?.at) || nowIso(),
      kind: NOTE_SET.has(entry?.kind) ? entry.kind : 'note',
      text: body,
    })
  }
  out.sort((a, b) => Date.parse(b.at) - Date.parse(a.at))
  return out.slice(0, LIMITS.timeline)
}

/** 把外部输入规整成可落盘的档案；缺姓名的新联系人会抛 400。 */
export function normalizeContact(raw, previous = null) {
  const source = raw && typeof raw === 'object' ? raw : {}
  const has = key => Object.prototype.hasOwnProperty.call(source, key) && source[key] !== undefined
  const name = text(has('name') ? source.name : previous?.name, 120)
  if (!name) throw new HttpError(400, '姓名不能为空')

  const base = previous || {
    id: `c_${randomUUID()}`,
    no: 0,
    timeline: [],
    research: { summary: '', sources: [], updatedAt: null },
    sessionId: null,
    createdAt: nowIso(),
  }

  const next = {
    id: base.id,
    no: Number.isFinite(base.no) && base.no > 0 ? base.no : 0,
    name,
    nameEn: text(has('nameEn') ? source.nameEn : previous?.nameEn, 120),
    type: TYPE_SET.has(source.type) ? source.type : previous?.type || 'other',
    role: text(has('role') ? source.role : previous?.role, 120),
    company: text(has('company') ? source.company : previous?.company, 160),
    city: text(has('city') ? source.city : previous?.city, 120),
    accent: ACCENT_SET.has(source.accent) ? source.accent : previous?.accent || pickAccent(base.id),
    tags: has('tags') ? normalizeTags(source.tags) : normalizeTags(previous?.tags),
    contact: {
      email: text(
        has('contact') && source.contact?.email !== undefined ? source.contact.email : previous?.contact?.email,
        200,
      ),
      wechat: text(
        has('contact') && source.contact?.wechat !== undefined ? source.contact.wechat : previous?.contact?.wechat,
        120,
      ),
      phone: text(
        has('contact') && source.contact?.phone !== undefined ? source.contact.phone : previous?.contact?.phone,
        80,
      ),
    },
    nextStep: has('nextStep')
      ? source.nextStep && text(source.nextStep.text, 400)
        ? { at: iso(source.nextStep.at), text: text(source.nextStep.text, 400) }
        : null
      : previous?.nextStep || null,
    notes: text(has('notes') ? source.notes : previous?.notes, LIMITS.notes),
    lastContactAt: iso(has('lastContactAt') ? source.lastContactAt : previous?.lastContactAt),
    timeline: previous?.timeline ? clone(previous.timeline) : [],
    research: previous?.research ? clone(previous.research) : { summary: '', sources: [], updatedAt: null },
    sessionId: previous?.sessionId || null,
    createdAt: previous?.createdAt || base.createdAt,
    updatedAt: nowIso(),
  }
  return next
}

/** 交给浏览器的安全副本。 */
export function publicContact(contact) {
  return clone(contact)
}

function emptyChat() {
  return { seq: 0, entries: [] }
}

function normalizeChat(raw) {
  if (!raw || !Array.isArray(raw.entries)) return emptyChat()
  let seq = 0
  const entries = []
  for (const entry of raw.entries) {
    const body = text(entry?.text, LIMITS.chatText)
    const role = CHAT_ROLE_SET.has(entry?.role) ? entry.role : 'system'
    if (!body) continue
    const value = {
      seq: Number.isFinite(entry?.seq) ? entry.seq : seq + 1,
      role,
      text: body,
      at: iso(entry?.at) || nowIso(),
    }
    if (entry?.name) value.name = text(entry.name, 120)
    seq = Math.max(seq, value.seq)
    entries.push(value)
  }
  entries.sort((a, b) => a.seq - b.seq)
  return { seq, entries: entries.slice(-LIMITS.chatEntries) }
}

export class Store {
  constructor(dir) {
    this.dir = dir
    this.file = join(dir, 'contacts.json')
    this.chatDir = join(dir, 'chats')
    this.backupDir = join(dir, 'backups')
    this.contacts = []
    this.revision = 0
    this.chatCache = new Map()
    this.queue = Promise.resolve()
  }

  enqueue(task) {
    const run = this.queue.then(task, task)
    this.queue = run.catch(() => {})
    return run
  }

  async load() {
    await fs.mkdir(this.chatDir, { recursive: true })
    await fs.mkdir(this.backupDir, { recursive: true })
    try {
      const raw = JSON.parse(await fs.readFile(this.file, 'utf8'))
      const list = Array.isArray(raw?.contacts) ? raw.contacts : []
      const contacts = []
      for (const entry of list) {
        try {
          const normalized = normalizeContact(entry, null)
          normalized.id = text(entry?.id, 80) || normalized.id
          normalized.no = Number.isFinite(entry?.no) && entry.no > 0 ? entry.no : contacts.length + 1
          normalized.createdAt = iso(entry?.createdAt) || normalized.createdAt
          normalized.sessionId = text(entry?.sessionId, 200) || null
          normalized.timeline = normalizeTimeline(entry?.timeline)
          normalized.research = normalizeResearch(entry?.research)
          normalized.lastContactAt = iso(entry?.lastContactAt)
          contacts.push(normalized)
        } catch {
          // 单条坏数据跳过，别让整个面板打不开。
        }
      }
      this.contacts = contacts
      this.revision = Number.isFinite(raw?.revision) ? raw.revision : 0
    } catch (error) {
      if (error?.code !== 'ENOENT') {
        // 文件损坏：先备份原文，随后以空列表继续；不覆盖用户原文件。
        try {
          await fs.copyFile(this.file, join(this.backupDir, `broken-${Date.now()}.json`))
        } catch {
          // 备份失败也不阻断启动。
        }
      }
      this.contacts = []
    }
    return this
  }

  list() {
    return this.contacts
      .map(publicContact)
      .sort((a, b) => Date.parse(b.lastContactAt || b.updatedAt) - Date.parse(a.lastContactAt || a.updatedAt))
  }

  snapshot() {
    return { revision: this.revision, contacts: this.list() }
  }

  find(idOrName) {
    const value = typeof idOrName === 'string' ? idOrName.trim() : ''
    if (!value) return null
    return (
      this.contacts.find(contact => contact.id === value) ||
      this.contacts.find(contact => contact.name === value) ||
      this.contacts.find(contact => contact.nameEn && contact.nameEn.toLowerCase() === value.toLowerCase()) ||
      null
    )
  }

  bySession(sessionId) {
    if (!sessionId) return null
    return this.contacts.find(contact => contact.sessionId === sessionId) || null
  }

  async writeContacts() {
    const payload = { schema: 1, revision: this.revision, contacts: this.contacts }
    const tmp = `${this.file}.${process.pid}.${Date.now()}.tmp`
    await fs.mkdir(dirname(this.file), { recursive: true })
    await fs.writeFile(tmp, JSON.stringify(payload, null, 2))
    try {
      await fs.copyFile(this.file, join(this.backupDir, `contacts-${Date.now()}.json`))
      const backups = (await fs.readdir(this.backupDir)).filter(name => name.startsWith('contacts-')).sort()
      for (const stale of backups.slice(0, Math.max(0, backups.length - 3))) {
        await fs.rm(join(this.backupDir, stale), { force: true })
      }
    } catch {
      // 第一次写入没有旧文件可备份。
    }
    await fs.rename(tmp, this.file)
  }

  async persist() {
    this.revision += 1
    await this.enqueue(() => this.writeContacts())
  }

  async upsert(raw) {
    const id = text(raw?.id, 80)
    const previous = id ? this.find(id) : null
    if (id && !previous) throw new HttpError(404, '找不到这张名片')
    if (!previous && this.contacts.length >= LIMITS.contacts) {
      throw new HttpError(409, `联系人已达上限 ${LIMITS.contacts}`)
    }
    const contact = normalizeContact(raw, previous)
    if (!contact.no) contact.no = this.contacts.reduce((max, entry) => Math.max(max, entry.no || 0), 0) + 1
    if (previous) {
      const index = this.contacts.indexOf(previous)
      this.contacts[index] = contact
    } else {
      this.contacts.push(contact)
    }
    await this.persist()
    return publicContact(contact)
  }

  async remove(id) {
    const contact = this.find(id)
    if (!contact) throw new HttpError(404, '找不到这张名片')
    this.contacts = this.contacts.filter(entry => entry !== contact)
    await this.persist()
    this.chatCache.delete(contact.id)
    await fs.rm(this.chatFile(contact.id), { force: true }).catch(() => {})
    return publicContact(contact)
  }

  async addNote(id, input) {
    const contact = this.find(id)
    if (!contact) throw new HttpError(404, '找不到这张名片')
    const body = text(input?.text, LIMITS.note)
    if (!body) throw new HttpError(400, '记点什么再保存')
    const at = iso(input?.at) || nowIso()
    const entry = {
      id: `t_${randomUUID()}`,
      at,
      kind: NOTE_SET.has(input?.kind) ? input.kind : 'note',
      text: body,
    }
    contact.timeline = normalizeTimeline([entry, ...contact.timeline]).slice(0, LIMITS.timeline)
    contact.lastContactAt = iso(at)
    contact.updatedAt = nowIso()
    await this.persist()
    return publicContact(contact)
  }

  async setNextStep(id, input) {
    const contact = this.find(id)
    if (!contact) throw new HttpError(404, '找不到这张名片')
    const body = text(input?.text, 400)
    contact.nextStep = body ? { at: iso(input?.at), text: body } : null
    contact.updatedAt = nowIso()
    await this.persist()
    return publicContact(contact)
  }

  async saveResearch(id, input) {
    const contact = this.find(id)
    if (!contact) throw new HttpError(404, '找不到这张名片')
    const summary = text(input?.summary, LIMITS.research)
    const sources = Array.isArray(input?.sources)
      ? input.sources.map(normalizeSource).filter(Boolean).slice(0, LIMITS.sources)
      : []
    if (!summary && !sources.length) throw new HttpError(400, '研究内容为空')
    contact.research = { summary, sources, updatedAt: nowIso() }
    contact.updatedAt = nowIso()
    await this.persist()
    return publicContact(contact)
  }

  async bindSession(id, sessionId) {
    const contact = this.find(id)
    if (!contact) throw new HttpError(404, '找不到这张名片')
    contact.sessionId = text(sessionId, 200) || null
    await this.persist()
    return publicContact(contact)
  }

  chatFile(id) {
    const safe = text(id, 80).replace(/[^a-zA-Z0-9_-]/g, '')
    return join(this.chatDir, `${safe}.json`)
  }

  async chat(id) {
    if (this.chatCache.has(id)) return this.chatCache.get(id)
    let value = emptyChat()
    try {
      value = normalizeChat(JSON.parse(await fs.readFile(this.chatFile(id), 'utf8')))
    } catch {
      value = emptyChat()
    }
    this.chatCache.set(id, value)
    return value
  }

  async appendChat(id, entry) {
    const chat = await this.chat(id)
    const body = text(entry?.text, LIMITS.chatText)
    if (!body) return null
    chat.seq += 1
    const value = {
      seq: chat.seq,
      role: CHAT_ROLE_SET.has(entry?.role) ? entry.role : 'system',
      text: body,
      at: iso(entry?.at) || nowIso(),
    }
    if (entry?.name) value.name = text(entry.name, 120)
    chat.entries.push(value)
    if (chat.entries.length > LIMITS.chatEntries) chat.entries.splice(0, chat.entries.length - LIMITS.chatEntries)
    this.chatCache.set(id, chat)
    await this.enqueue(async () => {
      const file = this.chatFile(id)
      const tmp = `${file}.${process.pid}.${Date.now()}.tmp`
      await fs.writeFile(tmp, JSON.stringify(chat))
      await fs.rename(tmp, file)
    })
    return value
  }

  async chatDelta(id, after = 0) {
    const chat = await this.chat(id)
    const cursor = Number.isFinite(after) ? Math.max(0, after) : 0
    return {
      entries: clone(chat.entries.filter(entry => entry.seq > cursor)),
      lastSeq: chat.seq,
    }
  }

  async resetChat(id) {
    const chat = await this.chat(id)
    chat.entries = []
    chat.seq = 0
    await this.enqueue(async () => {
      await fs.rm(this.chatFile(id), { force: true })
    })
    return chat
  }
}
