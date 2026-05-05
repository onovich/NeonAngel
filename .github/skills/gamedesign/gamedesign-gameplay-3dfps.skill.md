---
name: gamedesign-gameplay-3dfps
description: "用于 3D FPS 玩法设计，负责射击循环、武器手感、遭遇节奏、空间压迫与战斗反馈收束。"
---

# Gamedesign Gameplay 3D FPS Skill

## 职责

gamedesign-gameplay-3dfps.skill 只负责 3D FPS 玩法设计本身的整理、收束与输出，不负责程序实现、美术制作、关卡资源搭建或运行时代码修复。

它的职责收束为以下几类：

- 明确 3D FPS 玩法中的战斗目标、射击循环、移动方式、失败条件与遭遇完成条件。
- 设计武器定位、敌人压力、空间路线、掩体关系、资源补给与战斗节奏。
- 约束命中反馈、受击反馈、压迫感、风险回报、读图信息与学习曲线。
- 识别战斗空窗过长、武器区分不足、敌人压迫失衡、关卡路线单调与反馈不足，并给出收束方案。
- 输出可供后续玩法细化、遭遇设计或实现对齐的结构化玩法说明。
- 仅适用于 3D FPS 玩法设计、战斗循环梳理、节奏收束与可玩性评估；不替代程序编码、数值实现、美术资产制作或项目排期。

## Input

- 用户提供的游戏题材、目标玩家、平台约束与战斗体验目标。
- 当前 3D FPS 玩法设想，包括移动方式、武器类型、敌人构成、地图空间与资源系统。
- 遭遇节奏、战斗时长、反馈风格、风险回报目标与当前已知问题。
- 本次希望输出的粒度，例如概念级玩法方案、可执行规则草案或风险收束建议。

## Output

- 结构化的 3D FPS 玩法设计结果，包括目标、射击循环、关键规则、遭遇节奏与反馈方案。
- 对武器角色、敌人压力、空间推进、补给逻辑与战斗读图的明确说明。
- 主要可玩性风险、冲突点、薄弱反馈点与建议的收束方向。
- 若信息不足，返回阻塞态，并明确指出缺失信息与下一步建议。

## 任务编排

伪代码如下：

```text
gamedesignGameplay3DFps(input) {
  // Input 是用户提供的 3D FPS 玩法目标、玩家能力、武器设计、敌人压力、空间节奏与当前问题。
  var gameplayGoal = extractGameplayGoal(input)
  var combatKit = extractCombatKit(input)
  var encounterPacing = extractEncounterPacing(input)
  var constraints = extractConstraints(input)

  if (isMissingCriticalInfo(gameplayGoal, combatKit, encounterPacing, constraints)) {
    // Output: 阻塞态，返回缺失项与补充问题。
    return askUserForMissing3DFpsInfo(gameplayGoal, combatKit, encounterPacing, constraints)
  }

  var coreLoop = build3DFpsCoreLoop(gameplayGoal, combatKit, constraints)
  var encounterFlow = buildEncounterFlow(coreLoop, encounterPacing, constraints)
  var rules = defineCombatAndSpaceRules(coreLoop, encounterFlow, constraints)
  var feedback = defineCombatFeedback(rules, encounterFlow, constraints)
  var risks = inspect3DFpsRisks(coreLoop, encounterFlow, rules, feedback)

  if (hasMajorDesignConflict(risks)) {
    // Output: 返回主要冲突、影响与收束建议。
    return resolve3DFpsConflicts(coreLoop, encounterFlow, rules, feedback, risks)
  }

  // Output: 返回可执行的 3D FPS 玩法设计结果。
  return finalize3DFpsDesign(coreLoop, encounterFlow, rules, feedback, risks)
}
```

## 强制约束

- 每个 skill 必须有 header。
- 必须明确区分玩法设计与程序实现，不能输出代码、类结构或引擎 API 方案。
- 必须写清战斗目标、核心射击循环、武器角色、敌人压力、空间推进、反馈方式与节奏曲线，不能只写抽象概念。
- 必须主动识别命中反馈弱、战斗信息过载、武器同质化、敌人压迫失衡、空间重复与补给节奏失控等常见问题。
- 输出多个方案时，必须说明各自适用前提、代价与取舍，不能平铺罗列。
- 若信息不足，先提问，不自行脑补关键规则。
- 正文不得出现由谁调用该 skill 的描述。
- 参考项目时，禁止出现参考项目名。
- 使用中文交流。

## 质量标准

- 能处理 3D FPS 玩法的新建设计与已有方案收束。
- 能明确目标、移动方式、射击循环、武器角色、失败条件与遭遇推进关系。
- 能输出清晰的核心循环、遭遇节奏、空间规则与反馈结构。
- 能识别主要可玩性风险，并给出可执行的收束建议。
- 能在信息不足时返回阻塞态并准确提出补充问题。
- 能保持职责、Input、Output、任务编排、强制约束、质量标准六块固定结构。
- 能保证任务编排包含伪代码，并明确体现 Input 与 Output。
- 产物可直接作为后续遭遇设计、玩法评审或实现对齐的输入。