---
name: program-system-login
description: "用于 LoginSystem 实现与结构整理，适用于登录流程状态维护、账号或渠道选择、登录请求编排、结果收口和失败重试逻辑设计。"
---

# Program System Login Skill

## 目的

该 skill 用于整理和实现 LoginSystem 相关结构，重点覆盖登录流程状态维护、账号或渠道选择、登录请求编排、结果收口和失败重试逻辑。

目标是产出结构清晰、可直接落地的登录系统代码方案，而不是停留在零散的登录回调拼接。

## 适用场景

- 需要新建或重构 LoginSystem
- 需要设计登录入口、渠道选择、账号状态和登录结果处理
- 需要补充登录失败重试、超时、回退和成功后的后续跳转
- 需要整理登录状态字段、登录步骤和异步结果收口

在以下情况不要使用本 skill：

- 只处理登录 UI 面板展示
- 只处理网络底层传输而不涉及登录流程本身
- 只处理项目配置或通用基础设施

## 接收的 Input

- LoginSystem 的目标路径、类名、命名空间和运行期目录
- 登录方式、渠道类型、账号状态、请求步骤和成功条件
- 失败条件、超时规则、重试策略和结果跳转要求
- 是否需要支持游客登录、账号切换、自动登录和登出回收

若缺少登录方式、状态定义、成功条件或失败策略，则不能可靠给出 LoginSystem 实现方案。

## 处理的事项

1. 识别目标是否属于 LoginSystem 或同类登录系统。
2. 整理登录入口、步骤推进、状态维护和结果收口逻辑。
3. 设计登录状态字段、异步请求顺序、成功跳转和失败重试规则。
4. 设计账号切换、自动登录、超时和登出清理边界。
5. 输出可直接实现的 LoginSystem 结构、方法骨架和注意事项。

## 输出的 Output

program-system-login.skill 的 Output 应包含：

- LoginSystem 的职责拆分摘要
- 登录步骤、状态字段和结果收口建议
- 超时、失败重试和切换账号规则
- 关键方法与接口边界
- 若信息不足，返回阻塞项与下一步建议

## 任务编排

program-system-login.skill 的任务编排是先确认登录方式与状态定义，再整理请求步骤与失败恢复，最后输出登录系统结构与异步收口规则。

伪代码如下：

```text
programSystemLogin(input) {
    if (isMissingLoginSpec(input)) {
        return buildBlockedResult(input)
    }

    var loginPlan = analyzeLoginSystemScope(input)
    var statePlan = buildLoginStateFlow(loginPlan)
    var requestPlan = buildLoginRequestFlow(loginPlan)
    var recoveryPlan = buildLoginRecoveryFlow(loginPlan)
    var transitionPlan = buildLoginTransitionRules(loginPlan)

    return summarizeLoginSystemResult(loginPlan, statePlan, requestPlan, recoveryPlan, transitionPlan)
}
```

## 强制约束

- 必须明确包含 Input、处理事项、Output 三块核心内容。
- 任务编排必须包含伪代码。
- 必须同时设计登录步骤、状态维护、失败恢复和结果收口。
- 不得把纯 UI 展示或网络底层实现职责混入 LoginSystem skill。
- 若缺少核心登录规则，应先返回阻塞项。

## 成功标准

- 能整理 LoginSystem 的职责边界
- 能给出登录步骤与状态流转的完整结构
- 能覆盖超时、失败重试和账号切换流程
- 能输出可直接落地的登录系统结构建议