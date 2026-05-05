---
name: program-audiomodule
description: "用于 AudioModule 编写与调整，适用于音频实例管理、播放控制、静音与音量状态、平台音频上下文封装，以及运行期音频事件处理的设计。"
---

# Program AudioModule Skill

## 目的

该 skill 用于整理和实现 AudioModule 相关结构，重点覆盖音频实例创建、播放/暂停/停止、循环与 seek、静音与音量状态、预下载与平台差异封装。

参考锚点来自 MoodPuzzle 现有音频接入面，关键模式包括：

- 运行期音频实例具备 `Play`、`Pause`、`Stop`、`Seek`、`Destroy`
- 音频上下文具备 `src`、`loop`、`volume`、`mute`、`playbackRate`、`needDownload`
- 微信小游戏端支持预下载与音频中断恢复
- 平台音频对象具备 `OnCanplay`、`OnPlay`、`OnPause`、`OnStop`、`OnEnded`、`OnError` 等监听能力

## 适用场景

- 需要新建或重构 `AudioModule`
- 需要设计 BGM / SFX 的实例管理与播放控制
- 需要补充静音、音量、循环、播放速率或 seek 行为
- 需要封装平台音频上下文、预下载和中断恢复逻辑

在以下情况不要使用本 skill：

- 只修改单个音频资源文件或导入设置
- 只调整某个业务 Controller 的播音时机
- 只做通用脚本结构整理，但不涉及 AudioModule 职责本身

## 接收的 Input

- AudioModule 的目标路径、类名、命名空间和运行期目录
- 音频资源类型、资源键、BGM / SFX 分类和缓存方式
- 音频实例的创建策略、复用策略、销毁策略和并发上限
- 音量、静音、循环、播放速率、seek、自动播放与预下载要求
- 平台适配约束，例如微信小游戏、WebGL 或其他音频中断处理规则

若缺少音频分类、实例生命周期或平台约束，则不能可靠给出 AudioModule 实现方案。

## 处理的事项

1. 识别目标是否属于 AudioModule 或同类运行期音频模块。
2. 整理 BGM、SFX、音频实例池和音频配置状态。
3. 设计实例创建、播放控制、暂停恢复、停止销毁和预下载流程。
4. 设计音量、静音、循环、播放速率和 seek 的状态管理。
5. 约束平台事件监听、错误处理和音频中断恢复。
6. 输出可直接实现的 AudioModule 结构、方法骨架和注意事项。

## 输出的 Output

program-audiomodule.skill 的 Output 应包含：

- AudioModule 的职责拆分摘要
- 音频实例、分类缓存和状态字段建议
- 播放控制与平台封装的关键方法清单
- 音量/静音/中断恢复/错误处理规则
- 若信息不足，返回阻塞项与下一步建议

## 任务编排

program-audiomodule.skill 的任务编排是先确认音频分类与平台约束，再整理实例管理与状态控制，最后输出播放接口与事件处理规则。

伪代码如下：

```text
programAudioModule(input) {
    if (isMissingAudioModuleSpec(input)) {
        return buildBlockedResult(input)
    }

    var audioPlan = analyzeAudioModuleScope(input)
    var categoryPlan = buildAudioCategories(audioPlan)
    var instancePlan = buildAudioInstances(audioPlan)
    var controlPlan = buildAudioControls(audioPlan)
    var platformPlan = buildAudioPlatformRules(audioPlan)

    return summarizeAudioModuleResult(audioPlan, categoryPlan, instancePlan, controlPlan, platformPlan)
}
```

约束说明：

- AudioModule 应聚焦音频实例与播放控制，不承载业务流程判定。
- 播放接口与实例生命周期必须成对设计，避免只定义播放不定义释放与恢复。
- 若涉及平台音频中断，必须明确中断开始、恢复和静音状态如何协同。
- 平台上下文封装与业务播放入口应分层，避免把平台 API 暴露到业务侧。

## 实现流程

### 第一步：确认音频分类

明确模块是否区分 BGM、SFX、语音或其他音频类别，以及每类的缓存与并发策略。

### 第二步：确认实例管理

设计音频实例的创建、复用、销毁、预下载和回收规则。

### 第三步：确认控制状态

整理音量、静音、循环、播放速率、seek、自动播放和暂停恢复的状态字段与接口。

### 第四步：确认平台约束

整理微信小游戏、WebGL 或其他目标平台的音频上下文、事件监听和中断恢复规则。

### 第五步：输出结果

返回 AudioModule 的结构建议、关键方法、状态规则与阻塞项。

## 强制约束

- 必须明确包含 Input、处理事项、Output 三块核心内容。
- 任务编排必须包含伪代码。
- 必须同时设计实例生命周期、播放控制和平台事件处理。
- 不得把音频资源制作职责混入 AudioModule 结构说明。
- 若缺少实例生命周期或平台约束，应先返回阻塞项。

## 成功标准

- 能整理 AudioModule 的分类缓存与实例管理边界
- 能给出播放、暂停、停止、seek、销毁的完整控制面
- 能覆盖音量、静音、预下载和中断恢复规则
- 能输出可直接落地的 AudioModule 结构建议