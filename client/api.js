// 面板 ↔ Host 的唯一数据通道。
export async function api(path, { method = 'GET', body } = {}) {
  const response = await fetch(`/business-cards${path}`, {
    method,
    cache: 'no-store',
    headers: body === undefined ? {} : { 'content-type': 'application/json' },
    body: body === undefined ? undefined : JSON.stringify(body),
  })
  const data = await response.json().catch(() => ({}))
  if (!response.ok || data?.ok === false) {
    throw new Error(data?.error || `HTTP ${response.status}`)
  }
  return data
}
