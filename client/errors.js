// 会话里的错误多为模型/网络层原话（如 "DeepSeek Messages stream: tool input is invalid JSON"），
// 这里翻成人话 + 给下一步动作，原始信息折叠成小字留着排查。
export function humanizeError(value) {
  const raw = typeof value === 'string' ? value : value?.message || String(value ?? '')
  const text = raw.trim()
  if (!text) return { message: '未知错误', detail: '' }
  if (/tool input is invalid JSON|invalid JSON|tool_calls?.*(parse|invalid)/i.test(text)) {
    return {
      message: '模型这次的工具调用格式出错，结论没有写回卡片（这张卡已有的记录不受影响）。点「研究一轮」重试一次就能好。',
      detail: text,
    }
  }
  if (/context (length|window)|maximum context|too many tokens/i.test(text)) {
    return {
      message: '这轮检索的内容超出了上下文，换个更窄的范围再试（比如只查近半年）。',
      detail: text,
    }
  }
  if (/timed? ?out|ETIMEDOUT|ECONNRESET/i.test(text)) {
    return { message: '这次请求超时或连接被重置，重试一次即可。', detail: text }
  }
  return { message: text, detail: '' }
}
