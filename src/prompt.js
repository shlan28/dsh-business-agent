// 投给模型的档案上下文与研究指令。控制长度，只放会改变回答的信息。
// 「我」的档案（me.json）压缩成 ≤ 500 字，拼在对方档案前面。
const TYPE_LABELS = {
  investor: '投资人',
  partner: '合作伙伴',
  client: '客户',
  advisor: '顾问',
  other: '其他',
}

const KIND_LABELS = {
  wechat: '微信',
  meeting: '见面',
  call: '电话',
  email: '邮件',
  note: '备注',
}

const one = (value, max = 300) => {
  const text = typeof value === 'string' ? value.trim().replace(/\s+/g, ' ') : ''
  return text.length > max ? `${text.slice(0, max)}…` : text
}

const date = value => {
  if (!value) return ''
  const stamp = Date.parse(value)
  if (!Number.isFinite(stamp)) return ''
  return new Intl.DateTimeFormat('zh-CN', {
    timeZone: 'Asia/Shanghai',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).format(new Date(stamp))
}

export const ME_PROMPT_LIMIT = 500

const NEED_LABELS = {
  funding: '资金',
  clients: '客户',
  partners: '伙伴',
  hiring: '招人',
  info: '信息',
  other: '其他',
}

const trimTo = (value, max) => {
  const line = String(value || '').trim()
  return line.length > max ? `${line.slice(0, max)}…` : line
}

const numbered = (items, render, max = 2) =>
  items.slice(0, max).map((item, index) => `${'①②③④⑤'[index] || `${index + 1}.`} ${render(item)}`).join(' · ')

/** 「我」的档案 → 一段能塞进提示词的上下文；没有内容时返回空串。 */
export function meDossier(me) {
  if (!me || !(me.identity?.name || me.identity?.oneLiner || me.needs?.length || me.goals?.length || me.offers?.length)) {
    return ''
  }
  const who = [
    me.identity.name,
    me.identity.title,
    me.identity.company,
    me.identity.stage,
    me.identity.city,
  ].filter(Boolean).join(' · ')
  const build = (needsMax, goalsMax, offersMax) => {
    const lines = [`【我】${who || '（未填姓名）'}`]
    if (me.identity.oneLiner) lines.push(`我在做：${trimTo(me.identity.oneLiner, 120)}`)
    if (me.goals?.length) {
      lines.push(`今年目标：${numbered(me.goals, item => trimTo(item.text, 90), goalsMax)}`)
    }
    if (me.needs?.length) {
      lines.push(`现在最需要：${numbered(me.needs, item => `${NEED_LABELS[item.kind] || '其他'}：${trimTo(item.text, 80)}`, needsMax)}`)
    }
    if (me.offers?.length) {
      lines.push(`我能给别人的：${numbered(me.offers, item => trimTo(item.text, 80), offersMax)}`)
    }
    const comms = [
      me.preferences?.tone && `风格 ${me.preferences.tone}`,
      me.preferences?.channel && `渠道 ${me.preferences.channel}`,
      me.preferences?.cadence && `节奏 ${me.preferences.cadence}`,
    ].filter(Boolean)
    if (comms.length) lines.push(`沟通偏好：${comms.join(' · ')}`)
    if (me.preferences?.redLines?.length) lines.push(`忌讳：${me.preferences.redLines.slice(0, 3).join(' / ')}`)
    return lines.join('\n')
  }
  let block = build(3, 3, 3)
  if (block.length > ME_PROMPT_LIMIT) block = build(2, 2, 1)
  if (block.length > ME_PROMPT_LIMIT) block = block.slice(0, ME_PROMPT_LIMIT - 1) + '…'
  return block
}

export function dossier(contact) {
  const who = [contact.company, contact.role].filter(Boolean).join(' · ') || '（未填写公司与角色）'
  const tags = Array.isArray(contact.tags) && contact.tags.length ? contact.tags.join(' / ') : '（无）'
  const reach = [
    contact.contact?.email && `邮箱 ${contact.contact.email}`,
    contact.contact?.wechat && `微信 ${contact.contact.wechat}`,
    contact.contact?.phone && `电话 ${contact.contact.phone}`,
  ].filter(Boolean)
  const last = Array.isArray(contact.timeline) && contact.timeline.length ? contact.timeline[0] : null
  const entries = Array.isArray(contact.research?.entries) ? contact.research.entries : []
  const latest = entries[0] || null
  const research = latest
    ? `共 ${entries.length} 份，最新一份 ${date(latest.at)}·${latest.title}：${one(latest.summary, 400)}（来源 ${latest.sources?.length || 0} 条）`
    : '（暂无）'
  const lines = [
    `【人脉档案】${contact.name}${contact.nameEn ? `（${contact.nameEn}）` : ''} · ${who} · ${TYPE_LABELS[contact.type] || '其他'}${contact.city ? ` · ${contact.city}` : ''}`,
    `标签：${tags}`,
    `联系方式：${reach.length ? reach.join(' · ') : '（无）'}`,
    last ? `最近互动：${date(last.at)} ${KIND_LABELS[last.kind] || '备注'} —— ${one(last.text, 240)}` : '最近互动：（无）',
    contact.nextStep
      ? `下一步：${contact.nextStep.at ? `${date(contact.nextStep.at)} ` : ''}${one(contact.nextStep.text, 240)}`
      : '下一步：（无）',
    `已有研究：${research}`,
    contact.notes ? `备注：${one(contact.notes, 300)}` : '',
  ]
  return lines.filter(Boolean).join('\n')
}

const RULES = [
  '你在帮用户维护一份本地商业人脉档案。回答围绕这个人，需要外部事实时主动联网检索并注明来源；不要编造联系方式、互动记录或研究结论。',
  '如果用户只是聊天或让你起草消息，直接回答；如果完成了检索，用 business_contact_research_save 往这张卡追加一条研究记录（每条都要带来源 URL 与检索日期，不要覆盖旧记录）。',
].join('')

/** 普通对话 / 研究请求的完整提示词。me 是「我」的档案，用来让建议落在我的处境上。 */
export function chatPrompt(contact, text, kind = 'chat', me = null) {
  const mine = meDossier(me)
  const mineFocus = mine && kind === 'research'
    ? '\n检索时优先找「和我的目标 / 需求相关」的信息：对方的兴趣点、最近动作、能不能对上我的需要；无关的八卦不要写。'
    : ''
  const matching = mine
    ? '\n给建议时要能对上我的处境：我能给对方什么价值、对方能帮我哪条需求、下一步具体动作。带我档案里没有的信息时先问我，不要替我编。'
    : '\n目前还没有我的档案；判断「值不值得见 / 该聊什么」时说明信息不足，并建议我先补全自己的情况。'
  const research = kind === 'research'
    ? '\n这次是研究请求，必须真的联网检索（搜索网页 / 抓取页面），不能只靠已有记忆：'
      + '\n1) 至少找到 3 条公开来源，逐条记下 URL 与站点；'
      + '\n2) 正文区分「事实（有来源）」和「推测」，重要结论后标注来源；'
      + '\n3) 最后调用 business_contact_research_save 追加一条新记录：summary 写全文结论，sources 传 URL 列表，title 用一句话概括这次查到的重点；'
      + '\n4) 如果一条可靠来源都搜不到，就在对话里说明搜不到，不要调用保存工具、不要编造来源。'
    : ''
  return `${mine ? `${mine}\n\n` : ''}${dossier(contact)}\n\n${RULES}${mineFocus}${research}${matching}\n\n用户：${text}`
}

/** 研究请求的默认关注点。 */
export function researchInstruction(focus) {
  const target = typeof focus === 'string' && focus.trim() ? focus.trim() : '最近半年的公开动态、关注方向，以及和我们的潜在合作点'
  return target
}

/** 一句话新建：让 DSH 直接把用户的话整理成一张名片。 */
export function composePrompt(text, first = true) {
  const task = [
    '你在帮用户用一句话新建一张商业人脉名片。',
    first ? `用户说：${text}` : `用户补充：${text}`,
    '',
    '请直接调用 business_contact_save 建档，不要反问，也不要搜索网页。',
    '能从这句话推断的字段就填：姓名、英文名、角色、公司、类型（investor/partner/client/advisor/other，判断不了用 other）、城市、标签（最多 4 个）、邮箱/微信/电话、备注。',
    '不确定的字段留空，不要编造。姓名是必填；如果这句话里确实没有名字，只回一句「这个人的名字是？」。',
    '建档成功后只回复「已建好」，不要重复整份档案。',
  ]
  return task.join('\n')
}
