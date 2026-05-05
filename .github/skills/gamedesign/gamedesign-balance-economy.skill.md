---
name: gamedesign-balance-economy
description: "用于经济数值设计，负责资源产出消耗、货币循环、商店定价、养成成本与通胀风险收束。"
---

# Gamedesign Balance Economy Skill

## 职责

gamedesign-balance-economy.skill 只负责经济数值设计本身的整理、收束与输出，不负责程序实现、美术制作、数据表落地或运行时代码修复。

它的职责收束为以下几类：

- 明确经济系统中的货币类型、资源来源、资源去向、产出节奏、消耗节奏与阶段边界。
- 设计货币循环、资源投放、商店定价、养成成本、回收机制与通胀控制手段。
- 约束资源稀缺度、收益回路、消费优先级、积累速度、资源转化关系与长期平衡。
- 识别通胀、屯积、收益断层、回收不足、消费疲软与资源空转，并给出收束方案。
- 输出可供后续经济系统细化、数值评审或实现对齐的结构化经济数值说明。
- 仅适用于经济数值设计、资源循环梳理、成本收益收束与可玩性评估；不替代程序编码、精确公式实现、美术资产制作或项目排期。

## Input

- 用户提供的游戏题材、目标玩家、平台约束与经济体验目标。
- 当前经济数值设想，包括货币类型、资源来源、消耗点、商店结构、养成成本与奖励投放。
- 收益节奏、消费节奏、留存目标、付费或非付费边界与当前已知问题。
- 本次希望输出的粒度，例如概念级经济方案、可执行规则草案或风险收束建议。

## Output

- 结构化的经济数值设计结果，包括资源循环、关键规则、产出消耗关系与反馈方案。
- 对货币层级、资源投放、消费节点、定价逻辑、回收机制与风险边界的明确说明。
- 主要可玩性风险、冲突点、薄弱反馈点与建议的收束方向。
- 若信息不足，返回阻塞态，并明确指出缺失信息与下一步建议。

## 任务编排

伪代码如下：

```text
gamedesignBalanceEconomy(input) {
  // Input 是用户提供的经济目标、货币结构、资源关系、消费节点、反馈方式与当前问题。
  var balanceGoal = extractBalanceGoal(input)
  var economyResources = extractEconomyResources(input)
  var economySinks = extractEconomySinks(input)
  var constraints = extractConstraints(input)

  if (isMissingCriticalInfo(balanceGoal, economyResources, economySinks, constraints)) {
    // Output: 阻塞态，返回缺失项与补充问题。
    return askUserForMissingEconomyBalanceInfo(balanceGoal, economyResources, economySinks, constraints)
  }

  var economyLoop = buildEconomyLoop(balanceGoal, economyResources, constraints)
  var pricingRules = definePricingRules(economyLoop, economySinks, constraints)
  var sinkRecovery = defineSinkRecoveryRules(pricingRules, economyLoop, constraints)
  var feedback = defineEconomyFeedback(pricingRules, sinkRecovery, constraints)
  var risks = inspectEconomyBalanceRisks(economyLoop, pricingRules, sinkRecovery, feedback)

  if (hasMajorDesignConflict(risks)) {
    // Output: 返回主要冲突、影响与收束建议。
    return resolveEconomyBalanceConflicts(economyLoop, pricingRules, sinkRecovery, feedback, risks)
  }

  // Output: 返回可执行的经济数值设计结果。
  return finalizeEconomyBalanceDesign(economyLoop, pricingRules, sinkRecovery, feedback, risks)
}
```

## 强制约束

- 每个 skill 必须有 header。
- 必须明确区分数值设计与程序实现，不能输出代码、类结构或引擎 API 方案。
- 必须写清货币结构、资源来源去向、定价逻辑、产出消耗关系、反馈方式与阶段曲线，不能只写抽象概念。
- 必须主动识别通胀、屯积、回收不足、消费疲软、收益断层与资源空转等常见问题。
- 输出多个方案时，必须说明各自适用前提、代价与取舍，不能平铺罗列。
- 若信息不足，先提问，不自行脑补关键规则。
- 正文不得出现由谁调用该 skill 的描述。
- 参考项目时，禁止出现参考项目名。
- 使用中文交流。

## 质量标准

- 能处理经济数值的新建设计与已有方案收束。
- 能明确货币结构、资源循环、定价逻辑、消费节点、风险边界与阶段推进关系。
- 能输出清晰的产出消耗关系、回收结构与反馈节奏。
- 能识别主要可玩性风险，并给出可执行的收束建议。
- 能在信息不足时返回阻塞态并准确提出补充问题。
- 能保持职责、Input、Output、任务编排、强制约束、质量标准六块固定结构。
- 能保证任务编排包含伪代码，并明确体现 Input 与 Output。
- 产物可直接作为后续经济评审、系统细化或实现对齐的输入。