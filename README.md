# 人脉助手（dsh-business-cards）

左侧边栏的**人脉助手**：私人商业人脉名片墙。一个联系人一张名片；点开是「左边档案 / 右边 DSH 会话」。

- 首页：左上角 `Achoverse / Business Agent` 品牌字标；可筛选、可搜索的悬挂名片墙，投资人 / 合伙人 / 客户 / 顾问一眼分开。
- 新建：一个输入框交给 DSH 建档，不用先填长表单；表单只在编辑/兜底时出现。
- 详情：ID 卡可翻面成 DOSSIER；联系方式、下一步、研究摘要、互动时间线。
- 会话：每个联系人绑定一个**真实的 DSH 会话**，共享 DSH 的搜索、工具权限、模型设置与历史；首次发消息才创建。
- 研究：点 `研究此人 ↗`，DSH 真的联网检索；**每轮结果存成一份研究文档**（结论 + 来源 URL + 检索日期），左栏按时间列出，点开弹窗读全文与来源。
- Agent 工具：主会话里也能说「把沈亦舟加进人脉」「记一笔上周的电话」，或用工具查人、补下一步。
- 数据：只写本机 `$DSH_HOME/business-cards/`；路由全部走 DSH 的连接鉴权。

方案与设计说明：[docs/plans/2026-11-business-cards.md](../docs/plans/2026-11-business-cards.md)
实现截图：[docs/screenshots/business-cards/](../docs/screenshots/business-cards/)

## 安装

本插件是本地目录包，没有发布到 npm。

1. 左侧栏打开「插件」→「添加插件」→「安装第三方插件」。
2. 包名或地址填本目录的绝对路径：

   ```
   /Users/shilu/achoverse-business-agent/dsh-business-agent
   ```

3. 安装完成后按提示重启 DSH。
4. 侧栏出现「人脉助手」，点开即可。

更新：本地目录改完重启 DSH 即可；停用、卸载、回滚走插件面板（卸载后按上面四步重装）。

> 2026-11-27 已用 `plugin_manager` 重新装到本机 `desktop` profile（`application: applied`，bundle `dsh-business-cards@0.1.0` 已启用，link 指向本目录），Host 工具已生效。侧栏若还没出现「人脉助手」，**刷新页面（Cmd+R）**让浏览器加载客户端模块。
>
> 源码仓库：[github.com/shlan28/dsh-business-agent](https://github.com/shlan28/dsh-business-agent)（本目录即仓库根）。

## 使用

1. 点 `+ 新增人脉`，用一句话描述这个人（例如「周牧，观夏创始人，客户，标签 品牌 / DTC」），DSH 会把它整理成名片并自动打开；信息不够时它会在同一个输入框里反问。想手动填就点「改用表单」。
2. 回到墙，点卡片进入详情；点左侧 ID 卡可翻到 DOSSIER 背面。
3. 右栏直接提问，例如「她最近半年在关注什么？」「帮我写一条跟进微信」。
4. 点右上 `研究此人 ↗`，DSH 会在同一会话里检索，并把摘要 + 来源写回左栏 RESEARCH。
5. 在左侧 TIMELINE 点 `+ 记一条`，补一次微信 / 电话 / 线下 / 邮件 / 备注。

### 在普通对话里使用

主 DSH 会话里可以直接说：

- 「把周牧加进人脉，观夏创始人，标注品牌 / DTC」
- 「沈亦舟最近在投什么？查完写回她的卡」
- 「帮我看看林晚的档案，准备明天见面」

对应工具：

| 工具 | 作用 |
|---|---|
| `business_contact_list` | 按姓名 / 公司 / 标签找人 |
| `business_contact_get` | 读完整档案 |
| `business_contact_save` | 新建或部分更新 |
| `business_contact_note` | 追加互动 |
| `business_contact_research_save` | 追加一份研究文档（摘要 + 来源 + 日期） |
| `business_contact_research` | 在该联系人的会话里发起研究 |

## 数据与隐私

- 档案：`$DSH_HOME/business-cards/contacts.json`（原子写，保留最近 3 份备份）。
- 会话渲染缓存：`$DSH_HOME/business-cards/chats/<id>.json`（每张卡最多 200 条；删除联系人时一并删除）。
- 头像：本版只使用姓氏字符章，未实现照片上传。
- 发消息 / 研究时，档案摘要会随提示词发给你配置的模型；研究时姓名、公司会发给搜索服务。插件本身不做任何遥测或云同步。

## 开发

```sh
cd dsh-business-agent
npm install --cache ./.npm-cache   # esbuild + 仅预览用的 react/react-dom
npm run build                      # 产出 dist/client.js（__ModuleLoader__ 格式）
npm test                           # 存储 / Host 集成 / 客户端 bundle 注册
npm run preview                    # 用假后端渲染真实组件，生成 test/preview/index.html
```

预览页 URL 参数：`?open=c_shen` 打开详情、`&flip` 翻卡、`?theme=dark` 暗色、`?editor` 打开新增、`&send` 自动发一条消息。

## 限制 / 待验证

- 已安装并验证：Host 工具已挂载（`business_contact_list` 返回空档案）、`/business-cards/state` 鉴权路由存在（未授权返回 401）、profile 里 bundle 为 enabled。
- 仍需刷新页面后在真机验证：`main` slot 的尺寸与滚动、`ctx.theme` 事件、`sessionController.create/prompt/cancel`、`session/event` 结构与带会话的完整 UI。
- 没有头像上传、vCard/二维码分享、CSV 导入、每周自动刷新（计划 P5）。
- 会话缓存只保留最近 200 条；更早的记录仍完整保存在 DSH 会话里，但面板暂不提供「加载更早」。
- 卡片标签上限 4 个、联系人上限 500、备注 20k 字符；研究记录每人保留最近 40 份（每份正文 8k 字、来源 8 条），超出丢最旧。
- 研究写回必须带至少 1 条 http(s) 来源，否则 `business_contact_research_save` 拒绝写入——避免「没查就编」。

## 文件

```
src/host.js      路由 + 会话接线 + 6 个工具 + 系统提示
src/store.js     contacts.json / chats 读写、校验、备份
src/prompt.js    档案上下文与研究指令
client/          UI（app / wall / person / chat / editor / ui / icons / i18n / api / styles）
scripts/         build.mjs（esbuild）、preview.mjs（真实组件 + 假后端）
test/            store / host / client-load / preview
```
