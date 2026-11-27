# Changelog

本项目的更新记录。每次改动都要在这里补一条：开发过程中写在 `[Unreleased]`，发版时改成对应版本号和日期。

格式参考 [Keep a Changelog](https://keepachangelog.com/zh-CN/1.1.0/)；版本号遵循 [SemVer](https://semver.org/lang/zh-CN/)。

## [Unreleased]

### Added
- 自定义分类：「我的名片」旁边的分类可按需增删改名，删除时该分类下的名片自动并入「其他」（`types.json`）。
- 研究记录写成结构化 Markdown（一句话结论 / 事实（附来源）/ 判断（推测）/ 下一步动作，800–1500 字）；老记录展示时自动整理成小标题 + 列表。
- 会话三层兜底：本地缓存上限 2000 条 + `.bak` 回退；缓存丢失从 DSH 会话回读最近 120 条；DSH 会话失效自动重建并重试。
- 「我的名片」恢复手动编辑入口（表单），与会话式补全并存。
- 区块操作按钮（研究一轮 / 记一条）改成带图标的胶囊按钮。
- 工具调用 JSON 报错的人话提示（超时 / 上下文超限 / 参数格式各有说明）。
- 仓库补 `LICENSE`（MIT）、本 `CHANGELOG.md`。

### Changed
- 研究写回参数瘦身：`sources` 改为纯 URL 字符串数组；检索最多 6 次就收尾，降低长链路下模型输出非法 JSON 的概率。
- 左栏、会话区、窄屏详情页隐藏原生滚动条；长链接、表格不再撑宽。
- 插件补 `⌘R` / `Ctrl+R` 刷新界面（打包版 DSH 菜单里没有 reload 项）。

## [0.4.0] - 2026-11-27

### Added
- 「我的名片」改为会话式提问补全：DSH 一次问一个问题，没答的问题挂在会话底部（`/me/chat/*`、`meQuestions()`）。
- 会话正文 Markdown 渲染：标题 / 列表 / 引用 / 代码块 / 行内代码 / 粗体斜体删除线 / 链接 / 表格（含对齐）。
- 插件级 `⌘R` / `Ctrl+R` 刷新界面。

### Changed
- 左栏与会话区不再显示原生滚动条；窄屏详情页同样处理。
- 分类标签、卡片、编辑器下拉改为按数据渲染（为后续自定义分类铺路）。

## [0.3.1] - 2026-11-27

### Changed
- README 展示名片墙与详情截图，去掉指向父目录的失效链接。

## [0.3.0] - 2026-11-27

### Changed
- 包改名 `dsh-business-cards` → `dsh-business-agent`（与仓库同名）；旧包 `npm deprecate` 指向新包。
- 入口 id（`business-cards`）与数据目录（`$DSH_HOME/business-cards/`）保持不变，老数据无损。

## [0.2.0] - 2026-11-27

### Added
- 「我的名片」个人档案 `me.json`：身份 / 目标 / 需求 / 能给 / 沟通偏好。
- 首次打开 6 问引导；提示词注入（≤500 字）与「建议落到三块」约束。
- agent 工具 `business_me_get` / `business_me_save`。

## [0.1.0] - 2026-11-27

### Added
- 首个 npm 版本：悬挂名片墙、一句话新建、联系人详情（卡可翻面）、每人绑定真实 DSH 会话。
- 研究文档：每轮联网检索一份带日期与来源的记录，左栏列表 + 弹窗阅读。
- 6 个 agent 工具：`business_contact_list` / `get` / `save` / `note` / `research` / `research_save`。
- 数据全部落在本机 `$DSH_HOME/business-cards/`。
