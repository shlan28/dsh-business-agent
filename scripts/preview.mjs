// 用真实客户端组件 + 假后端渲染一张预览页，方便没装插件时截图验收。
import { build } from 'esbuild'
import { mkdir, writeFile } from 'node:fs/promises'
import { join } from 'node:path'

const root = new URL('..', import.meta.url).pathname
const outDir = join(root, 'test/preview/dist')
await mkdir(outDir, { recursive: true })

await build({
  entryPoints: [join(root, 'test/preview/entry.jsx')],
  outfile: join(outDir, 'app.js'),
  bundle: true,
  format: 'iife',
  platform: 'browser',
  target: 'chrome120',
  jsx: 'transform',
  loader: { '.css': 'text' },
  define: { 'process.env.NODE_ENV': '"production"' },
  minify: false,
  legalComments: 'none',
})

await writeFile(
  join(root, 'test/preview/index.html'),
  `<!doctype html>
<html lang="zh-CN">
<head>
<meta charset="utf-8" />
<meta name="viewport" content="width=device-width, initial-scale=1" />
<title>business cards preview</title>
<style>html, body, #root { height: 100%; margin: 0; background: #f7f7f6; }</style>
</head>
<body>
<div id="root"></div>
<script src="./dist/app.js"></script>
</body>
</html>
`,
)

console.log('preview built: test/preview/index.html')
