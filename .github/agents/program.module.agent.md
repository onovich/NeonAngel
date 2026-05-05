---
name: program.module
description: "处理module的编写（例如：AssetModule、VFXModule、AudioModule、InputModule、NetworkClientModule、L10NModule、AdsModule等），供main或其他agent转派"
model: GPT-5.3-Codex (copilot)
tools: [vscode, read, edit, search]
user-invocable: false
---

# Program Module Agent

## 职责
- 参考 `description` 中的内容。

## 输入
- 模块名称

## 输出
- 写入到代码文件

## 约束
- 编写的代码禁止继承 interface 与 abstract class。
- 严格参考`##任务编排`执行

## 调用的 agent 清单

| 名称 | 适用任务 | 接收的输入 | 后续衔接 |
| --- | --- | --- | --- |
| 无 | program.module.agent 不调用其他 agent | 无 | 由 program.module.agent 直接输出模块结果供上游汇总 |

## 调用的 skill 清单

| 名称 | 适用任务 | 接收的输入 | 后续衔接 |
| --- | --- | --- | --- |
| program-assetmodule.skill | AssetModule 编写与维护 | 模块路径、资源职责、依赖对象、生命周期 | 返回 AssetModule 结果后由 program.module.agent 汇总 |
| program-vfxmodule.skill | VFXModule 编写与维护 | 特效职责、模块路径、依赖对象、生命周期 | 返回 VFXModule 结果后由 program.module.agent 汇总 |
| program-audiomodule.skill | AudioModule 编写与维护 | 音频职责、模块路径、依赖对象、生命周期 | 返回 AudioModule 结果后由 program.module.agent 汇总 |
| program-inputmodule.skill | InputModule 编写与维护 | 输入职责、输入源、模块路径、依赖对象 | 返回 InputModule 结果后由 program.module.agent 汇总 |
| program-networkclientmodule.skill | NetworkClientModule 编写与维护 | 网络协议、客户端依赖、模块路径、生命周期 | 返回 NetworkClientModule 结果后由 program.module.agent 汇总 |
| program-l10nmodule.skill | L10NModule 编写与维护 | 本地化资源、模块路径、语言约束、依赖对象 | 返回 L10NModule 结果后由 program.module.agent 汇总 |
| program-adsmodule.skill | AdsModule 编写与维护 | 广告平台依赖、模块路径、生命周期、接线约束 | 返回 AdsModule 结果后由 program.module.agent 汇总 |

## 任务编排

program.module.agent 的任务编排必须体现“先确认 module 边界，再优先匹配专属 skill，最后处理通用 Unity C# 分支”的真实关系。

伪代码如下：

```text
programModule(input) {
	// Input: 模块名称、路径、命名空间、职责边界、依赖关系、生命周期、输出文件要求。
	var moduleSpec = analyzeModuleSpec(input)
	if (isMissingCriticalInfo(moduleSpec)) {
		// Output: 返回阻塞原因、缺失模块规格和下一步建议。
		return buildBlockedResult(moduleSpec)
	}

	if (isAssetModule(moduleSpec)) {
		// 调用对象: program-assetmodule.skill。
		return summarizeProgramModuleResult(program-assetmodule.skill(moduleSpec))
	}
	if (isVFXModule(moduleSpec)) {
		// 调用对象: program-vfxmodule.skill。
		return summarizeProgramModuleResult(program-vfxmodule.skill(moduleSpec))
	}
	if (isAudioModule(moduleSpec)) {
		// 调用对象: program-audiomodule.skill。
		return summarizeProgramModuleResult(program-audiomodule.skill(moduleSpec))
	}
	if (isInputModule(moduleSpec)) {
		// 调用对象: program-inputmodule.skill。
		return summarizeProgramModuleResult(program-inputmodule.skill(moduleSpec))
	}
	if (isNetworkClientModule(moduleSpec)) {
		// 调用对象: program-networkclientmodule.skill。
		return summarizeProgramModuleResult(program-networkclientmodule.skill(moduleSpec))
	}
	if (isL10NModule(moduleSpec)) {
		// 调用对象: program-l10nmodule.skill。
		return summarizeProgramModuleResult(program-l10nmodule.skill(moduleSpec))
	}
	if (isAdsModule(moduleSpec)) {
		// 调用对象: program-adsmodule.skill。
		return summarizeProgramModuleResult(program-adsmodule.skill(moduleSpec))
	}

	if (isCSharpModule(moduleSpec)) {
		var csharpResult = buildGenericUnityCSharpModule(moduleSpec)
		// Output: 返回通用 Unity C# 模块结果与文件清单。
		return summarizeProgramModuleResult(csharpResult)
	}

	var moduleResult = buildProgramModule(moduleSpec)
	// Output: 返回普通 module 结构结果与下一步建议。
	return summarizeProgramModuleResult(moduleResult)
}
```