---
name: architecture-design
description: "用于架构设计与评审，适用于根据需求输出分层设计方案、目录结构、类名字段、依赖关系以及实现约束。"
---

# Architecture Design Skill

该 skill 提取了架构代理的详细流程、输出规范和架构实现速查内容，用于指导架构设计与评审。

## 接收的 Input

- 当前需求对应的业务目标、功能边界和目标平台
- 需要设计的架构层级，例如 `Entity`、`Repository`、`Controller`、`System`、`Module`、`Manager`
- 已知目录结构、命名规则、依赖限制和运行时约束
- 是否涉及 UI、热更、网络、存档、资源分阶段加载等专项约束

若输入中缺少目标层级、依赖边界或目标平台，必须先指出阻塞项。

## 处理的事项

1. 分析需求对应的架构层级与对象边界。
2. 判断入口形态、目录结构和分层依赖是否需要调整。
3. 输出类名、字段、namespace、路径和依赖关系设计。
4. 校验设计是否符合顺序分层、上下文边界、UI 约束和平台裁剪规则。
5. 汇总成可直接交给实现阶段使用的架构设计结果。

## 输出的 Output

architecture-design.skill 的 Output 应包含：

- 分层后的设计方案
- 目标文件路径、类名、namespace 和字段结构
- 关键依赖方向与调用关系
- 需要特别遵守的实现约束和风险点

## 任务编排

architecture-design.skill 的任务编排是先识别需求所属层级，再完成分层设计与约束校验，最后输出结构化设计方案。

伪代码如下：

```text
architectureDesign(input) {
    if (isMissingArchitectureRequirement(input)) {
        return buildBlockedResult(input)
    }

    var designScope = analyzeArchitectureScope(input)
    var designDraft = buildLayeredDesign(designScope)
    validateDependencyRules(designDraft)
    validatePlatformAndUiConstraints(designDraft)

    return summarizeArchitectureDesign(designDraft)
}
```

约束说明：

- 输出必须落到具体层级、路径和类结构，不能只停留在抽象原则。
- 若发现下层感知上层或 UI 运行时动态创建节点，必须直接标记为违规。
- 设计阶段只输出方案，不替代具体代码实现。

## 设计流程

1. 读取本 skill 的 Gist 规范，建立上下文。
2. 分析需求，确定涉及的架构层级（Entity / Repository / Controller / System 等）。
3. 按 Gist 模板输出设计方案：
   - Entity 字段定义（含 UniqueID、TypeID）
   - Component 拆分（如有必要）
   - SO 配置类结构
   - Repository 接口
   - 目录与文件路径
4. 返回完整设计方案。

## 输出格式

返回结构化设计方案，包含：
- 文件路径（遵循 Gist 目录结构）
- 类名与 namespace
- 字段列表（类型 + 名称 + 说明）
- 依赖关系

## 约束

- 设计的所有的目录结构必须严格参考 `/gists/project-dirs.gist.md`。
- 设计必须严格遵循本 skill 的 Gist 规范。
- 使用中文交流。
- 控制流必须保持顺序分层，由上层调用下层；仅 Controller 属于特例，允许 Controller 之间互相调用。
- 依赖关系必须保持顺序分层，由上层依赖下层；下层禁止反向感知上层，尤其 Entity / Component / SO / Repository 等低层类型禁止知道 Context 的存在，更不允许传入 Context 实例。
- 平台裁剪必须按目标端决定：若制作 PC 端项目，不需要分离 Launcher / HotReload 热更工程，也不需要 OSS 下载流程；可将运行时逻辑直接放在常规 Runtime 程序集中。
- 当某个对象在时序上已被严格保证非空时，函数内不需要重复判空；仅在边界输入或时序不确定处进行判空防御。
- 同类字段达到可识别语义簇时（如连接生命周期、心跳状态、网络统计），应优先封装为 XxxComponent，避免 Entity 承担过多平铺字段。
- UI 绝对约束：所有 UI 必须在 Prefab/编辑器阶段完成，禁止 Runtime 动态创建 UI 节点（禁止 `new GameObject`、`AddComponent`、运行时拼装 Slider/Toggle/Dropdown/Text）。
- Runtime 仅允许操作已存在控件的状态与数据绑定，不允许新增控件层级。
- 涉及 UI 变更时，输出方案必须包含 Prefab 固化步骤（必要时通过 Editor 脚本执行并保存回 Prefab）。

## 架构总览

Unity 运行时架构按目标端选择入口形态。需要热更或远端资源目录时，可拆分 `Launcher` 与 `HotReload`：`Launcher` 负责 AOT 引导、资源目录与热更 DLL 加载，核心游戏逻辑集中在 `HotReload`；不需要热更时，运行时逻辑直接放在常规 Runtime 程序集中。

入口启动后，由 `ClientMain` 创建唯一 `GameContext`，再将 SystemState、SystemEvents、Module、Manager、Service、Repository、Pool、全局 Entity 与必要引擎对象注入 Context。热更拆分只适用于需要小程序/WebGL 资源下载、热更 DLL 或远端资源目录的目标端；若制作 PC 端项目，不需要拆出热更工程，不需要通过 OSS 下载 DLL 或资源 manifest。无论采用哪种入口形态，都保留 System / Controller / Entity / Repository / Module / Manager 的逻辑分层。

运行期控制流按 `ClientMain -> System -> Controller -> Entity/Repository/Module/Manager` 顺序推进。`System` 负责系统级编排和生命周期，`Controller` 负责无状态控制逻辑，复杂行为可下沉到 Domain；`Entity + Component` 只承载数据，初始内容来自 SO/TM 配置，持久化结构放 Save Model，查询访问由 Repository 统一管理。

依赖方向保持单向：高层可以依赖低层，低层不能反向感知高层。`GameContext` 是上层编排用上下文，允许传入 System/Controller/Manager 等上层控制对象，但禁止继续下传给 Entity、Component、SO、Repository 等纯数据或数据访问层。跨系统通信通过 Context 中显式声明的 `SystemEvents` 完成，不使用通用消息总线。

编辑期与运行期严格分离：`Src_Editor` 中的 EM/编辑器工具负责把可视化编辑数据转换并写回 SO、Prefab 或 Addressables；Runtime 只读取固化后的配置和 Prefab 控件状态，不动态创建 UI 层级。

## 依赖与调用规则

- 调用流必须顺序向下：上层负责编排并调用下层，下层不得反向驱动上层控制流。
- 依赖关系必须顺序向下：高层可以依赖低层，低层不得依赖高层。
- 唯一特例是 Controller：允许 Controller 之间互相调用，用于串联控制流程；但 Controller 仍不得把高层依赖倒灌给 Entity / Component / SO / Repository。
- 任何低层对象都不得感知 `GameContext`；尤其禁止在 Entity / Component / SO / Repository 的字段、构造函数、方法参数中传入 `GameContext`。

## Context 规则

```csharp
public class GameContext {
    // SystemState / SystemEvents — 每个系统各一份
    public {F}SystemState   state_{F};
    public {F}SystemEvents  events_{F};
    // Module（低层）/ Manager（高层）
    public AssetsModule     assetsModule;
    public AudioManager     audioManager;
    // Repository / Service / Entity — 放 Context，不放 SystemState
    public {Entity}Repository {entity}Repository;
    public IDService          idService;
    public {Entity}Entity     {entity}Entity;  // 全局唯一实体
}
```

字段命名：`state_*` / `events_*` / `*Module` / `*Manager` / `*Repository` / `*Entity`。

`GameContext` 只属于编排层入口与上层控制代码，不向 Entity / Component / SO / Repository 下传。

## 主循环

```
Awake  → Init()：创建 Context → 初始化 Module/Manager/Repository → 加载资源 → 注册事件 → 进入首个系统
Update → ProcessInput() → Tick()
FixedUpdate → FixTick()
LateUpdate  → LateTick()
OnDestroy   → TearDown()
```

## System 三件套

| 文件 | 类型 | 职责 |
|------|------|------|
| `{F}System.cs` | `static class` | 静态编排：Init / Tick / FixTick / LateTick |
| `{F}SystemState.cs` | `class` | 系统级 FSM 状态（不放 Repository/Service/Entity） |
| `{F}SystemEvents.cs` | `class` | Action-based 事件总线，逐事件声明 |

## Controller

- **静态无状态**（`static class`）
- `Spawn(ctx, so)` → 创建 Entity、分配 ID、存入 Repository、从 SO 赋值、触发 OnSpawn
- `Unspawn(ctx, entity)` → 触发 OnUnspawn、移出 Repository、归还对象池
- `Tick(ctx, entity, dt)` → 每帧更新
- 允许 Controller 之间互相调用，以保持顺序控制流编排；这是唯一允许的横向协作特例
- Controller 可以持有并传递 `ctx` 给上层控制对象，但不得把 `ctx` 继续传入 Entity / Component / SO / Repository
- 只做**控制**（"让谁来"）；简单行为直接在 Controller 内新增函数，复杂时才抽出独立 Controller

## 签名类型（Common/ 层）

| 类型 | 用途 | 结构 |
|------|------|------|
| `EntityType` | 枚举，标识实体大类 | 每类间隔 100 |
| `UniqueID` | 实例唯一标识 | `StructLayout(Explicit)`: `EntityType`(高4B) + `entityID`(低4B) → `ulong value` |
| `TypeID` | 类型标识（同类共享） | `StructLayout(Explicit)`: `typeMajor`(2B) + `typeMinor`(4B) + `typePatch`(2B) → `ulong value` |

规则：Entity 必有 `UniqueID uniqueID` + `TypeID typeID`；IDService 分配 UniqueID；Repository 以 uniqueID 为 Key。

## Entity + Component

- Entity 是核心数据载体，字段用 Component 封装
- Component 用 `class`（纯数据，无行为）
- 不继承其他 Entity，组合替代继承
- 初始值来自 SO 配置，不在 Entity 内硬编码
- Entity / Component 属于低层纯数据对象，不得依赖或感知 `GameContext`，也不得接收 `GameContext` 作为参数
- 连接态/会话态等同类字段应抽为独立 Component，例如 `UserConnectionComponent`

```csharp
public class {Entity}Entity {
    public UniqueID uniqueID;
    public TypeID typeID;
    public {Entity}MovementComponent movement;
    public {Entity}CombatComponent   combat;
}
```

## SO（ScriptableObject）

- Entity 的不可变配置模板
- 存放于 `TM/` 子目录，命名 `So_{Entity}_{Name}.asset`
- `Controller.Spawn` 以 SO 为参数，从 SO 读取内容初始化 Entity
- 可嵌套引用其他 SO

## EM（Editor Model）

- 位于 `Src_Editor/`，不进入 Runtime 构建
- `[ExecuteInEditMode]` + `[Button]`（Odin Inspector）触发 `WriteTo()`
- 将编辑友好的引用（SO 直接拖拽）转换为 TypeID 写回目标 SO

## Repository

- 主索引 `Dictionary<UniqueID, {Entity}Entity> byID`
- 附加索引按查询需求添加（如 `byTypeID`）
- 接口约定：`Add` / `TryGet` / `TryGetByXxx` / `TakeAll` / `Remove`
- Repository 属于下层数据访问抽象，不得依赖 `GameContext`，也不得要求调用方传入 `GameContext`

## Module vs Manager

| 维度 | Module（低层） | Manager（高层） |
|---|---|---|
| 职责 | 封装平台/引擎能力 | 提供业务功能 |
| 依赖 | 不依赖 Manager | 可依赖 Module |
| 判断 | 多业务复用 + 无游戏规则 → Module | 含特定业务逻辑 → Manager |

## Events 规则

- 禁止通用消息总线；每条事件独立声明，保持类型安全
- 订阅在 `Init`，注销在 `TearDown`，成对出现
- 跨系统通信通过 Context 中各 `SystemEvents` 显式引用
