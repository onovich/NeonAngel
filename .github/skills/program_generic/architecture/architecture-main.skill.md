---
name: architecture-main
description: "用于设计和实现架构主入口，适用于编写 Unity 热更主入口，包括 Context 构建、依赖创建与注入、网络引导、事件绑定、分阶段资源加载、系统 Tick 顺序与 TearDown。"
---

# Architecture Main Skill

此 skill 用于总结 Unity 热更主入口的可执行规范。

目标不是停留在抽象描述，而是沉淀出可直接用于主入口实现的编排方式、生命周期顺序、依赖注入规则和运行时职责边界。

## 接收的 Input

- 主入口目标类的信息，例如 `ClientMain` 或同级入口类
- 当前项目的启动形态、目标平台、是否需要热更和远端资源流程
- 需要注入的 `GameContext` 成员、模块、管理器、仓储、对象池、全局实体和引擎对象
- 生命周期要求，例如 `Start`、`InitIE`、`Update`、`LateUpdate`、`TearDown`

若缺少入口职责范围、注入对象清单或生命周期要求，必须先返回阻塞项。

## 处理的事项

1. 明确主入口类负责的启动、注入、网络引导、资源加载和生命周期收口范围。
2. 设计主入口字段分组、创建顺序和依赖注入顺序。
3. 设计 `SetupNetwork()`、`BindingEvents()`、`InitIE()`、`Update()`、`TearDown()` 的职责边界。
4. 校验主入口是否遵循顺序编排、幂等收口、超时等待和平台裁剪规则。
5. 输出可直接实现的主入口设计方案或代码框架。

## 输出的 Output

architecture-main.skill 的 Output 应包含：

- 主入口类职责摘要
- 字段分组和依赖注入顺序
- 初始化、主循环和收口阶段的执行顺序
## 强制约束

- 主入口及各目录结构存放必须严格参考 `/gists/project-dirs.gist.md`。

## 任务编排

architecture-main.skill 的任务编排是先确定入口职责与平台形态，再组织生命周期阶段，最后输出主入口实现方案。

伪代码如下：

```text
architectureMain(input) {
	if (isMissingMainEntrySpec(input)) {
		return buildBlockedResult(input)
	}

	var mainPlan = analyzeMainEntryScope(input)
	designFieldGrouping(mainPlan)
	designInitAndInjectionOrder(mainPlan)
	designLifecyclePhases(mainPlan)
	validateTimeoutAndTearDownRules(mainPlan)

	return summarizeMainEntryPlan(mainPlan)
}
```

约束说明：

- 主入口只负责编排与生命周期，不把业务细节下沉失败后又塞回入口内部。
- 网络、事件、初始化协程和收口函数必须职责分离。
- 输出必须体现顺序和边界，不能只给零散代码片段。

## 核心职责

- 设计主入口 `ClientMain` 或同级入口类
- 创建 `GameContext` 并完成依赖注入
- 组织 `SystemState`、`SystemEvents`、`Module`、`Manager`、`Service`、`Repository`、`Pool`、`Entity` 的构建顺序
- 负责网络引导、事件绑定与初始系统进入
- 负责分阶段资源加载与 UI 过渡
- 负责 Update / LateUpdate / Focus / Quit / TearDown 生命周期收口

## ClientMain 结构约束

### 1. 入口类型

- 主入口使用 `MonoBehaviour`
- 热更环境下，入口实例由外部引导层创建，例如 `ClientHotReload.InstantiateClientMain()`
- `ClientMain` 本体负责运行期依赖创建与编排，不负责热更 DLL 下载逻辑

### 2. 字段分组顺序

`ClientMain` 中的字段分组应保持固定顺序，便于阅读和注入：

1. `GameContext ctx`
2. `SystemState`
3. `SystemEvents`
4. `Module`
5. `Manager`
6. `Service`
7. `Repository`
8. `Pool`
9. `Entity`
10. Hierarchy / Inspector 引用
11. 运行时控制字段，例如 `isInit`、`isTearDown`、缓存集合、版本信息

### 3. 创建与注入顺序

`ClientMain.Start()` 中的主流程应按以下顺序组织：

1. 初始化场景内序列化对象，例如 `panel_LogoFail.Ctor()`
2. 初始化运行时辅助数据，例如 bundle 名称集合、日志版本信息、协程入口
3. 创建 `GameContext`
4. 创建并 `Ctor()` 场景型 Module 或 Manager，例如 `InputModule`、`AdsManager`
5. 创建纯代码依赖：Module / Manager / Service / Repository / Pool / Entity / State / Events
6. 将所有依赖统一注入 `ctx`
7. 注入场景对象，例如 `canvas_World`、`EventSystem.current`
8. 绑定事件 `BindingEvents()`
9. 完成网络引导 `SetupNetwork()`
10. 启动初始化协程 `StartCoroutine(InitIE())`

禁止把依赖创建、依赖注入、事件绑定、网络引导和初始化协程顺序打乱。

## 网络引导规范

`SetupNetwork()` 应独立存在，不要把网络初始化散落到 `Start()` 和 `Update()` 中。

至少包含以下内容：

- 先调用网络输入控制器的初始化方法，例如 `NetworkInputController.Setup(ctx)`
- 绑定 `networkModule.OnConnected`、`OnDisconnected`、`OnData`
- `OnData` 中先校验包头长度，再解析 `messageId`
- 根据 `messageId` 分派到对应的 `NetworkInputController.xxx_OnRes(ctx, msg)`
- 在入口层决定默认连接地址与端口，并发起首次连接请求

约束：

- 消息解析放在主入口或输入控制器协作层，不要直接下沉进业务 System
- 对未知消息 ID 必须记录告警
- 连接地址选择允许按平台分支，但分支逻辑必须集中在一处

## 初始化协程规范

`InitIE()` 是主入口的重型初始化流程，推荐保持协程化。

推荐顺序可归纳为：

1. PreInit：创建必要运行时实体，例如主相机实体并注册到 Repository
2. 初始化 InputModule
3. 加载 PartA 资源
4. 预加载关键 Panel，并打开 Busy 面板
5. 清理启动 Logo
6. 等待登录结果
7. 加载玩家数据
8. 等待远端存档结果
9. 根据玩家进度决定后续加载分支与首个系统入口
10. 标记 `isInit = true`
11. 触发 GC

约束：

- 登录和存档等待必须有超时，不允许无限等待
- 失败后可继续进入游戏，但必须明确记录日志
- 初始进入哪个系统，应由用户状态或进度决定，而不是硬编码为单一路径

## 分阶段资源加载规范

资源加载可采用 `PartA / PartB / PartC` 这类分段组织方式。

建议规则：

- `PartA` 负责最小可进入资源集
- `PartB` 与 `PartC` 可在进入游戏后按需继续加载
- 每个 Part 的加载职责明确，例如：
  - L10N
  - Audio
  - VFX
  - Ads
- 支持组合协程，例如 `PartBC_Load_IE()`

如果有远端下载流程：

- 下载逻辑和资源加载逻辑分开
- 下载失败要有重试次数上限
- 超过上限要明确显示失败 UI 或终止当前流程

## Update / Tick 规范

`Update()` 中的执行顺序应明确分层，不要把不同职责打散。

推荐顺序：

1. 计算 `dt`
2. `ProcessInput`：例如 `networkModule.Tick()`
3. 若尚未 `isInit`，直接返回
4. 周期性非帧同步任务，例如每秒 Ping
5. Pre Tick：先调用关键 System 和 Controller 的普通 Tick
6. Fix Tick：累计 `restTickTime`，按步长执行 `FixTick` 和 `Physics2D.Simulate`
7. Late Tick：执行 System LateTick
8. 更新 Manager，例如 `audioManager.Tick(dt)`、`vfxManager.Tick(dt)`

关键点：

- `networkModule.Tick()` 在 `isInit` 前也要执行
- Ping 由主入口统一节流发送
- `Physics2D.Simulate(step)` 由主入口统一驱动

## LateUpdate 与应用生命周期规范

### LateUpdate

- 只做依赖初始化后的收尾逻辑
- 例如屏幕坐标、相机或 UI 的最终同步
- 若 `!isInit`，应直接返回

### OnApplicationFocus

- 失焦时：
  - 发送行为采样
  - 触发 AFK
  - 保存数据
- 回焦时：
  - 恢复状态
  - 发送回焦行为采样

### OnApplicationQuit / OnDestroy

- 都进入统一的 `TearDown()`
- `TearDown()` 必须幂等，至少用 `isTearDown` 防重入

## TearDown 规范

`TearDown()` 至少应包含：

1. 检查 `isInit`
2. 检查 `isTearDown`
3. 发送应用关闭行为采样
4. 保存数据与状态收口
5. 断开网络
6. 销毁或卸载模块资源
7. 调用各 Manager / Module 的 `TearDown()` 或 `UnloadAll()`

典型收口项包括：

- `networkModule.Disconnect()`
- `adsManager.TearDown()`
- `assetsModule.UnloadAll()`
- `fileManager.UnloadAll()`
- `inputModule.TearDown()`

## 事件绑定规范

`BindingEvents()` 必须集中管理，不要把 SystemEvents 的绑定散落在多个函数中。

推荐要求：

- 按系统分区块组织事件绑定
- 每个回调只负责协调 System / Controller / Repository，不直接塞入大量底层细节
- 与异步资源加载相关的行为，允许通过 Busy 面板和队列延后执行

典型做法包括：

- `events_Nav` 驱动页面系统切换
- `events_StageSelection` 驱动关卡进入
- `events_Win` / `events_Lose` 驱动关卡退出、重试和奖励汇总
- `events_Game` 驱动暂停、胜负和购买技能流程

## 编写模板

```csharp
public class ClientMain : MonoBehaviour {

	GameContext ctx;

	// ==== SystemState ====
	static {F}SystemState state_{F};

	// ==== Events ====
	static {F}SystemEvents events_{F};

	// ==== Module ====
	static AssetsModule assetsModule;

	// ==== Manager ====
	static AudioManager audioManager;

	// ==== Service ====
	static IDService idService;

	// ==== Repository ====
	static {Entity}Repository {entity}Repository;

	// ==== Pool ====
	static {Entity}Pool {entity}Pool;

	// ==== Entity ====
	static UserEntity userEntity;

	bool isInit = false;
	bool isTearDown = false;

	void Start() {
		ctx = new GameContext();

		// Ctor
		// Inject
		// BindingEvents
		// SetupNetwork
		// StartCoroutine(InitIE())
	}

	void Update() {
		// ProcessInput
		// Tick
		// FixTick
		// Late managers tick
	}

	void LateUpdate() {
		if (!isInit) {
			return;
		}
	}

	void OnApplicationFocus(bool hasFocus) {
		// Blur / Focus handling
	}

	void OnApplicationQuit() {
		TearDown();
	}

	void OnDestroy() {
		TearDown();
	}

	void TearDown() {
		if (!isInit || isTearDown) {
			return;
		}
		isTearDown = true;
	}
}
```

## 强制约束

- 主入口的依赖创建与注入顺序必须稳定，不得随意交叉。
- `BindingEvents()`、`SetupNetwork()`、`InitIE()` 必须职责分离。
- `Update()` 中必须先处理输入，再执行系统 Tick。
- `TearDown()` 必须幂等。
- 等待登录、存档、下载等异步结果时必须有超时或失败分支。
- 不要把业务细节全部堆进 `Start()`；重型流程要下沉到独立函数或协程。
- 使用中文交流。

## 输出要求

输出主入口设计或代码时，应尽量包含：

- 主入口类职责摘要
- 字段分组顺序
- 创建与注入顺序
- 初始化协程步骤
- Update / FixTick / LateUpdate 顺序
- TearDown 收口项
- 与当前目标主入口方案的一致点和偏离点
