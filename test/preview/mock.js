// 预览用假后端：只在 test/preview 里跑，不参与发布产物。
export const CONTACTS = [
  {
    id: 'c_shen', no: 1, name: '沈亦舟', nameEn: 'Yizhou Shen', type: 'investor', role: '合伙人', company: '红杉中国',
    city: '北京', accent: 'orchid', tags: ['AI 应用', 'B 轮'],
    contact: { email: 'yz.shen@sequoia.cn', wechat: 'shenyizhou', phone: '+86 138 0013 8000' },
    nextStep: { at: '2026-12-03T15:00:00+08:00', text: '约了 45 分钟电话，想把 B 轮的节奏和这一轮的对象先对一下。' },
    notes: '偏好先看留存，再看 ARPU。',
    lastContactAt: '2026-11-24T10:12:00+08:00',
    timeline: [
      { id: 't1', at: '2026-11-16T09:00:00+08:00', kind: 'wechat', text: '问了下这轮融资节奏，她说「别急着定价，先把留存曲线做扎实」。' },
      { id: 't2', at: '2026-10-28T15:00:00+08:00', kind: 'meeting', text: '国贸，聊了 40 分钟；对 AI 客服那条线很感兴趣。' },
      { id: 't3', at: '2026-09-12T11:00:00+08:00', kind: 'email', text: '发了一份市场地图，已读。' },
    ],
    research: {
      updatedAt: '2026-11-24T12:00:00+08:00',
      entries: [
        {
          id: 'r_shen_2', at: '2026-11-24T12:00:00+08:00', title: 'AI 应用层的商业化口径',
          focus: '最近半年的公开动态、关注方向，以及和我们的潜在合作点',
          summary: '近 90 天公开露面集中在 AI 应用层的商业化：反复提到「先看留存，再看 ARPU」，并在 9 月闭门会上把「AI + 垂直工作流」列为今年重点。\n\n事实：9 月闭门会公开纪要里出现「先看留存，再看 ARPU」的原话（36kr）。\n推测：她对「AI 客服 + 行业模板」的兴趣可能高于通用 agent。',
          sources: [
            { title: '红杉闭门会：AI 应用层的下一步', url: 'https://36kr.com/p/1', site: '36kr.com' },
            { title: '沈亦舟：先看留存，再看 ARPU', url: 'https://latepost.com/p/2', site: 'latepost.com' },
            { title: '2026 早期投资重点', url: 'https://sequoia.cn/p/3', site: 'sequoia.cn' },
          ],
        },
        {
          id: 'r_shen_1', at: '2026-09-20T18:30:00+08:00', title: '9 月闭门会与赛道判断',
          focus: '投资组合与赛道偏好',
          summary: '9 月闭门会上把「AI + 垂直工作流」列为本年重点，提到已投的两家客服 SaaS 增长都在翻倍。',
          sources: [
            { title: '红杉闭门会纪要', url: 'https://36kr.com/p/1', site: '36kr.com' },
          ],
        },
      ],
    },
    sessionId: 's_preview_shen', createdAt: '2026-10-01T10:00:00+08:00', updatedAt: '2026-11-24T10:12:00+08:00',
  },
  {
    id: 'c_zhou', no: 2, name: '周牧', nameEn: 'Mu Zhou', type: 'client', role: '创始人 & CEO', company: '观夏',
    city: '上海', accent: 'peach', tags: ['品牌', 'DTC'],
    contact: { email: 'mu@tosummer.com', wechat: 'zhoumu', phone: '+86 139 0000 0000' },
    nextStep: { at: '2026-12-02T10:00:00+08:00', text: '把联名方案的第二版发过去，重点改预算和排期。' },
    notes: '', lastContactAt: '2026-11-20T10:00:00+08:00',
    timeline: [{ id: 't1', at: '2026-11-09T10:00:00+08:00', kind: 'meeting', text: '看完联名方案，认可调性，预算要再压 15%。' }],
    research: {
      updatedAt: '2026-11-18T09:00:00+08:00',
      entries: [
        {
          id: 'r_zhou_1', at: '2026-11-18T09:00:00+08:00', title: '线下体验与联名节奏',
          focus: '今年的品牌动作',
          summary: '今年把重心放在线下体验和内容联名，新店开在安福路；公开采访里强调「不追规模，先把单店模型跑正」。',
          sources: [{ title: '品牌星球', url: 'https://brandstar.com.cn/a', site: 'brandstar.com.cn' }],
        },
      ],
    },
    sessionId: null, createdAt: '2026-10-02T10:00:00+08:00', updatedAt: '2026-11-20T10:00:00+08:00',
  },
  {
    id: 'c_lin', no: 3, name: '林晚', nameEn: 'Wan Lin', type: 'investor', role: '投资总监', company: '高瓴创投',
    city: '北京', accent: 'sage', tags: ['消费', '出海'],
    contact: { email: 'wan.lin@hillhouse.com', wechat: 'linwan_vc', phone: '+86 137 0000 0000' },
    nextStep: { at: null, text: '等她看完出海赛道的一手调研，再约一次咖啡。' },
    notes: '', lastContactAt: '2026-11-10T10:00:00+08:00',
    timeline: [{ id: 't1', at: '2026-11-02T10:00:00+08:00', kind: 'wechat', text: '说最近在看东南亚的消费供应链。' }],
    research: {
      updatedAt: '2026-11-02T10:00:00+08:00',
      entries: [
        {
          id: 'r_lin_1', at: '2026-11-02T10:00:00+08:00', title: '消费出海与东南亚',
          focus: '近半年关注方向',
          summary: '关注消费出海与供应链，近半年频繁看东南亚市场；在公开分享里提到「本地化不是翻译，是重做渠道」。',
          sources: [],
        },
      ],
    },
    sessionId: null, createdAt: '2026-10-03T10:00:00+08:00', updatedAt: '2026-11-10T10:00:00+08:00',
  },
  {
    id: 'c_chen', no: 4, name: '陈可为', nameEn: 'Kewei Chen', type: 'partner', role: '增长 VP', company: 'Notion 中国',
    city: '上海', accent: 'sky', tags: ['增长', 'SaaS'],
    contact: { email: 'kewei@notion.so', wechat: 'chenkw', phone: '' },
    nextStep: { at: '2026-11-28T14:00:00+08:00', text: '一起过一遍 PLG 的漏斗，看看能不能互推。' },
    notes: '', lastContactAt: '2026-11-21T10:00:00+08:00',
    timeline: [], research: { updatedAt: null, entries: [] },
    sessionId: null, createdAt: '2026-10-04T10:00:00+08:00', updatedAt: '2026-11-21T10:00:00+08:00',
  },
  {
    id: 'c_gu', no: 5, name: '顾宁', nameEn: 'Ning Gu', type: 'client', role: '品牌负责人', company: '三顿半',
    city: '长沙', accent: 'rose', tags: ['联名', '内容'],
    contact: { email: 'ning@saturnbird.com', wechat: 'guning', phone: '' },
    nextStep: null, notes: '', lastContactAt: '2026-11-06T10:00:00+08:00',
    timeline: [], research: { updatedAt: null, entries: [] },
    sessionId: null, createdAt: '2026-10-05T10:00:00+08:00', updatedAt: '2026-11-06T10:00:00+08:00',
  },
  {
    id: 'c_su', no: 6, name: '苏迟', nameEn: 'Chi Su', type: 'partner', role: '联合创始人', company: '山海云',
    city: '深圳', accent: 'butter', tags: ['云', '渠道'],
    contact: { email: 'chi@shanhaiyun.com', wechat: 'suchi', phone: '' },
    nextStep: null, notes: '', lastContactAt: '2026-11-19T10:00:00+08:00',
    timeline: [], research: { updatedAt: null, entries: [] },
    sessionId: null, createdAt: '2026-10-06T10:00:00+08:00', updatedAt: '2026-11-19T10:00:00+08:00',
  },
  {
    id: 'c_luo', no: 7, name: '罗一', nameEn: 'Yi Luo', type: 'investor', role: '天使投资人', company: '个人',
    city: '杭州', accent: 'blue', tags: ['种子轮', '硬件'],
    contact: { email: 'yi.luo@hey.com', wechat: 'luoyi_angel', phone: '' },
    nextStep: null, notes: '', lastContactAt: '2026-11-15T10:00:00+08:00',
    timeline: [], research: { updatedAt: null, entries: [] },
    sessionId: null, createdAt: '2026-10-07T10:00:00+08:00', updatedAt: '2026-11-15T10:00:00+08:00',
  },
  {
    id: 'c_bai', no: 8, name: '白露', nameEn: 'Lu Bai', type: 'advisor', role: '独立品牌顾问', company: '—',
    city: '成都', accent: 'sage', tags: ['定位', '叙事'],
    contact: { email: 'lu@bai.studio', wechat: 'bailu_studio', phone: '' },
    nextStep: null, notes: '', lastContactAt: '2026-09-18T10:00:00+08:00',
    timeline: [], research: { updatedAt: null, entries: [] },
    sessionId: null, createdAt: '2026-10-08T10:00:00+08:00', updatedAt: '2026-09-18T10:00:00+08:00',
  },
]

const DEMO_CHAT = [
  { seq: 1, role: 'user', text: '她最近半年在公开场合都聊什么？下周电话我想切进 B 轮的话题。', at: '2026-11-24T14:01:00+08:00' },
  { seq: 2, role: 'tool', name: 'web_search', text: '搜索公开信息', at: '2026-11-24T14:02:00+08:00' },
  { seq: 3, role: 'assistant', text: '沈亦舟最近三个月的公开发言集中在两件事：**AI 应用层的收入模型**，以及她投的那家 AI 客服公司的出海。9 月的红杉闭门会上，她提过一句「先看留存，再看 ARPU」——这句大概率就是她看 B 轮项目的锚点。\n\n## 两点研判（推测，标注清楚）\n\n- 她现在的**决策权边界比头衔小**：产品归赵祺，销售归谭待，她管的是产品方向与对外叙事。合作要「轻」、要能进她的叙事（Agent 落地、效果标准），重商务条款的会谈不动。\n- 不宜把长期合作押在她个人任职上：组织调整刚发生，11 月又起离职传闻（已辟谣）。可以经营关系，但合同主体和交付依赖要放在组织层面。\n\n## 破冰建议（不编造，只用公开事实）\n\n下周的电话，我建议从这三个点切：\n\n1. 先给留存曲线，别急着讲规模。她更在意单位经济模型跑不跑得正。\n2. 把 AI 客服那条线当成案例：我们和她的被投在同一批客户里，可以顺势问一句介绍。\n3. B 轮节奏留白：先说「我们在看明年 Q1 的窗口」，看她怎么接。\n\n> 别碰 11 月的离职话题——她刚为此改过微信名，明显烦这件事。\n\n顺手帮你起草了开场微信（模板里的 `{name}` 换成她的称呼），要写进备注吗？', at: '2026-11-24T14:02:12+08:00' },
  { seq: 4, role: 'assistant', text: '来源：36kr.com · latepost.com · sequoia.cn', at: '2026-11-24T14:02:14+08:00' },
]

export const ME = {
  updatedAt: '2026-11-26T18:20:00+08:00',
  identity: {
    name: '石璐', nameEn: 'Lu Shi', title: '创始人', company: 'Achoverse',
    oneLiner: '做 AI 原生的社区与开发工具', city: '上海', stage: '种子轮',
  },
  needs: [
    { id: 'n_1', kind: 'funding', text: 'Q1 前融完 500 万种子轮', dueAt: '2026-03-31T00:00:00+08:00' },
    { id: 'n_2', kind: 'hiring', text: '找一位懂社区运营的合伙人' },
  ],
  offers: [{ id: 'o_1', text: '帮人看 AI 产品的技术选型与产品结构' }],
  goals: [{ id: 'g_1', text: '跑通 3 个标杆客户的付费，ARR 30 万' }],
  preferences: { tone: '直接、少寒暄', channel: '微信优先', cadence: '重要的人 3 周一次', redLines: ['周末不发工作消息'] },
  sources: [
    { kind: 'form', at: '2026-11-26T18:10:00+08:00', field: 'identity', note: '手填：公司、阶段、一句话' },
    { kind: 'chat', at: '2026-11-26T18:18:00+08:00', field: 'needs.n_1', note: '对话里说：我们在融种子轮，Q1 前要 close' },
  ],
}

const QUESTIONS = [
  ['identity.name', 'identity', me => !me.identity?.name, '你叫什么名字？'],
  ['identity.oneLiner', 'identity', me => !me.identity?.oneLiner, '一句话说说你在做什么？'],
  ['identity.stage', 'identity', me => !me.identity?.stage, '你现在是什么阶段（种子轮 / A 轮 / 已盈利 / 其他）？'],
  ['goals', 'goals', me => !me.goals?.length, '今年最重要的一件事是什么？'],
  ['needs', 'needs', me => !me.needs?.length, '你现在最需要什么（资金 / 客户 / 伙伴 / 招人 / 信息）？'],
  ['offers', 'offers', me => !me.offers?.length, '你能给别人带来什么价值？'],
  ['preferences.redLines', 'preferences', me => !me.preferences?.redLines?.length, '沟通上有什么忌讳（比如周末别发工作消息）？'],
]

const questionsOf = me =>
  QUESTIONS.filter(([, , missing]) => missing({ ...me, identity: me.identity || {}, preferences: { redLines: [], ...(me.preferences || {}) } }))
    .map(([key, field, , question]) => ({ key, field, question }))

const now = () => new Date().toISOString()
const sleep = ms => new Promise(resolve => setTimeout(resolve, ms))

export function installMockApi({ dark = false, emptyProfile = false } = {}) {
  let contacts = JSON.parse(JSON.stringify(CONTACTS))
  let me = emptyProfile
    ? { updatedAt: null, identity: {}, needs: [], offers: [], goals: [], preferences: { redLines: [] }, sources: [] }
    : JSON.parse(JSON.stringify(ME))
  let revision = 7
  let meChat = []
  let meChatRunning = false
  const chats = new Map([['c_shen', { seq: 4, entries: DEMO_CHAT, sessionId: 's_preview_shen', running: false }]])
  const runs = new Map()
  const composes = new Map()
  let composeSeq = 0

  const chatOf = id => {
    if (!chats.has(id)) chats.set(id, { seq: 0, entries: [], sessionId: null, running: false })
    return chats.get(id)
  }

  const reply = async id => {
    const chat = chatOf(id)
    const run = { running: true }
    runs.set(id, run)
    await sleep(500)
    chat.seq += 1
    chat.entries.push({ seq: chat.seq, role: 'tool', name: 'web_search', text: '搜索公开信息', at: now() })
    await sleep(900)
    chat.seq += 1
    chat.entries.push({
      seq: chat.seq,
      role: 'assistant',
      text: '看了一圈公开信息：她过去半年的重点没有变，还是 **AI 应用层的收入质量**。不过有一条新线索——她最近在投的一家公司开始做出海，和你们想切的东南亚市场有交集。\n\n建议电话里先问「**出海是先做产品还是先做渠道**」，这比直接讲 B 轮更容易打开她的话匣子。',
      at: now(),
    })
    await sleep(300)
    run.running = false
    revision += 1
  }

  window.fetch = async (input, init = {}) => {
    const url = new URL(input, 'file://preview/')
    const path = url.pathname
    const body = init.body ? JSON.parse(init.body) : {}
    const send = data => ({
      ok: true,
      status: 200,
      json: async () => ({ ok: true, ...data }),
    })
    await sleep(60)

    if (path.endsWith('/business-cards/state')) {
      return send({ revision, contacts: JSON.parse(JSON.stringify(contacts)), me, hasMe: Boolean(me.identity?.name), questions: questionsOf(me), capabilities: { chat: true } })
    }
    if (path.endsWith('/business-cards/me/chat/state')) {
      return send({ revision, entries: meChat, running: meChatRunning, questions: questionsOf(me), sessionId: 's_preview_me' })
    }
    if (path.endsWith('/business-cards/me/chat/start')) {
      if (meChat.length) return send({ started: false })
      const next = questionsOf(me)[0]
      meChatRunning = true
      meChat = [
        {
          seq: 1,
          role: 'assistant',
          text: `好，先补一条最关键的：**${next?.question || '还有什么想补充的？'}**\n\n（回答后我会直接存进「我的名片」，然后问下一个。）`,
          at: now(),
        },
      ]
      meChatRunning = false
      revision += 1
      return send({ started: true })
    }
    if (path.endsWith('/business-cards/me/chat/send')) {
      const text = String(body.text || '')
      meChat = [...meChat, { seq: meChat.length + 1, role: 'user', text, at: now() }]
      meChatRunning = true
      revision += 1
      void (async () => {
        await sleep(900)
        meChat.push({ seq: meChat.length + 1, role: 'tool', name: 'business_me_save', text: '更新档案', at: now() })
        const remaining = questionsOf(me).filter(item => !text.includes(item.question))
        const next = remaining[0]
        meChat.push({
          seq: meChat.length + 1,
          role: 'assistant',
          text: next ? `记下了。下一个：**${next.question}**` : '清单问完了。以后想到什么随时补一句，我会覆盖更新。',
          at: now(),
        })
        meChatRunning = false
        revision += 1
      })()
      return send({ ok: true })
    }
    if (path.endsWith('/business-cards/op')) {
      if (body.action === 'me') {
        const patch = body.patch || {}
        me = {
          ...me,
          identity: { ...me.identity, ...(patch.identity || {}) },
          preferences: { ...me.preferences, ...(patch.preferences || {}) },
          needs: patch.needs !== undefined ? patch.needs : me.needs,
          offers: patch.offers !== undefined ? patch.offers : me.offers,
          goals: patch.goals !== undefined ? patch.goals : me.goals,
          updatedAt: now(),
        }
        revision += 1
        return send({ me, hasMe: Boolean(me.identity?.name), questions: questionsOf(me), state: { revision, contacts } })
      }
      if (body.action === 'meReset') {
        me = { updatedAt: now(), identity: {}, needs: [], offers: [], goals: [], preferences: { redLines: [] }, sources: [] }
        revision += 1
        return send({ me, hasMe: false, state: { revision, contacts } })
      }
      if (body.action === 'save') {
        const draft = body.contact || {}
        if (draft.id) {
          const index = contacts.findIndex(item => item.id === draft.id)
          if (index >= 0) contacts[index] = { ...contacts[index], ...draft, updatedAt: now() }
          revision += 1
          return send({ contact: contacts[index], state: { revision, contacts } })
        }
        const contact = {
          ...draft,
          id: `c_${Date.now()}`,
          no: contacts.length + 1,
          timeline: [],
          research: { updatedAt: null, entries: [] },
          createdAt: now(),
          updatedAt: now(),
        }
        contacts = [contact, ...contacts]
        revision += 1
        return send({ contact, state: { revision, contacts } })
      }
      if (body.action === 'delete') {
        contacts = contacts.filter(item => item.id !== body.id)
        revision += 1
        return send({ state: { revision, contacts } })
      }
      if (body.action === 'note') {
        const contact = contacts.find(item => item.id === body.id)
        if (contact) {
          contact.timeline = [{ id: `t_${Date.now()}`, at: now(), kind: body.kind || 'note', text: body.text }, ...(contact.timeline || [])]
          contact.lastContactAt = now()
        }
        revision += 1
        return send({ contact, state: { revision, contacts } })
      }
      return send({ state: { revision, contacts } })
    }
    if (path.endsWith('/business-cards/compose')) {
      const id = body.id || `cmp_preview_${++composeSeq}`
      const record = composes.get(id) || { id, status: 'pending', reply: '', contactId: null }
      composes.set(id, record)
      const name = String(body.text || '').split(/[，,]/)[0].trim() || '新联系人'
      void (async () => {
        await sleep(1600)
        const contact = {
          id: `c_${Date.now()}`,
          no: contacts.length + 1,
          name,
          nameEn: '',
          type: 'other',
          role: '',
          company: '',
          city: '',
          accent: 'orchid',
          tags: [],
          contact: { email: '', wechat: '', phone: '' },
          nextStep: null,
          notes: '',
          lastContactAt: now(),
          timeline: [],
          research: { updatedAt: null, entries: [] },
          sessionId: null,
          createdAt: now(),
          updatedAt: now(),
        }
        contacts = [contact, ...contacts]
        revision += 1
        record.status = 'done'
        record.contactId = contact.id
        record.reply = '已建好'
      })()
      return send({ id, status: 'pending', reply: '' })
    }
    if (path.endsWith('/business-cards/compose/state')) {
      const id = url.searchParams.get('id')
      const record = composes.get(id)
      return send(record || { status: 'error', error: '这次新建已经结束' })
    }
    if (path.endsWith('/business-cards/chat/state')) {
      const id = url.searchParams.get('id')
      const after = Number(url.searchParams.get('after') || 0)
      const chat = chatOf(id)
      const contact = contacts.find(item => item.id === id)
      return send({
        sessionId: chat.sessionId,
        revision,
        running: Boolean(runs.get(id)?.running),
        error: '',
        lastSeq: chat.seq,
        entries: chat.entries.filter(entry => entry.seq > after),
        contact,
      })
    }
    if (path.endsWith('/business-cards/chat/send')) {
      const chat = chatOf(body.id)
      chat.sessionId = chat.sessionId || `s_preview_${body.id}`
      chat.seq += 1
      chat.entries.push({ seq: chat.seq, role: 'user', text: body.text, at: now() })
      void reply(body.id)
      return send({ sessionId: chat.sessionId })
    }
    if (path.endsWith('/business-cards/research')) {
      const contact = contacts.find(item => item.id === body.id)
      const chat = chatOf(body.id)
      chat.sessionId = chat.sessionId || `s_preview_${body.id}`
      chat.seq += 1
      chat.entries.push({ seq: chat.seq, role: 'user', text: '研究此人：最近半年的公开动态、关注方向，以及和我们的潜在合作点', at: now() })
      void (async () => {
        const run = { running: true }
        runs.set(body.id, run)
        await sleep(600)
        chat.seq += 1
        chat.entries.push({ seq: chat.seq, role: 'tool', name: 'web_search', text: '搜索公开信息', at: now() })
        await sleep(1200)
        chat.seq += 1
        chat.entries.push({ seq: chat.seq, role: 'assistant', text: '研究报告已写回档案：近 90 天有 4 条公开动态，集中在 AI 应用与企业服务，新增 2 条来源。', at: now() })
        if (contact) {
          contact.research = {
            summary: '近 90 天有 4 条公开动态，集中在 AI 应用与企业服务；9 月提到「先看留存，再看 ARPU」，近期开始关注出海。',
            sources: [{ title: '36kr', url: 'https://36kr.com/p/9', site: '36kr.com' }, { title: 'latepost', url: 'https://latepost.com/p/9', site: 'latepost.com' }],
            updatedAt: now(),
          }
        }
        revision += 1
        run.running = false
      })()
      return send({ sessionId: chat.sessionId })
    }
    if (path.endsWith('/business-cards/chat/stop')) {
      const run = runs.get(body.id)
      if (run) run.running = false
      const chat = chatOf(body.id)
      chat.seq += 1
      chat.entries.push({ seq: chat.seq, role: 'system', text: '已停止', at: now() })
      return send({})
    }
    return { ok: false, status: 404, json: async () => ({ ok: false, error: 'not found' }) }
  }

  window.__BC_THEME__ = dark ? 'dark' : 'light'
}
