---
name: bootstrap-agent
description: "用于创建 agent、修改 agent、补全 agent 说明与工作流的技能。适用于新建 agent 文件、重构现有 agent、调整 agent 的职责边界、工具限制、触发条件与说明文本。禁止参考当前项目中已有的 agent/skill/instructions 文档；当任务涉及 agent header 或 frontmatter 的创建、修改、补全时，必须先询问用户。"
---

# Bootstrap Agent

## 职责

bootstrap-agent.skill 只负责 agent 文件本身的创建、修改、补全与收束，不负责普通业务代码文件。

它的职责收束为以下几类：

- 判断当前任务属于新建 agent、修改已有 agent，还是收敛已有 agent 的职责边界。
- 接收当前轮人机交互中整理出的 agent 可改进项，并仅在用户已确认处理范围后进入正式编辑。
- 收集并整理目标 agent 的核心结构，至少包括职责、调用的 agent 清单、调用的 skill 清单、任务编排、强制约束、质量标准。
- 约束由本 skill 创建或修改的目标 agent 采用与本 skill 相同的六块结构，不额外保留其他并列章节。
- 当任务涉及 header 或 frontmatter 时，先向用户问询，再继续正文修改。
- 当任务会连带影响 skill 时，先列出 skill 清单并等待用户选择，再进入对应 skill 处理。
- 对未被本次处理的 agent 改进项做保留说明，供上层继续问询或下轮处理。
- 在信息充分后，产出结构清晰、边界明确、可直接使用的 agent 文件。
- 仅适用于 agent 文件本身的创建、修改、重写、收束与说明补全；不处理普通业务代码，也不替代运行时代码修复。

## agents清单

- 无固定下游 agent。
- 本 skill 本身不直接调用其他 agent 来替代 agent 设计决策。
- 若目标 agent 需要调用其他 agent，必须把这些调用对象整理进目标 agent 的“调用的 agent 清单”中。

## skills清单

- 无固定下游 skill。
- 本 skill 只负责判断是否需要新增、修改或重构其他 skill，并要求先列出 skill 清单、等待用户选择。
- 若目标 agent 需要调用 skill，必须把这些调用对象整理进目标 agent 的“调用的 skill 清单”中。

## 任务编排

伪代码如下：

```text
bootstrapAgent(input) {
	// Input 是用户提供的 agent 目标、边界、调用方、工具限制、header 变更需求、skill 影响范围，
	// 以及当前轮人机交互中已经整理出的 agent 可改进项与用户已确认的处理范围。
	// 只处理 agent 文件本身；若任务实际是普通代码修改、纯概念解释或运行时代码修复，应直接返回改派建议。
	var taskType = decideAgentTaskType(input)
	var agentSpec = collectAgentSpec(input)
	var selectedImprovements = collectSelectedAgentImprovements(input)

	if (isMissingImprovementSelectionForAgentWork(selectedImprovements, taskType)) {
		// Output: 待确认态，返回 agent 可改进项与下一步需要用户确认的处理范围。
		return askUserToConfirmAgentImprovements(agentSpec, selectedImprovements)
	}

	if (isMissingCoreAgentInfo(agentSpec)) {
		// Output: 阻塞态，返回缺失项与下一步需要用户补充的信息。
		return askUserForMissingAgentInfo(agentSpec)
	}

	ensureAgentCoreSections(agentSpec)
	ensureCalledAgentsAndSkills(agentSpec)

	if (needsHeaderConfirmation(agentSpec)) {
		// Output: 待确认态，先询问 header，不进入正式编辑。
		return askUserForHeaderConfirmation(agentSpec)
	}

	if (needsSkillSelection(agentSpec)) {
		// Output: 待确认态，先列出涉及的 skills，并等待用户选择。
		return askUserToSelectSkills(agentSpec)
	}

	// 在正式生成前，必须保证目标 agent 的正文能收束为固定六块，且调用清单显式可读。
	// 调用的 agents: 无固定下游 agent，本 skill 自身负责 agent 结构整理。
	// 调用的 skills: 无固定下游 skill，只在需要时先列出 skill 清单供用户选择。
	var draft = buildOrUpdateAgent(taskType, agentSpec)
	// Output: 返回目标 agent 的新增或修改结果、已处理改进项、未处理改进项，以及必要的说明。
	return finalizeAgentDraft(draft, selectedImprovements)
}
```

## 强制约束

- 禁止参考项目内已有的 agent、skill、instructions、prompt 和其他说明性 Markdown 文档来补足需求。
- 允许使用的信息来源只有用户当前明确提供的要求、当前正在编辑的目标 agent 文件本身、通用的 agent 设计原则、官方能力或平台约束。
- 如果缺少信息，不要通过搜索项目文档补足；应直接向用户提问。
- 凡是通过本 skill 创建或修改的 agent，正文都必须明确包含职责、调用的 agent 清单、调用的 skill 清单、任务编排、强制约束、质量标准六块结构。
- 由本 skill 创建或修改的目标 agent，应与本 skill 保持同样的正文组织方式，只保留以上六块内容；其他信息应收束进这六块中，而不是继续展开为额外的并列章节。
- 调用的 agent 清单与调用的 skill 清单必须是显式可读的结构，不能只在段落叙述里隐含提及。
- 如果目标 agent 不调用其他 agent 或 skill，也必须明确写出空清单、兜底规则，或“不调用其他 agent / skill”的说明，不能留白。
- 任务编排必须是独立章节，且必须明确体现 Input 如何进入编排、调用了哪些 agents、调用了哪些 skills、以及 Output 如何产出或汇总返回。
- 任务编排必须包含伪代码，并允许使用注释加强说明；若只写成抽象流程，而没有明确 Input、调用对象或 Output，则视为不合格。
- 涉及 header 时，未获确认前不得正式编辑 header。
- 涉及 skill 时，未完成 skill 选择前不得进入 skill 改动。
- 涉及 agent 正式改动时，若还没有当前轮已确认的 agent 改进项范围，不得直接进入编辑。
- 本次已处理与未处理的 agent 改进项都必须在输出中显式说明，不能隐去。
- 当用户提及 agent 时，默认同步评估对应 skill，不得把 skill 排除在评估之外。
- 只要任务涉及 agent header 或 frontmatter 的创建、修改、补全、删减、重命名，都必须先询问用户并等待答复，然后才能继续编辑。
- header 的问询至少覆盖 `name`、`description`，以及是否需要额外字段，例如 `model`、`tools`。
- 若任务会影响 skill，必须先列出涉及哪些 skill、每个 skill 是新增还是修改、各自解决什么问题，并让用户先选范围。
- 若输出属于阻塞态、待确认态或最终结果态，必须明确标注当前状态与下一步建议。


## 质量标准

一个合格的 bootstrap-agent.skill 至少满足以下条件：

- tools 一定包含 vscode
- 能指导创建 agent
- 能指导修改 agent
- 能强制 agent 具备职责、调用的 agent 清单、调用的 skill 清单、任务编排、强制约束、质量标准六块核心结构
- 能强制由本 skill 创建或修改的 agent 与本 skill 自身保持相同的六块结构，不额外保留其他并列章节
- 能在 header 变更时强制进入问询流程
- 能在涉及 skill 时先列出 skill 清单并要求用户选择
- 能接收并落实用户已确认的 agent 改进项
- 能在输出中显式区分已处理与未处理的 agent 改进项
- 不依赖项目内已有文档
- 规则具体，可执行，不含含糊表述
- 产物能直接用于后续编辑工作
- 参考项目时，禁止出现参考项目名
- 任务编排必须包含伪代码
- 任务编排必须明确体现 Input、调用的 agents / skills、以及 Output