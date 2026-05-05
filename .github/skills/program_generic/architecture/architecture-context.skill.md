---
name: architecture-context
description: "用于架构上下文与 GameContext 注册规范，适用于定义状态、事件、模块、管理器、仓储、对象池和全局实体的注册边界与命名规则。"
---

# Architecture Context Skill

此 skill 定义了 GameContext 与架构上下文注册规范，用于保证架构层的对象注册、依赖方向和命名一致性。

## 接收的 Input

- 当前架构任务的上下文信息
- 需要注册到 `GameContext` 的状态、事件、模块、管理器、仓储、对象池或全局实体
- 当前对象的层级归属、命名候选和依赖方向约束
- 调用方给出的边界条件，例如哪些对象允许持有 `GameContext`

若未提供待注册对象或边界条件，应先返回缺失项，而不是自行补全上下文字段。

## 处理的事项

1. 判断当前对象是否应注册到 `GameContext`。
2. 判断对象属于 `SystemState`、`SystemEvents`、`Module`、`Manager`、`Service`、`Repository`、`Pool` 或 `Entity` 的哪一类。
3. 校验字段命名是否符合 `state_*`、`events_*`、`*Module`、`*Manager`、`*Repository`、`*Pool`、`*Entity` 规则。
4. 校验依赖方向，阻止低层对象依赖或感知 `GameContext`。
5. 输出上下文注册建议、命名结果和边界判定结果。

## 输出的 Output

architecture-context.skill 的 Output 应包含：

- 哪些对象需要注册到 `GameContext`
- 每个对象的建议字段名和所属分组
- 哪些对象禁止持有或接收 `GameContext`
- 若存在违规，明确指出违规点与修正建议

## 强制约束

- 所有的目录结构规划与设计必须严格参考 `/gists/project-dirs.gist.md`。

## 任务编排

architecture-context.skill 的任务编排是先识别对象分组，再校验命名和边界，最后给出上下文注册结果。

伪代码如下：

```text
architectureContext(input) {
    if (isMissingContextSpec(input)) {
        return buildBlockedResult(input)
    }

    var registrationPlan = classifyContextMembers(input)
    validateContextNaming(registrationPlan)
    validateContextBoundary(registrationPlan)

    return buildContextResult(registrationPlan)
}
```

约束说明：

- 只处理 `GameContext` 注册与边界问题，不扩展到实体实现细节。
- 低层对象一旦感知 `GameContext`，必须直接标记为违规。
- 输出必须能直接指导字段注册与命名，而不是只给抽象建议。

## GameContext 规范

唯一上下文对象，持有系统级引用。

```csharp
public class GameContext {
    public SystemStatus status;

    // ==== SystemState（每个 System 各一份）====
    public {F}SystemState state_{F};
    public {G}SystemState state_{G};

    // ==== SystemEvents（每个 System 各一份）====
    public {F}SystemEvents events_{F};
    public {G}SystemEvents events_{G};

    // ==== Module（低层基础设施）====
    public InputModule inputModule;
    public AssetsModule assetsModule;

    // ==== Manager（高层业务服务）====
    public AudioManager audioManager;
    public VFXManager vfxManager;

    // ==== Service ====
    public IDService idService;

    // ==== Repository ====
    public {Entity}Repository {entity}Repository;
    public PanelRepository panelRepository;

    // ==== Pool ====
    public {Entity}Pool {entity}Pool;

    // ==== Entity（全局唯一实体）====
    public UserEntity userEntity;
    public GameEntity gameEntity;

    // ==== Engine ====
    public EventSystem eventSystem;
}
```

## 注册与命名规则

- 所有 `Repository` / `Pool` / `Entity` 实例或集合必须在 `GameContext` 中注册。
- `GameContext` 字段命名规则：`state_*` / `events_*` / `*Module` / `*Manager` / `*Repository` / `*Pool` / `*Entity`。
- `GameContext` 仅用于上层编排侧，禁止继续下传给 `Entity` / `Component` / `SO` / `Repository` 等低层。

## 上下文边界

- `GameContext` 只属于编排层入口。可传入 `System` / `Controller` / `Manager`，但不得传入纯数据层对象。
- 跨系统通信优先使用显式声明的 `SystemEvents`，避免使用通用消息总线。
- `Entity`、`Component`、`SO`、`Repository` 等低层对象不得依赖或感知 `GameContext`。

## 使用场景

- 设计新的 `Entity` / `Repository` / `Pool` 时，先检查是否需要在 `GameContext` 添加字段。
- 注册全局唯一实体时，使用明确命名字段，并保持可读性。
- 架构调整时，不要在低层类型中注入 `GameContext`。
