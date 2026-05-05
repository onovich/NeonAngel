---
name: program-gameplay-2dplatformer
description: "用于 2D 横版平台跳跃玩法实现与结构整理，适用于角色移动、跳跃、落地判定、平台交互、收集目标和关卡通关逻辑设计。"
---

# Program Gameplay 2D Platformer Skill

## 目的

该 skill 用于整理和实现 2D 横版平台跳跃玩法结构，重点覆盖角色横向移动、跳跃、下落、地面检测、平台交互、收集目标和关卡推进。

目标是产出结构清晰、可直接落地的 2D 平台玩法代码方案，而不是停留在零散动作片段。

## 适用场景

- 需要新建或重构 2D 横版平台跳跃玩法
- 需要设计角色移动、跳跃、空中控制或落地判定
- 需要补充陷阱、平台、收集物、检查点和通关条件
- 需要整理玩法状态、失败条件和重开流程

在以下情况不要使用本 skill：

- 只处理 UI、菜单或 HUD 逻辑
- 只处理纯美术资源或关卡 prefab
- 只处理 3D 射击、瞄准或枪械逻辑
- 只处理通用基础设施，而不涉及平台跳跃玩法本身

## 接收的 Input

- 玩法类的目标路径、类名、命名空间和运行期目录
- 角色能力，例如移动、跳跃、二段跳、冲刺、攀爬
- 地面检测、碰撞层、平台类型、陷阱类型和收集目标
- 通关条件、失败条件、重生点和状态切换规则
- 输入方式、物理更新方式和帧循环要求

若缺少角色能力、地面判定方式、目标条件或失败条件，则不能可靠给出平台跳跃实现方案。

## 处理的事项

1. 识别目标是否属于 2D 横版平台跳跃玩法。
2. 整理角色移动、跳跃、落地判定、空中控制和平台交互逻辑。
3. 设计收集、陷阱、检查点、通关与失败流程。
4. 设计玩法状态字段、更新循环和重置规则。
5. 输出可直接实现的平台跳跃玩法结构、方法骨架和注意事项。

## 输出的 Output

program-gameplay-2dplatformer.skill 的 Output 应包含：

- 玩法职责拆分摘要
- 角色能力、判定逻辑和状态字段建议
- 通关、失败和重开流程规则
- 更新循环与重置要求
- 若信息不足，返回阻塞项与下一步建议

## 任务编排

program-gameplay-2dplatformer.skill 的任务编排是先确认角色能力与关卡目标，再整理判定与状态流转，最后输出玩法循环与失败恢复规则。

伪代码如下：

```text
programGameplay2DPlatformer(input) {
    if (isMissing2DPlatformerSpec(input)) {
        return buildBlockedResult(input)
    }

    var gameplayPlan = analyze2DPlatformerScope(input)
    var movementPlan = buildPlatformerMovement(gameplayPlan)
    var collisionPlan = buildGroundAndPlatformChecks(gameplayPlan)
    var objectivePlan = buildPlatformerObjectives(gameplayPlan)
    var statePlan = buildPlatformerStateFlow(gameplayPlan)

    return summarize2DPlatformerResult(gameplayPlan, movementPlan, collisionPlan, objectivePlan, statePlan)
}
```

## 强制约束

- 必须明确包含 Input、处理事项、Output 三块核心内容。
- 任务编排必须包含伪代码。
- 必须同时设计移动、跳跃、判定、目标和失败恢复。
- 不得把 UI 或纯关卡资源职责混入平台跳跃 skill。
- 若缺少核心玩法规则，应先返回阻塞项。

## 成功标准

- 能整理 2D 横版平台跳跃玩法的职责边界
- 能给出角色能力与地面判定的完整结构
- 能覆盖目标、失败和重开流程
- 能输出可直接落地的玩法结构建议