// 投给模型的档案上下文与研究指令。控制长度，只放会改变回答的信息。
// 「我」的档案（me.json）压缩成 ≤ 500 字，拼在对方档案前面。
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

const typeLabelOf = (types, id) =>
  (Array.isArray(types) ? types.find(item => item.id === id)?.label : '') || '其他'

export function dossier(contact, types = []) {
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
    `【人脉档案】${contact.name}${contact.nameEn ? `（${contact.nameEn}）` : ''} · ${who} · ${typeLabelOf(types, contact.type)}${contact.city ? ` · ${contact.city}` : ''}`,
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

/** 「我的档案」还缺哪些信息：会话里按这个清单一个个问，页面上也显示成待回答的问题。 */
export function meQuestions(me) {
  const identity = me?.identity || {}
  const prefs = me?.preferences || {}
  const list = []
  if (!identity.name) list.push({ key: 'identity.name', field: 'identity', question: '你叫什么名字？' })
  if (!identity.oneLiner) list.push({ key: 'identity.oneLiner', field: 'identity', question: '一句话说说你在做什么？' })
  if (!identity.stage) list.push({ key: 'identity.stage', field: 'identity', question: '你现在是什么阶段（种子轮 / A 轮 / 已盈利 / 其他）？' })
  if (!me?.goals?.length) list.push({ key: 'goals', field: 'goals', question: '今年最重要的一件事是什么？' })
  if (!me?.needs?.length) list.push({ key: 'needs', field: 'needs', question: '你现在最需要什么（资金 / 客户 / 伙伴 / 招人 / 信息）？' })
  if (!me?.offers?.length) list.push({ key: 'offers', field: 'offers', question: '你能给别人带来什么价值？' })
  if (!prefs.redLines?.length) list.push({ key: 'preferences.redLines', field: 'preferences', question: '沟通上有什么忌讳（比如周末别发工作消息）？' })
  return list
}

const ME_CHAT_RULES = [
  '你在帮用户补全他/她自己的「我的名片」（本地档案），不是聊某个联系人。',
  '规则：',
  '1. 一次只问一个问题：从「还没填」里挑最关键的一个，问完等回答，不要一口气列多个问题。',
  '2. 用户回答后，用 business_me_save 保存；一次说了多条就分字段存，source.note 填用户原话（可截断）。',
  '3. 已经填过的不重复问；用户说「不知道 / 跳过 / 以后再说」就记下跳过，直接问下一个。',
  '4. 不编造，不把推测写成事实；数字、金额、人名必须以用户说的为准。',
  '5. 每轮回复要短：一句确认（存了什么）+ 下一个问题。',
  '6. 清单问完或用户说「够了」就收尾：一句话总结档案里现在有什么，并提醒随时可以回来补充。',
].join('\n')

/** 「我的名片」会话：主动提问 + 边问边存。 */
export function meChatPrompt(me, text) {
  const current = meDossier(me) || '（还没有任何信息）'
  const gaps = meQuestions(me)
  const gapText = gaps.length
    ? gaps.map((item, index) => `${index + 1}. ${item.question}（${item.field}）`).join('\n')
    : '（都已填，不用再问清单；可以聊聊还有没有想补充的）'
  return `${current}\n\n【还没填】\n${gapText}\n\n${ME_CHAT_RULES}\n\n用户：${text}`
}

/** 第一次进「我的名片」时用它开场。 */
export const ME_CHAT_KICKOFF = '开始吧：看一下我的档案，从还没填的内容里挑最关键的一个问题问我。'

/** 普通对话 / 研究请求的完整提示词。me 是「我」的档案，用来让建议落在我的处境上。 */
export function chatPrompt(contact, text, kind = 'chat', me = null, types = []) {
  const mine = meDossier(me)
  const mineFocus = mine && kind === 'research'
    ? '\n检索时优先找「和我的目标 / 需求相关」的信息：对方的兴趣点、最近动作、能不能对上我的需要；无关的八卦不要写。'
    : ''
  const matching = mine
    ? '\n给建议时要能对上我的处境：我能给对方什么价值、对方能帮我哪条需求、下一步具体动作。带我档案里没有的信息时先问我，不要替我编。'
    : '\n目前还没有我的档案；判断「值不值得见 / 该聊什么」时说明信息不足，并建议我先补全自己的情况。'
  const research = kind === 'research'
    ? '\n这次是研究请求，必须真的联网检索（搜索网页 / 抓取页面），不能只靠已有记忆：'
      + '\n1) 搜索 + 抓取合计最多 6 次，够 3 条可靠来源就收尾，别逐个页面翻下去；'
      + '\n2) 正文区分「事实（有来源）」和「推测」，重要结论后标注来源；'
      + '\n3) 最后调用 business_contact_research_save 追加一条新记录：summary 写成 Markdown 文档（800-1500 字，别缩水成三句话），sources 直接传 URL 字符串数组（2-5 条），title 一句话概括重点；'
      + '\n   记录结构固定为：`## 一句话结论` + `## 事实（附来源）`（列表，写清日期、数字、原话，能放表格就放表格）+ `## 判断（推测）` + `## 下一步动作`（编号列表，具体到做什么、什么时候）。'
      + '\n4) 保存工具如果报错/参数被拒，先把 summary 压到 500 字以内、来源减到 3 条再试一次，别反复发大段 JSON；'
      + '\n5) 如果一条可靠来源都搜不到，就在对话里说明搜不到，不要调用保存工具、不要编造来源。'
    : ''
  return `${mine ? `${mine}\n\n` : ''}${dossier(contact, types)}\n\n${RULES}${mineFocus}${research}${matching}\n\n用户：${text}`
}

/** 研究请求的默认关注点。 */
export function researchInstruction(focus) {
  const target = typeof focus === 'string' && focus.trim() ? focus.trim() : '最近半年的公开动态、关注方向，以及和我们的潜在合作点'
  return target
}

/** 一句话新建：让 DSH 直接把用户的话整理成一张名片。 */
export function composePrompt(text, first = true, types = []) {
  const task = [
    '你在帮用户用一句话新建一张商业人脉名片。',
    first ? `用户说：${text}` : `用户补充：${text}`,
    '',
    '请直接调用 business_contact_save 建档，不要反问，也不要搜索网页。',
    `能从这句话推断的字段就填：姓名、英文名、角色、公司、类型、城市、标签（最多 4 个）、邮箱/微信/电话、备注。`,
    `类型只能从这些 id 里选（不要自己造）：${(Array.isArray(types) && types.length ? types : [{ id: 'other', label: '其他' }]).map(item => `${item.id}（${item.label}）`).join('、')}；判断不了就用 other。`,
    '不确定的字段留空，不要编造。姓名是必填；如果这句话里确实没有名字，只回一句「这个人的名字是？」。',
    '建档成功后只回复「已建好」，不要重复整份档案。',
  ]
  return task.join('\n')
}
