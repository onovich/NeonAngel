---
name: program-ui
description: "用于 UI 部分代码编写与结构整理，适用于 Panel/Controller 类设计、节点引用组织、显示隐藏逻辑、按钮交互绑定与 UI 状态切换。"
---

# Program UI Skill

## 目的

该 skill 用于整理和实现 UI 相关代码结构，重点覆盖 Panel、Controller、节点引用、显示隐藏逻辑与交互事件绑定。

目标是产出结构清晰、可直接落地的 UI 代码方案，而不是停留在零散的组件调用。常见模式包括：面板类命名、`RectTransform` / `CanvasGroup` 引用、按钮事件绑定、`Open` / `Close` / `Show` / `Hide` 状态切换，以及界面初始化与回收边界。

## 适用场景

- 需要新建或重构 UI Panel、UI Controller
- 需要整理 UI 节点引用和界面层级对应关系
- 需要设计显示隐藏、打开关闭、交互事件绑定或状态切换逻辑
- 需要补充 UI 生命周期，例如初始化、注册事件、释放事件和销毁

在以下情况不要使用本 skill：

- 只修改 UI prefab / `.prefab.meta` 资源
- 只处理动画、Animator、Shader 或纯美术资源
- 只处理 ScriptableObject 或项目级配置
- 只处理通用 C# 模块，而不涉及 UI 结构本身

## 接收的 Input

- UI 类的目标路径、类名、命名空间和运行期目录
- UI 类型，例如 Panel、Controller、Popup、Widget
- 节点引用清单、按钮或事件源、数据输入与状态字段
- 显示隐藏方式、动画占位、生命周期入口和销毁要求
- 是否需要支持 `Open` / `Close` / `Show` / `Hide`、交互节流、数据刷新和事件解绑

若缺少 UI 类型、节点引用范围、状态切换需求或生命周期要求，则不能可靠给出 UI 代码实现方案。

## 处理的事项

1. 识别目标是否属于 UI Panel、UI Controller 或同类界面代码入口。
2. 整理 UI 节点引用、状态字段、显示隐藏方法和交互事件绑定。
3. 设计 `Ctor` / `Init` / `Bind` / `Refresh` / `Open` / `Close` / `Show` / `Hide` / `TearDown` 的职责边界。
4. 设计 `RectTransform`、`CanvasGroup`、`Button`、`ScrollRect`、文本组件等常见 UI 对象的持有和更新方式。
5. 约束初始化、事件注册、事件解绑、数据刷新和资源回收的顺序。
6. 输出可直接实现的 UI 结构、方法骨架和注意事项。

## 输出的 Output

program-ui.skill 的 Output 应包含：

- UI 类的职责拆分摘要
- 节点引用、状态字段和关键方法建议
- 显示隐藏、交互绑定和数据刷新规则
- 生命周期顺序与清理要求
- 若信息不足，返回阻塞项与下一步建议

## 任务编排

program-ui.skill 的任务编排是先确认 UI 类型与节点结构，再整理交互与状态切换，最后输出生命周期与方法边界。

伪代码如下：

```text
programUiSkill(input) {
    if (isMissingUiSpec(input)) {
        return buildBlockedResult(input)
    }

    var uiPlan = analyzeUiScope(input)
    var refPlan = buildUiReferences(uiPlan)
    var statePlan = buildUiStates(uiPlan)
    var eventPlan = buildUiEventFlow(uiPlan)
    var lifecyclePlan = buildUiLifecycle(uiPlan)

    return summarizeUiResult(uiPlan, refPlan, statePlan, eventPlan, lifecyclePlan)
}
```

约束说明：

- UI 代码应聚焦界面展示与交互组织，不承载无关业务逻辑。
- 节点引用、事件注册和事件解绑必须成对设计，避免只绑定不释放。
- 显示隐藏方法与状态字段应保持一致，避免只有方法名没有状态来源。
- skill 正文不得描述由谁调用自己，也不得把特定 agent 写入自身职责定义。

## 实现流程

### 第一步：确认 UI 类型与职责

明确目标是 Panel、Controller、Popup、Widget 或其他界面入口，并确认它负责的显示、交互和刷新范围。

### 第二步：确认节点引用与状态字段

整理 `RectTransform`、`CanvasGroup`、按钮、文本、滚动区域和其他节点引用，以及需要维护的状态字段。

### 第三步：确认交互与显示隐藏流程

设计按钮点击、事件订阅、打开关闭、显示隐藏、状态刷新和动画占位的接口边界。

### 第四步：确认生命周期

整理初始化、绑定、刷新、打开、关闭、隐藏、销毁和解绑的顺序要求。

### 第五步：输出结果

返回 UI 结构建议、关键方法、生命周期规则与阻塞项。

## 强制约束

- 必须明确包含 Input、处理事项、Output 三块核心内容。
- 任务编排必须包含伪代码。
- 必须同时设计节点引用、交互绑定、显示隐藏和生命周期清理。
- 不得把 prefab / meta 资源生成职责混入 UI 代码 skill。
- 若缺少 UI 类型、节点结构或生命周期要求，应先返回阻塞项。

## 成功标准

- 能整理 UI Panel/View/Controller 的职责边界
- 能给出节点引用、显示隐藏和交互绑定的完整结构
- 能覆盖初始化、刷新、打开关闭和销毁解绑规则
- 能输出可直接落地的 UI 代码结构建议