---
name: gamedesign-system-dialogue
description: "用于对话系统设计，负责对话目标、分支条件、信息反馈、状态变化与可玩性收束。"
---

# Gamedesign System Dialogue Skill

## 职责

gamedesign-system-dialogue.skill 只负责对话系统设计本身的整理、收束与输出，不负责程序实现、美术制作、文本资产批量生产或运行时代码修复。

它的职责收束为以下几类：

- 明确对话系统中的交互目标、触发条件、分支规则、状态变化、失败条件与结果产出。
- 设计主线对话、支线对话、选项分支、关系变化、信息揭示与反馈节奏。
- 约束对话节点结构、分支条件、回流逻辑、信息密度、玩家选择成本与引导方式。
- 识别对话冗长、分支无意义、反馈不足、状态回写不清、信息过载与节奏断裂，并给出收束方案。
- 输出可供后续系统细化、叙事设计或实现对齐的结构化对话系统说明。
- 仅适用于对话系统设计、规则梳理、状态收束与可玩性评估；不替代程序编码、文案量产、美术资产制作或项目排期。

## Input

- 用户提供的游戏题材、目标玩家、平台约束与对话体验目标。
- 当前对话系统设想，包括触发方式、节点结构、选项分支、状态条件、关系变化与结果写回。
- 对话时长、节奏预期、信息密度、引导方式与当前已知问题。
- 本次希望输出的粒度，例如概念级系统方案、可执行规则草案或风险收束建议。

## Output

- 结构化的对话系统设计结果，包括对话目标、分支结构、关键规则、状态变化与反馈方案。
- 对节点类型、触发与结束条件、选项分支、状态写回、关系变化与信息揭示方式的明确说明。
- 主要可玩性风险、冲突点、薄弱反馈点与建议的收束方向。
- 若信息不足，返回阻塞态，并明确指出缺失信息与下一步建议。

## 任务编排

伪代码如下：

```text
gamedesignSystemDialogue(input) {
  // Input 是用户提供的对话系统目标、分支结构、状态条件、反馈方式与当前问题。
  var systemGoal = extractSystemGoal(input)
  var dialogueStructure = extractDialogueStructure(input)
  var stateRules = extractStateRules(input)
  var constraints = extractConstraints(input)

  if (isMissingCriticalInfo(systemGoal, dialogueStructure, stateRules, constraints)) {
    // Output: 阻塞态，返回缺失项与补充问题。
    return askUserForMissingDialogueSystemInfo(systemGoal, dialogueStructure, stateRules, constraints)
  }

  var dialogueLoop = buildDialogueSystemLoop(systemGoal, dialogueStructure, constraints)
  var branchFlow = buildBranchFlow(dialogueLoop, stateRules, constraints)
  var feedbackRules = defineDialogueFeedbackRules(dialogueLoop, branchFlow, constraints)
  var writebackRules = defineDialogueWritebackRules(branchFlow, feedbackRules, constraints)
  var risks = inspectDialogueSystemRisks(dialogueLoop, branchFlow, feedbackRules, writebackRules)

  if (hasMajorDesignConflict(risks)) {
    // Output: 返回主要冲突、影响与收束建议。
    return resolveDialogueSystemConflicts(dialogueLoop, branchFlow, feedbackRules, writebackRules, risks)
  }

  // Output: 返回可执行的对话系统设计结果。
  return finalizeDialogueSystemDesign(dialogueLoop, branchFlow, feedbackRules, writebackRules, risks)
}
```

## 强制约束

- 每个 skill 必须有 header。
- 必须明确区分系统设计与程序实现，不能输出代码、类结构或引擎 API 方案。
- 必须写清对话目标、分支规则、状态变化、信息揭示、反馈方式与节奏曲线，不能只写抽象概念。
- 必须主动识别分支无差异、状态写回不清、信息过载、对话拖沓、选择缺乏反馈与引导断层等常见问题。
- 输出多个方案时，必须说明各自适用前提、代价与取舍，不能平铺罗列。
- 若信息不足，先提问，不自行脑补关键规则。
- 正文不得出现由谁调用该 skill 的描述。
- 参考项目时，禁止出现参考项目名。
- 使用中文交流。

## 质量标准

- 能处理对话系统的新建设计与已有方案收束。
- 能明确目标、分支结构、触发条件、状态写回、失败条件与推进关系。
- 能输出清晰的系统循环、分支规则、反馈方式与信息结构。
- 能识别主要可玩性风险，并给出可执行的收束建议。
- 能在信息不足时返回阻塞态并准确提出补充问题。
- 能保持职责、Input、Output、任务编排、强制约束、质量标准六块固定结构。
- 能保证任务编排包含伪代码，并明确体现 Input 与 Output。
- 产物可直接作为后续系统评审、叙事细化或实现对齐的输入。