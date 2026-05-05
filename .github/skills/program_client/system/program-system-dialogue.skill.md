---
name: program-system-dialogue
description: "用于 DialogueSystem 实现与结构整理，适用于对白节点推进、选项分支、播放状态维护、跳过控制和对白结束收口逻辑设计。"
---

# Program System Dialogue Skill

## 目的

该 skill 用于整理和实现 DialogueSystem 相关结构，重点覆盖对白节点推进、选项分支、播放状态维护、跳过控制和对白结束收口逻辑。

目标是产出结构清晰、可直接落地的对白系统代码方案，而不是停留在零散文本切换函数。

## 适用场景

- 需要新建或重构 DialogueSystem
- 需要设计对白节点、分支选项、自动播放或手动推进
- 需要补充对白中断、跳过、回退或结束回调流程
- 需要整理对白状态、角色发言顺序和事件触发边界

在以下情况不要使用本 skill：

- 只处理对白 UI 面板表现
- 只处理任务条件，而不涉及对白流程
- 只处理项目配置或通用基础设施

## 接收的 Input

- DialogueSystem 的目标路径、类名、命名空间和运行期目录
- 对白节点结构、分支选项、推进方式和结束条件
- 播放状态字段、角色发言顺序、回调事件和跳过规则
- 是否需要支持自动播放、打字机效果占位、历史记录和中断恢复

若缺少对白节点结构、推进方式、状态定义或结束条件，则不能可靠给出 DialogueSystem 实现方案。

## 处理的事项

1. 识别目标是否属于 DialogueSystem 或同类对白系统。
2. 整理对白节点推进、分支选择、播放状态与结束收口逻辑。
3. 设计对白状态字段、节点仓储和回调接口。
4. 设计跳过、自动播放、中断恢复和历史记录边界。
5. 输出可直接实现的 DialogueSystem 结构、方法骨架和注意事项。

## 输出的 Output

program-system-dialogue.skill 的 Output 应包含：

- DialogueSystem 的职责拆分摘要
- 节点推进、分支选择和状态流转建议
- 跳过、中断和结束回调规则
- 关键方法与接口边界
- 若信息不足，返回阻塞项与下一步建议

## 任务编排

program-system-dialogue.skill 的任务编排是先确认对白节点与推进方式，再整理状态流转与分支逻辑，最后输出对白系统结构与回调边界。

伪代码如下：

```text
programSystemDialogue(input) {
    if (isMissingDialogueSpec(input)) {
        return buildBlockedResult(input)
    }

    var dialoguePlan = analyzeDialogueSystemScope(input)
    var nodePlan = buildDialogueNodes(dialoguePlan)
    var branchPlan = buildDialogueBranches(dialoguePlan)
    var statePlan = buildDialogueStateFlow(dialoguePlan)
    var callbackPlan = buildDialogueCallbacks(dialoguePlan)

    return summarizeDialogueSystemResult(dialoguePlan, nodePlan, branchPlan, statePlan, callbackPlan)
}
```

## 强制约束

- 必须明确包含 Input、处理事项、Output 三块核心内容。
- 任务编排必须包含伪代码。
- 必须同时设计节点推进、分支选择、状态维护和结束收口。
- 不得把纯 UI 表现职责混入 DialogueSystem skill。
- 若缺少核心对白规则，应先返回阻塞项。

## 成功标准

- 能整理 DialogueSystem 的职责边界
- 能给出节点推进与分支逻辑的完整结构
- 能覆盖跳过、中断和结束回调流程
- 能输出可直接落地的对白系统结构建议