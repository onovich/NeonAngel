---
name: gamedesign-gameplay-2dplatformer
description: "用于 2D 平台玩法设计，负责核心循环、关卡节奏、移动跳跃规则、挑战反馈与可玩性收束。"
---

# Gamedesign Gameplay 2D Platformer Skill

## 职责

gamedesign-gameplay-2dplatformer.skill 只负责 2D 平台玩法设计本身的整理、收束与输出，不负责程序实现、美术制作、关卡资源搭建或运行时代码修复。

它的职责收束为以下几类：

- 明确 2D 平台玩法中的玩家目标、移动能力、跳跃规则、失败条件与通关条件。
- 设计核心循环、单关节奏、障碍组合、探索回报与挑战曲线。
- 约束平台跳跃中的位移、时机判断、容错、反馈节奏与学习曲线。
- 识别卡手点、空转段、重复挑战、反馈不足与难度失衡，并给出收束方案。
- 输出可供后续玩法细化、关卡设计或实现对齐的结构化玩法说明。
- 仅适用于 2D 平台玩法设计、规则梳理、节奏收束与可玩性评估；不替代程序编码、数值实现、美术资产制作或项目排期。

## Input

- 用户提供的游戏题材、目标玩家、平台约束与体验目标。
- 当前 2D 平台玩法设想，包括移动方式、跳跃能力、障碍类型、敌人或机关构成。
- 关卡节奏、难度预期、反馈方式、可重复游玩目标与当前已知问题。
- 本次希望输出的粒度，例如概念级玩法方案、可执行规则草案或风险收束建议。

## Output

- 结构化的 2D 平台玩法设计结果，包括目标、核心循环、关键规则、挑战节奏与反馈方案。
- 对移动、跳跃、落点判断、容错机制、障碍搭配与关卡推进的明确说明。
- 主要可玩性风险、冲突点、薄弱反馈点与建议的收束方向。
- 若信息不足，返回阻塞态，并明确指出缺失信息与下一步建议。

## 任务编排

伪代码如下：

```text
gamedesignGameplay2DPlatformer(input) {
  // Input 是用户提供的 2D 平台玩法目标、角色能力、关卡节奏、障碍类型、平台约束与当前问题。
  var gameplayGoal = extractGameplayGoal(input)
  var movementKit = extractMovementKit(input)
  var levelPacing = extractLevelPacing(input)
  var constraints = extractConstraints(input)

  if (isMissingCriticalInfo(gameplayGoal, movementKit, levelPacing, constraints)) {
    // Output: 阻塞态，返回缺失项与补充问题。
    return askUserForMissing2DPlatformerInfo(gameplayGoal, movementKit, levelPacing, constraints)
  }

  var coreLoop = build2DPlatformerCoreLoop(gameplayGoal, movementKit, constraints)
  var challengeFlow = buildChallengeFlow(coreLoop, levelPacing, constraints)
  var rules = defineMovementAndObstacleRules(coreLoop, challengeFlow, constraints)
  var feedback = definePlayerFeedback(rules, challengeFlow, constraints)
  var risks = inspect2DPlatformerRisks(coreLoop, challengeFlow, rules, feedback)

  if (hasMajorDesignConflict(risks)) {
    // Output: 返回主要冲突、影响与收束建议。
    return resolve2DPlatformerConflicts(coreLoop, challengeFlow, rules, feedback, risks)
  }

  // Output: 返回可执行的 2D 平台玩法设计结果。
  return finalize2DPlatformerDesign(coreLoop, challengeFlow, rules, feedback, risks)
}
```

## 强制约束

- 每个 skill 必须有 header。
- 必须明确区分玩法设计与程序实现，不能输出代码、类结构或引擎 API 方案。
- 必须写清玩家能力、核心循环、失败条件、关卡推进、反馈方式与难度曲线，不能只写抽象概念。
- 必须主动识别跳跃容错不足、读图不清、挑战重复、反馈延迟与节奏断裂等常见问题。
- 输出多个方案时，必须说明各自适用前提、代价与取舍，不能平铺罗列。
- 若信息不足，先提问，不自行脑补关键规则。
- 正文不得出现由谁调用该 skill 的描述。
- 参考项目时，禁止出现参考项目名。
- 使用中文交流。

## 质量标准

- 能处理 2D 平台玩法的新建设计与已有方案收束。
- 能明确目标、移动能力、跳跃规则、失败条件与关卡推进关系。
- 能输出清晰的核心循环、挑战节奏、障碍组合与反馈结构。
- 能识别主要可玩性风险，并给出可执行的收束建议。
- 能在信息不足时返回阻塞态并准确提出补充问题。
- 能保持职责、Input、Output、任务编排、强制约束、质量标准六块固定结构。
- 能保证任务编排包含伪代码，并明确体现 Input 与 Output。
- 产物可直接作为后续关卡设计、玩法评审或实现对齐的输入。