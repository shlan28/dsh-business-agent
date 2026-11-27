import test from 'node:test'
import assert from 'node:assert/strict'
import { humanizeError } from '../client/errors.js'

test('invalid tool JSON gets a human message and keeps the raw detail', () => {
  const result = humanizeError('DeepSeek Messages stream: tool input is invalid JSON')
  assert.match(result.message, /工具调用格式出错/)
  assert.match(result.message, /研究一轮/)
  assert.match(result.detail, /invalid JSON/)
})

test('context overflow and timeouts get their own hints', () => {
  assert.match(humanizeError('maximum context length exceeded').message, /上下文/)
  assert.match(humanizeError('ETIMEDOUT').message, /超时/)
})

test('unknown errors pass through and empty input is guarded', () => {
  assert.equal(humanizeError('boom').message, 'boom')
  assert.equal(humanizeError('boom').detail, '')
  assert.equal(humanizeError('').message, '未知错误')
})
