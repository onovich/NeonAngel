---
name: performance
description: "用于性能分析与优化建议，适用于定位 CPU、GC、内存、加载与渲染瓶颈，并输出结构化证据与优化方向。"
---

# Performance Skill

此 skill 专注于性能分析与优化建议输出，适用于代码、模块、场景或系统层面的性能问题定位。

## 接收的 Input

- 待分析的目标范围，例如文件、模块、场景、系统或构建产物
- 性能症状，例如卡顿、掉帧、GC 峰值、内存增长、加载慢、渲染开销高
- 目标平台、运行环境、性能预算和复现条件
- 若存在，Profiler 采样、日志、帧数据、监控指标或用户补充的性能线索

若未提供目标范围或性能症状，则不能可靠开始分析。

## 处理的事项

1. 分析性能目标、平台和复现条件。
2. 读取并整理可用证据，例如代码路径、日志、Profiler 线索或用户描述。
3. 从 CPU、GC、内存、加载、渲染或 IO 等维度识别主要瓶颈。
4. 评估影响范围、风险和优先级。
5. 输出结构化的优化建议与后续验证方向。

## 输出的 Output

performance.skill 的 Output 应包含：

- 当前分析范围与性能症状
- 主要瓶颈列表
- 每个瓶颈对应的证据、影响和优先级
- 优化建议、预期收益和验证方式
- 若存在阻塞，明确指出缺失信息

## 任务编排

performance.skill 的任务编排是先确认目标与证据，再识别瓶颈，最后输出结构化建议。

伪代码如下：

```text
performance(input) {
  if (isMissingPerformanceTarget(input) || isMissingPerformanceSymptom(input)) {
    return buildBlockedResult(input)
  }

  var evidence = collectPerformanceEvidence(input)
  var bottlenecks = analyzePerformanceBottlenecks(evidence, input)
  var suggestions = buildOptimizationSuggestions(bottlenecks, input)

  return summarizePerformanceResult(bottlenecks, suggestions)
}
```

约束说明：

- 结论必须尽量基于可见证据，不得无依据断言瓶颈。
- 输出应区分事实、推断和建议，不混写。
- 结果不直接替代代码修改或最终性能验收。

## 核心职责

- 定位性能瓶颈
- 归类 CPU、GC、内存、加载、渲染与 IO 问题
- 输出证据、影响和优先级
- 给出可执行的优化建议与验证方向

## 实现流程

1. 确认分析目标范围与复现条件
2. 收集现有证据，例如日志、Profiler 结果、代码热点或用户观测
3. 按 CPU、GC、内存、加载、渲染、IO 维度归类问题
4. 识别最可能的主瓶颈与次级瓶颈
5. 输出分优先级的优化建议和后续验证方式

## 约束

- 所有结论应标明依据来源
- 使用中文输出
- 信息不足时，应明确阻塞项，不凭空补全关键证据
- 优化建议应尽量与目标平台和性能预算匹配

## 输出说明

- 输出主要瓶颈、证据、影响范围、优化建议和验证方向
- 如有阻塞，明确指出需要补充的数据或复现条件
