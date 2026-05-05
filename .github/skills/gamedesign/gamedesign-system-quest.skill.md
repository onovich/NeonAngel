---
name: gamedesign-system-quest
description: "用于任务系统设计，负责任务目标、推进条件、奖励结构、状态流转与可玩性收束。"
---

# Gamedesign System Quest Skill

## 职责

gamedesign-system-quest.skill 只负责任务系统设计本身的整理、收束与输出，不负责程序实现、美术制作、任务资源搭建或运行时代码修复。

它的职责收束为以下几类：

- 明确任务系统中的任务目标、接取条件、推进条件、完成条件、失败条件与奖励结构。
- 设计主线、支线、日常、循环任务或阶段目标之间的关系与推进节奏。
- 约束任务状态流转、依赖关系、追踪方式、奖励节奏、玩家引导与信息反馈。
- 识别卡任务、目标不清、奖励失衡、流程重复、依赖冲突与反馈不足，并给出收束方案。
- 输出可供后续系统细化、内容设计或实现对齐的结构化任务系统说明。
- 仅适用于任务系统设计、规则梳理、状态收束与可玩性评估；不替代程序编码、数值实现、美术资产制作或项目排期。

## Input

- 用户提供的游戏题材、目标玩家、平台约束与任务体验目标。
- 当前任务系统设想，包括任务类型、触发方式、推进条件、奖励结构、追踪方式与依赖关系。
- 任务时长、节奏预期、引导方式、重复游玩目标与当前已知问题。
- 本次希望输出的粒度，例如概念级系统方案、可执行规则草案或风险收束建议。

## Output

- 结构化的任务系统设计结果，包括任务目标、状态流转、关键规则、推进节奏与反馈方案。
- 对任务类型划分、接取与完成条件、奖励结构、依赖关系与追踪方式的明确说明。
- 主要可玩性风险、冲突点、薄弱反馈点与建议的收束方向。
- 若信息不足，返回阻塞态，并明确指出缺失信息与下一步建议。

## 任务编排

伪代码如下：

```text
gamedesignSystemQuest(input) {
  // Input 是用户提供的任务系统目标、任务类型、推进条件、奖励结构、状态流转与当前问题。
  var systemGoal = extractSystemGoal(input)
  var questTypes = extractQuestTypes(input)
  var progressionRules = extractProgressionRules(input)
  var constraints = extractConstraints(input)

  if (isMissingCriticalInfo(systemGoal, questTypes, progressionRules, constraints)) {
    // Output: 阻塞态，返回缺失项与补充问题。
    return askUserForMissingQuestSystemInfo(systemGoal, questTypes, progressionRules, constraints)
  }

  var questLoop = buildQuestSystemLoop(systemGoal, questTypes, constraints)
  var stateFlow = buildQuestStateFlow(questLoop, progressionRules, constraints)
  var rewardRules = defineRewardRules(questLoop, stateFlow, constraints)
  var feedback = defineQuestFeedback(stateFlow, rewardRules, constraints)
  var risks = inspectQuestSystemRisks(questLoop, stateFlow, rewardRules, feedback)

  if (hasMajorDesignConflict(risks)) {
    // Output: 返回主要冲突、影响与收束建议。
    return resolveQuestSystemConflicts(questLoop, stateFlow, rewardRules, feedback, risks)
  }

  // Output: 返回可执行的任务系统设计结果。
  return finalizeQuestSystemDesign(questLoop, stateFlow, rewardRules, feedback, risks)
}
```

## 强制约束

- 每个 skill 必须有 header。
- 必须明确区分系统设计与程序实现，不能输出代码、类结构或引擎 API 方案。
- 必须写清任务目标、状态流转、依赖关系、奖励结构、追踪方式、反馈方式与节奏曲线，不能只写抽象概念。
- 必须主动识别任务描述不清、依赖冲突、奖励断层、追踪负担、循环任务疲劳与流程空转等常见问题。
- 输出多个方案时，必须说明各自适用前提、代价与取舍，不能平铺罗列。
- 若信息不足，先提问，不自行脑补关键规则。
- 正文不得出现由谁调用该 skill 的描述。
- 参考项目时，禁止出现参考项目名。
- 使用中文交流。

## 质量标准

- 能处理任务系统的新建设计与已有方案收束。
- 能明确目标、任务类型、推进条件、奖励结构、失败条件与状态推进关系。
- 能输出清晰的系统循环、状态规则、引导方式与反馈结构。
- 能识别主要可玩性风险，并给出可执行的收束建议。
- 能在信息不足时返回阻塞态并准确提出补充问题。
- 能保持职责、Input、Output、任务编排、强制约束、质量标准六块固定结构。
- 能保证任务编排包含伪代码，并明确体现 Input 与 Output。
- 产物可直接作为后续系统评审、内容细化或实现对齐的输入。