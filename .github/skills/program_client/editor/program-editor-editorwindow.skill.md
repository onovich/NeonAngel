---
name: program-editor-editorwindow
description: "用于实现 Unity EditorWindow，适用于工具面板、配置面板、图形化编辑窗口、滚动区域与编辑器生命周期组织。"
---

# Program Editor EditorWindow Skill

## 目的

该 skill 用于整理和实现 EditorWindow 相关结构，重点覆盖窗口入口、生命周期、GUI 组织、滚动区域、工具状态与编辑器交互流程。

目标是产出结构清晰、可直接落地的 EditorWindow 方案，而不是零散拼接 OnGUI 逻辑。

## 适用场景

- 需要新建或重构 EditorWindow 工具面板
- 需要整理配置面板、数据编辑面板或图形化编辑窗口
- 需要设计窗口入口、标题、尺寸、状态恢复和生命周期
- 需要把多个编辑器功能收口到统一面板

在以下情况不要使用本 skill：

- 只实现 ContextMenu 命令
- 只实现 Toolbar 顶栏扩展
- 只实现运行期 UI Panel

## 接收的 Input

- 窗口类型、类名、目标路径和命名空间
- 窗口用途、入口菜单、标题、尺寸和布局约束
- GUI 结构、滚动区域、选择状态、工具状态和刷新时机
- 依赖对象、编辑器回调、数据源和输出动作

若缺少窗口用途、入口菜单或核心 GUI 流程，则不能可靠给出 EditorWindow 实现方案。

## 处理的事项

1. 识别目标是否属于 EditorWindow 或同类编辑器面板。
2. 整理窗口入口、标题、尺寸、生命周期和 GUI 结构。
3. 设计菜单打开方式、窗口状态、刷新时机和数据绑定方式。
4. 设计滚动区域、操作区、保存入口和错误提示行为。
5. 输出可直接实现的 EditorWindow 结构、方法骨架和注意事项。

## 输出的 Output

program-editor-editorwindow.skill 的 Output 应包含：

- EditorWindow 的职责拆分摘要
- 窗口入口、生命周期和 GUI 组织建议
- 状态恢复、刷新和保存流程规则
- 关键方法边界与注意事项
- 若信息不足，返回阻塞项与下一步建议

## 任务编排

program-editor-editorwindow.skill 的任务编排是先确认窗口用途与入口，再整理 GUI 与生命周期流程，最后输出 EditorWindow 结构与状态管理方案。

伪代码如下：

```text
programEditorWindow(input) {
    if (isMissingEditorWindowSpec(input)) {
        return buildBlockedResult(input)
    }

    var windowPlan = analyzeEditorWindowScope(input)
    var lifecyclePlan = buildEditorWindowLifecycle(windowPlan)
    var guiPlan = buildEditorWindowGui(windowPlan)
    var statePlan = buildEditorWindowState(windowPlan)

    return summarizeEditorWindowResult(windowPlan, lifecyclePlan, guiPlan, statePlan)
}
```

## 强制约束

- 必须明确包含 Input、处理事项、Output 三块核心内容。
- 任务编排必须包含伪代码。
- 必须同时设计窗口入口、GUI 结构和生命周期。
- 不得把 Toolbar、ContextMenu 或运行期 UI 逻辑职责混入本 skill。
- 若缺少核心窗口行为，应先返回阻塞项。

## 成功标准

- 能整理 EditorWindow 的职责边界
- 能给出窗口入口与 GUI 结构的清晰方案
- 能覆盖生命周期、刷新和保存流程
- 能输出可直接落地的 EditorWindow 结构建议
