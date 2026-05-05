---
name: program-system-quest
description: "用于 QuestSystem 实现与结构整理，适用于任务接取、任务目标跟踪、任务状态迁移、任务奖励结算和任务清单组织。"
---

# Program System Quest Skill

## 目的

该 skill 用于整理和实现 QuestSystem 相关结构，重点覆盖任务接取、任务目标跟踪、任务状态迁移、任务奖励结算和任务清单组织。

目标是产出结构清晰、可直接落地的任务系统代码方案，而不是停留在零散任务判断分支。

## 适用场景

- 需要新建或重构 QuestSystem
- 需要设计任务接取、任务更新、任务完成或任务失败流程
- 需要维护任务清单、任务节点、阶段推进和奖励结算
- 需要整理任务状态字段、存档同步和回放恢复规则

在以下情况不要使用本 skill：

- 只处理 UI 面板或任务界面展示
- 只处理纯剧情对白而不涉及任务状态
- 只处理项目配置或通用基础设施

## 接收的 Input

- QuestSystem 的目标路径、类名、命名空间和运行期目录
- 任务类型、任务目标、任务条件、任务奖励和失败条件
- 任务状态集合、阶段节点、事件来源和持久化要求
- 是否需要支持任务列表、唯一任务、并行任务和任务重置

若缺少任务目标、状态定义、奖励规则或失败条件，则不能可靠给出 QuestSystem 实现方案。

## 处理的事项

1. 识别目标是否属于 QuestSystem 或同类任务系统。
2. 整理任务接取、目标更新、阶段推进、完成结算和失败处理逻辑。
3. 设计任务状态字段、任务仓储结构和持久化接口。
4. 设计任务触发、刷新和任务清单读取方式。
5. 输出可直接实现的 QuestSystem 结构、方法骨架和注意事项。

## 输出的 Output

program-system-quest.skill 的 Output 应包含：

- QuestSystem 的职责拆分摘要
- 任务状态、任务目标和奖励流程建议
- 阶段推进、失败恢复和持久化规则
- 关键方法与接口边界
- 若信息不足，返回阻塞项与下一步建议

## 任务编排

program-system-quest.skill 的任务编排是先确认任务目标与状态定义，再整理阶段推进与结算流程，最后输出任务系统结构与持久化要求。

伪代码如下：

```text
programSystemQuest(input) {
    if (isMissingQuestSpec(input)) {
        return buildBlockedResult(input)
    }

    var questPlan = analyzeQuestSystemScope(input)
    var statePlan = buildQuestStateFlow(questPlan)
    var objectivePlan = buildQuestObjectives(questPlan)
    var rewardPlan = buildQuestRewardFlow(questPlan)
    var persistencePlan = buildQuestPersistence(questPlan)

    return summarizeQuestSystemResult(questPlan, statePlan, objectivePlan, rewardPlan, persistencePlan)
}
```

## 强制约束

- 必须明确包含 Input、处理事项、Output 三块核心内容。
- 任务编排必须包含伪代码。
- 必须同时设计任务状态、目标推进、奖励结算和持久化。
- 不得把 UI 展示职责混入 QuestSystem skill。
- 若缺少核心任务规则，应先返回阻塞项。

## 成功标准

- 能整理 QuestSystem 的职责边界
- 能给出任务状态与阶段推进的完整结构
- 能覆盖奖励结算和失败恢复流程
- 能输出可直接落地的任务系统结构建议