---
name: style-review
description: "用于 C# 代码风格审查与修正，适用于检查缩进、大括号风格、控制流可读性、诊断规则忽略项，并在明确允许时直接落地统一风格输出。"
---

# Style Review Skill

此 skill 提取了 Style Agent 的详细代码风格规范、审查流程与输出要求，用于统一 C# 代码风格审查与修正规范。

## 接收的 Input

- 需要审查的目标文件或代码片段
- 调用方指定的审查范围，例如缩进、大括号、控制流可读性或特定诊断规则
- 当前项目的风格约束和忽略规则
- 若存在，用户特别关注的可读性风险点

若未提供目标文件或代码片段，则不能开始审查。

## 处理的事项

1. 读取并遍历目标代码内容。
2. 按缩进、大括号、`else/catch/finally` 风格和控制流可读性规则逐项检查。
3. 忽略本 skill 明确标记为可忽略的诊断规则。
4. 汇总违规数量、具体位置、问题说明和修正建议。
5. 在用户或调用方明确允许修改时，直接修正目标代码中的风格与可读性问题，并输出变更摘要。

## 输出的 Output

style-review.skill 的 Output 应包含：

- 审查是否通过
- 违规数量
- 每条违规的路径、位置、问题说明和修正建议
- 是否已直接修改代码
- 若已修改，返回变更文件与修正摘要
- 若无违规，返回统一的通过结果

## 任务编排

style-review.skill 的任务编排是先读取代码，再按既定风格规则逐项检查，并在允许时直接修正，最后输出结构化审查结果或修正结果。

伪代码如下：

```text
styleReview(input) {
    if (isMissingReviewTarget(input)) {
        return buildBlockedResult(input)
    }

    var codeSample = loadReviewTarget(input)
    var violations = []
    violations.push(checkIndentation(codeSample))
    violations.push(checkBraceStyle(codeSample))
    violations.push(checkElseCatchFinallyStyle(codeSample))
    violations.push(checkControlFlowReadability(codeSample))
    filterIgnoredDiagnostics(violations)

    if (shouldApplyStyleFixes(input, violations)) {
        var appliedChanges = applyStyleFixes(codeSample, violations)
        return summarizeStyleReview(violations, appliedChanges)
    }

    return summarizeStyleReview(violations)
}
```

约束说明：

- 该 skill 仅在用户或调用方明确允许时直接修代码，且修改范围只限风格与可读性问题。
- 结果必须指向具体问题位置，不能只返回笼统评价。
- 审查结论只覆盖风格与可读性，不替代业务正确性判断。

## 核心规范

### 缩进

- 缩进必须使用 4 个空格
- 禁止使用 Tab 字符进行缩进

### 大括号：Egyptian Style

所有场景左大括号 `{` 均不换行，紧跟在声明或语句末尾：

- 类型（class / struct / enum / interface）
- 方法
- 属性、访问器
- 控制块（if / for / while / switch 等）
- Lambda 表达式
- 匿名方法 / 匿名类型
- 对象 / 集合 / 数组初始化器

### else / catch / finally

紧跟上一个 `}` 同行：

```csharp
if (condition) {
    DoA();
} else {
    DoB();
}

try {
    Execute();
} catch (Exception e) {
    Handle(e);
} finally {
    Cleanup();
}
```

### 控制流可读性

- 优先使用早返回与显式分支，避免多层嵌套导致阅读负担。
- 禁止使用影响可读性的复杂条件拼接与连续三元表达式。
- 条件表达式需要可读语义，必要时抽取具名变量。
- 对关键分支与异常路径，建议补充简短注释解释分支意图。

### 被抑制的诊断规则

以下诊断规则在本项目中不视为违规，审查时应忽略：

**IDE 规则（Roslyn）**：
IDE0001, IDE0017, IDE0018, IDE0028, IDE0040, IDE0044, IDE0051, IDE0054, IDE0059, IDE0060, IDE0063, IDE0066, IDE0071, IDE0083, IDE0090, IDE1006

**RCS 规则（Roslynator）**：
RCS1018, RCS1021, RCS1036, RCS1089, RCS1090, RCS1118, RCS1132, RCS1146, RCS1163, RCS1169, RCS1179, RCS1206, RCS1213

### OmniSharp 格式化配置

以下选项均为 `false`（对应 Egyptian Style）：
- `NewLinesForBracesIn*`：Types / Methods / Properties / Accessors / ControlBlocks / LambdaExpressionBody / AnonymousMethods / AnonymousTypes / ObjectCollectionArrayInitializers
- `NewLineForElse` / `NewLineForCatch` / `NewLineForFinally`

## 审查流程

1. 读取目标文件
2. 逐项检查格式化规则与控制流可读性规则
3. 在允许直接修改时应用风格修正
4. 返回违规列表与变更摘要（文件路径 + 行号 + 违规描述 + 修正建议）

## 输出格式

返回结构化审查结果：
- 违规数量
- 逐条违规明细（路径、行号、问题、修正）
- 若已修改，补充变更文件与修正摘要
- 无违规时返回"风格检查通过"

## 约束

- 仅在用户或调用方明确允许时修改代码文件，且只处理风格与可读性问题
- 聚焦代码可读性与风格，不做业务正确性背书
- 使用中文交流
