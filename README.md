# Neon Angel
Minimalist bullet hell built from the original canvas prototype and rebuilt as a Vite + React delivery project with separated data, engine, and view layers.<br/>**一个基于原始 Canvas 原型重建的极简弹幕射击项目，现已整理为具备 data、engine、view 分层的 Vite + React 交付工程。**

## Overview
- Close-range kills drop more healing packs, so aggressive positioning is the core survival loop.<br/>**近距离击杀会掉落更多血包，因此贴脸进攻就是核心生存循环。**
- Full HP enables bullet canceling on newly fired shots, creating a reward loop for flawless play.<br/>**满血状态会让新发射的子弹获得抵消敌弹能力，形成鼓励无伤操作的奖励回路。**
- Ultimate energy is earned from kills, pickups, and parries, then converted into a screen-clearing recovery tool.<br/>**大招能量来自击杀、拾取和弹幕抵消，最终转化为一次清屏兼保命的兜底技能。**

## Stack
- Vite 5 + React 18 power the project shell and GitHub Pages build pipeline.<br/>**项目外壳与 GitHub Pages 构建流水线基于 Vite 5 + React 18。**
- The gameplay loop remains canvas-driven and is now hosted inside src/logic/engine for future engine portability.<br/>**核心玩法依旧由 Canvas 驱动，现已收拢到 src/logic/engine 中，便于未来迁移到其他引擎。**
- HUD menus and overlay UI live in the view layer, while constants and balance values are stored in the data layer.<br/>**HUD 菜单与覆盖 UI 位于 view 层，常量与数值配置统一放入 data 层。**

## Structure
- origin/ keeps the original single-file source and design notes for rollback and comparison.<br/>**origin/ 保留了原始单文件源码与设计文档，便于回退和对照。**
- src/data/ stores palette, balancing rules, and copy text.<br/>**src/data/ 存放色板、数值规则与文案数据。**
- src/logic/engine/ contains entity updates, spawning, combat resolution, and rendering helpers.<br/>**src/logic/engine/ 负责实体更新、生成规则、战斗结算与渲染辅助逻辑。**
- src/logic/hooks/ bridges the engine lifecycle into the React shell.<br/>**src/logic/hooks/ 把引擎生命周期桥接到 React 外壳中。**
- src/view/ contains HUD, menus, and screen composition components.<br/>**src/view/ 包含 HUD、菜单和页面组装组件。**

## Commands
- npm install installs the verified dependency set used by this repository.<br/>**npm install 会安装当前仓库已验证可用的依赖集合。**
- npm run dev starts the local Vite development server.<br/>**npm run dev 启动本地 Vite 开发服务器。**
- npm run build produces the production bundle used by GitHub Pages.<br/>**npm run build 生成 GitHub Pages 使用的生产构建产物。**
- npm run preview serves the built output for a local production-style check.<br/>**npm run preview 以接近生产环境的方式本地预览构建结果。**

## Deployment
- GitHub Pages is configured through .github/workflows/deploy.yml with the official Pages Actions flow.<br/>**GitHub Pages 通过 .github/workflows/deploy.yml 使用官方 Pages Actions 流水线部署。**
- The Vite base path is pinned to /NeonAngel/ for repository subpath hosting.<br/>**Vite 的 base 已固定为 /NeonAngel/，以适配仓库子路径托管。**
- After pushing, set Settings -> Pages -> Source to GitHub Actions if the repository has not been switched yet.<br/>**推送后如果仓库尚未切换，请在 Settings -> Pages -> Source 中把来源改成 GitHub Actions。**

## Status
- The original prototype has been migrated into a runnable Vite project and split into data, engine, hook, and view boundaries.<br/>**原始原型已经迁移为可运行的 Vite 工程，并拆出 data、engine、hook、view 边界。**
- This repository now has the foundation for future Unity migration, but it is still a web-first implementation rather than a full cross-engine port.<br/>**当前仓库已经具备未来迁移 Unity 的基础边界，但它仍是面向 Web 的实现，而不是完整的跨引擎移植版本。**