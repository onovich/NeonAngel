---
name: gamedesign-balance-combat
description: "用于战斗数值设计，负责属性成长、伤害节奏、敌我强度、战斗反馈与难度曲线收束。"
---

# Gamedesign Balance Combat Skill

## 职责

gamedesign-balance-combat.skill 只负责战斗数值设计本身的整理、收束与输出，不负责程序实现、美术制作、数据表落地或运行时代码修复。

它的职责收束为以下几类：

- 明确战斗系统中的角色属性、敌人强度、武器或技能成长、伤害节奏与阶段边界。
- 设计属性成长、敌我对抗关系、伤害结构、生存压力、奖励节奏与难度曲线。
- 约束输出效率、生存窗口、控制效果、成长回报、风险回报与反馈强度。
- 识别数值碾压、伤害失衡、成长断层、敌人压力异常、反馈疲软与难度跳变，并给出收束方案。
- 输出可供后续战斗系统细化、数值评审或实现对齐的结构化战斗数值说明。
- 仅适用于战斗数值设计、属性平衡梳理、伤害节奏收束与可玩性评估；不替代程序编码、精确公式实现、美术资产制作或项目排期。

## Input

- 用户提供的游戏题材、目标玩家、平台约束与战斗体验目标。
- 当前战斗数值设想，包括属性体系、武器或技能类型、敌人构成、成长阶段与奖励节奏。
- 战斗时长、击杀效率、生存压力、反馈方式与当前已知问题。
- 本次希望输出的粒度，例如概念级战斗数值方案、可执行规则草案或风险收束建议。

## Output

- 结构化的战斗数值设计结果，包括成长目标、关键规则、伤害节奏、强度关系与反馈方案。
- 对属性成长、敌我对抗、伤害窗口、生存压力、奖励投放与风险边界的明确说明。
- 主要可玩性风险、冲突点、薄弱反馈点与建议的收束方向。
- 若信息不足，返回阻塞态，并明确指出缺失信息与下一步建议。

## 任务编排

伪代码如下：

```text
gamedesignBalanceCombat(input) {
  // Input 是用户提供的战斗目标、属性体系、敌我强度、成长阶段、反馈方式与当前问题。
  var balanceGoal = extractBalanceGoal(input)
  var combatStats = extractCombatStats(input)
  var encounterPressure = extractEncounterPressure(input)
  var constraints = extractConstraints(input)

  if (isMissingCriticalInfo(balanceGoal, combatStats, encounterPressure, constraints)) {
    // Output: 阻塞态，返回缺失项与补充问题。
    return askUserForMissingCombatBalanceInfo(balanceGoal, combatStats, encounterPressure, constraints)
  }

  var powerCurve = buildCombatPowerCurve(balanceGoal, combatStats, constraints)
  var pressureCurve = buildCombatPressureCurve(powerCurve, encounterPressure, constraints)
  var rewardRules = defineCombatRewardRules(powerCurve, pressureCurve, constraints)
  var feedback = defineCombatBalanceFeedback(rewardRules, pressureCurve, constraints)
  var risks = inspectCombatBalanceRisks(powerCurve, pressureCurve, rewardRules, feedback)

  if (hasMajorDesignConflict(risks)) {
    // Output: 返回主要冲突、影响与收束建议。
    return resolveCombatBalanceConflicts(powerCurve, pressureCurve, rewardRules, feedback, risks)
  }

  // Output: 返回可执行的战斗数值设计结果。
  return finalizeCombatBalanceDesign(powerCurve, pressureCurve, rewardRules, feedback, risks)
}
```

## 强制约束

- 每个 skill 必须有 header。
- 必须明确区分数值设计与程序实现，不能输出代码、类结构或引擎 API 方案。
- 必须写清属性体系、敌我强度、伤害节奏、生存压力、反馈方式与阶段曲线，不能只写抽象概念。
- 必须主动识别数值碾压、伤害失衡、成长断层、敌人压力异常、反馈疲软与难度跳变等常见问题。
- 输出多个方案时，必须说明各自适用前提、代价与取舍，不能平铺罗列。
- 若信息不足，先提问，不自行脑补关键规则。
- 正文不得出现由谁调用该 skill 的描述。
- 参考项目时，禁止出现参考项目名。
- 使用中文交流。

## 质量标准

- 能处理战斗数值的新建设计与已有方案收束。
- 能明确属性体系、敌我强度、伤害窗口、生存压力、奖励结构与阶段推进关系。
- 能输出清晰的成长曲线、战斗压力结构与反馈节奏。
- 能识别主要可玩性风险，并给出可执行的收束建议。
- 能在信息不足时返回阻塞态并准确提出补充问题。
- 能保持职责、Input、Output、任务编排、强制约束、质量标准六块固定结构。
- 能保证任务编排包含伪代码，并明确体现 Input 与 Output。
- 产物可直接作为后续战斗数值评审、系统细化或实现对齐的输入。