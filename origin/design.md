项目交接文档 (Hand-off Document)

0. 项目基本信息

当前项目英文名: Neon Angel

项目类型: HTML5 Canvas 极简风弹幕飞行射击游戏 (Minimalist Bullet Hell)

平台: 现代 Web 浏览器 (自适应桌面与移动端)

开发语言: HTML5, CSS3 (Tailwind CSS), 原生 JavaScript (ES6+)

1. 游戏设计文档 (Game Design Document - GDD)

1.1 核心体验与标语

标语: “最好的防守是贴脸进攻。”

核心体验: 玩家在密集的弹幕中，通过主动拉近与敌人的距离来获取高额收益（生命回复）。同时利用满血状态下的“子弹抵消”机制，形成“只要不受伤，就能一直碾压”的心流体验。

1.2 核心机制

动态回血 (Risk & Reward): 玩家击杀敌人时，会根据双方距离掉落血包。距离越近（<100px），爆出的血包越多（最多5个）；距离越远，血包越少。

满血防弹盾 (Guard System): 只有当玩家处于满血状态时，周身会产生光晕。此时发射的子弹在出膛的前 1 秒内拥有“抵消敌方子弹”的能力，鼓励玩家保持无伤状态。

大招系统 (Ultimate): 玩家通过击杀和拾取血包积攒能量，最多可存 3 格。消耗 1 格可释放全屏扩张波（清除范围内的敌人和子弹），并赋予玩家 3 秒无敌时间，作为绝境求生的兜底手段。

2. 开发文档 (Development Document)

2.1 技术架构与依赖

单文件架构: 所有的 HTML 结构、Tailwind CSS 样式（CDN引入）以及游戏主逻辑（JavaScript）均封装在一个 index.html 文件中，零本地依赖。

渲染引擎: 原生 Canvas 2D API (ctx)。

UI层: 使用 HTML DOM 层叠在 Canvas 上方（#ui-layer），通过 Tailwind CSS 实现毛玻璃（backdrop-blur）和响应式布局，性能优于纯 Canvas 绘制复杂 UI。

2.2 核心系统说明

游戏主循环: 使用 requestAnimationFrame 驱动的 loop(timestamp)，计算增量时间 dt 以保证不同帧率下的移动一致性（已做防锁死处理：dt > 50 时限制为 16）。

实体类设计 (OOP):

Player: 玩家状态管理（血量、能量、无敌帧、射击控制）。

Enemy: 涵盖所有敌对单位，通过 type 字段区分（'minion', 'elite', 'obstacle', 'boss'），实现不同的 AI 运动和射击模式。

PlayerBullet / EnemyBullet: 子弹类，处理飞行和消亡。其中 PlayerBullet 包含 canCancel 属性以实现防弹盾机制。

Drop / Particle / UltWave: 掉落物、粒子特效及大招冲击波。

碰撞检测: 使用基于圆形的距离判定机制 dist(p1, p2)，即 Math.hypot(p1.x - p2.x, p1.y - p2.y) < r1 + r2，算法简单高效。

输入处理: 统一监听 #game-container 的 mousemove, touchmove, touchstart 事件，更新 mouse.x 和 mouse.y。玩家实体使用线性插值 (Lerp) 平滑跟随鼠标/触摸点。

3. 关卡与数值设计思路 (Level & Balance)

3.1 难度生成节奏 (Spawner Logic)

游戏目前采用无限生存模式，基于帧数 (frameCount) 和 分数 (score) 逐步引入新挑战：

基础: 每 60 帧生成基础小怪 (minion)。

分数 > 500: 每 200 帧加入不可摧毁的尖刺障碍物 (obstacle)，压缩玩家移动空间。

分数 > 1000: 每 300 帧加入精英怪 (elite)，施放散弹增加弹幕密度。

分数每逢 3000: 召唤 Boss。Boss 存在时不再重复召唤新 Boss。

3.2 关键数值约束

玩家: HP 100。子弹伤害 10，攻速 120ms。碰触敌方子弹受损 10 点，肉体碰撞受损 20 点。

回血收益: <100px 掉落 5 包，<200px 掉落 3 包，<400px 掉落 1 包（单包回血量 5）。

敌人属性:

minion: HP 20 (需命中2发)，移速较快，随机微调 X 轴。

elite: HP 150，移速慢，周期性发射3向散弹。

boss: HP 3000，分为 2 个阶段。P1(全向环形弹)，P2(双螺旋弹幕)。

大招: 100 能量一格（最高300）。击杀 Boss 奖励 50 能量，普通击杀奖励 15 能量，每个血包附带 5 能量。

4. 美术约束 (Art Constraints)

本项日采用了严格的马卡龙极简扁平风 (Minimalist Flat Pastel)，在后续更新美术资产时，请严格遵守以下约束：

形状与线条:

必须使用: 简单的几何图形（圆形 arc、圆角矩形 roundRect）。

禁止使用: 像素画 (Pixel Art)、复杂的写实纹理 (Textures)、尖锐的边角（障碍物除外）。

零描边: 取消所有元素的描边（lineWidth=0）。

色彩与光影:

调色板: 遵循低饱和度、高明度的 Pastel 色系（如柔和绿 #A8E6CF、软粉红 #FFADAD、淡紫 #BDB2FF 等）。

发光效果: 体积感和主次关系完全依靠外发光 (ctx.shadowBlur 和 ctx.shadowColor) 实现。

禁止使用: 硬阴影、3D渲染感、脏乱的噪点和高反差的暗黑色系。

UI 资产: HUD 必须保持现代化 Web UI 审美，使用半透明白色背景 (bg-white/80) 配合背景模糊 (backdrop-blur)，图标采用纯色极简 SVG。

5. 项目启动方式 (How to Run)

本项目无需复杂的构建工具链（如 Webpack/Vite）或 Node.js 环境。

直接运行: 下载或复制 index.html 文件，双击使用任何现代浏览器（Chrome, Edge, Safari, Firefox）打开即可直接运行游玩。

开发调试: 推荐使用 VS Code 编辑器，安装 Live Server 插件。右键点击 index.html 选择 "Open with Live Server"，即可实现代码修改后的浏览器热更新。

注意: 由于项目依赖了 Tailwind CSS 的 CDN 脚本，首次加载时请确保设备已连接互联网。如果需要离线开发，可以自行下载 Tailwind 配置文件或替换为本地编译的 CSS 文件。