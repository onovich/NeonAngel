---
name: gamedesign-core-experience
description: "用于核心体验设计，适用于先定义玩家想感受到的体验，再推导美术风格、玩法方向、交互方式、反馈节奏与验证方法。"
---

# GameDesign Core Experience Skill

## 目的

该 skill 用于整理和定义核心体验，重点覆盖先定义玩家想感受到的体验，再从该体验反推出美术风格、玩法方向、交互方式、反馈节奏与验证方式。

目标是产出结构清晰、可继续交给下游 gameplay skill 执行的体验设计结果，而不是直接进入具体玩法实现细节。

## 适用场景

- 需要定义项目的核心体验或单个玩法模块的核心体验
- 需要从某种玩家感受反推玩法方向、交互方式或美术表达
- 需要收敛“这个游戏到底想让玩家感受到什么”
- 需要整理体验验证方式、关键反馈节点和失败风险

在以下情况不要使用本 skill：

- 只实现具体 gameplay 代码
- 只创建 ScriptableObject、prefab 或其他资源文件
- 只做技术层面的渲染、UI 或系统实现

## 接收的 Input

- 目标体验或目标玩家感受
- 目标受众、平台、题材、交互复杂度和体验约束
- 期望的节奏、关键反馈、奖励感、失败感或掌控感
- 已有的玩法草案、美术方向草案、交互草案和验证要求

若缺少目标体验、目标玩家感受或关键约束，则不能可靠给出核心体验设计方案。

## 处理的事项

1. 识别目标是否属于核心体验定义、体验收敛或体验驱动设计。
2. 整理玩家应感受到的核心体验、情绪目标和关键反馈。
3. 根据体验推导合适的美术风格、玩法方向和交互方式。
4. 设计体验验证方法、风险点、失败点和优先验证顺序。
5. 输出可继续交给下游 gameplay skill 或其他执行面的结构化体验结果。

## 输出的 Output

gamedesign-core-experience.skill 的 Output 应包含：

- 核心体验定义摘要
- 推导出的美术风格、玩法方向和交互方式
- 关键反馈节点、风险点和验证方法
- 推荐交接的下游执行方向
- 若信息不足，返回阻塞项与下一步建议

## 任务编排

gamedesign-core-experience.skill 的任务编排是先确认体验目标，再推导设计方向与验证方式，最后输出结构化体验结果。

伪代码如下：

```text
gamedesignCoreExperience(input) {
    if (isMissingCoreExperienceSpec(input)) {
        return buildBlockedResult(input)
    }

    var experiencePlan = analyzeCoreExperienceGoal(input)
    var artPlan = deriveArtDirection(experiencePlan)
    var gameplayPlan = deriveGameplayDirection(experiencePlan)
    var interactionPlan = deriveInteractionDirection(experiencePlan)
    var validationPlan = buildExperienceValidation(experiencePlan)

    return summarizeCoreExperienceSkillResult(experiencePlan, artPlan, gameplayPlan, interactionPlan, validationPlan)
}
```

## 强制约束

- 必须明确包含 Input、处理事项、Output 三块核心内容。
- 任务编排必须包含伪代码。
- 必须先定义体验，再推导美术、玩法与交互方向。
- 不得直接把 skill 输出写成具体 gameplay 代码实现。
- 若缺少核心体验目标或关键约束，应先返回阻塞项。

## 成功标准

- 能整理核心体验的职责边界
- 能从体验推导出美术风格、玩法方向和交互方式
- 能给出验证方法、风险点与下游交接建议
- 能输出结构清晰、可继续执行的体验设计结果
