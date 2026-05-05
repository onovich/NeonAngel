---
name: program-editor-toolbar
description: "用于实现 Unity Editor Toolbar 扩展，适用于顶栏按钮、状态切换、快捷入口、上下文联动和编辑器全局操作收口。"
---

# Program Editor Toolbar Skill

## 目的

该 skill 用于整理和实现 Unity Editor Toolbar 扩展相关结构，重点覆盖顶栏按钮、状态切换、快捷入口、全局操作和上下文联动。

目标是产出结构清晰、可直接落地的 Toolbar 扩展方案，而不是散落在多个编辑器脚本中的全局入口。

## 适用场景

- 需要新建或重构 Unity Editor Toolbar 扩展
- 需要提供全局快捷按钮、状态开关或工具入口
- 需要将多个编辑器期动作汇总到顶栏
- 需要整理编辑器全局状态与工具联动

在以下情况不要使用本 skill：

- 只实现 EditorWindow 主体界面
- 只实现 ContextMenu 命令
- 只实现运行期系统按钮逻辑

## 接收的 Input

- Toolbar 扩展目标、按钮集合、状态字段和入口位置
- 需要联动的窗口、菜单、工具模块或选择上下文
- 点击行为、启用条件、显示条件和日志反馈方式
- 是否需要全局刷新、状态缓存或延迟回调

若缺少按钮目标、入口位置或核心联动行为，则不能可靠给出 Toolbar 实现方案。

## 处理的事项

1. 识别目标是否属于 Toolbar 或同类编辑器顶栏扩展。
2. 整理按钮职责、状态切换、联动对象和显示条件。
3. 设计按钮渲染、点击行为、启用条件和全局刷新时机。
4. 设计状态缓存、上下文联动和错误提示方式。
5. 输出可直接实现的 Toolbar 结构、方法骨架和注意事项。

## 输出的 Output

program-editor-toolbar.skill 的 Output 应包含：

- Toolbar 扩展的职责拆分摘要
- 按钮入口、状态切换和联动规则建议
- 刷新、缓存和全局行为约束
- 关键方法边界与注意事项
- 若信息不足，返回阻塞项与下一步建议

## 任务编排

program-editor-toolbar.skill 的任务编排是先确认顶栏入口与按钮目标，再整理状态与联动流程，最后输出 Toolbar 扩展结构与全局刷新方案。

伪代码如下：

```text
programEditorToolbar(input) {
    if (isMissingToolbarSpec(input)) {
        return buildBlockedResult(input)
    }

    var toolbarPlan = analyzeToolbarScope(input)
    var buttonPlan = buildToolbarButtons(toolbarPlan)
    var statePlan = buildToolbarStateFlow(toolbarPlan)
    var integrationPlan = buildToolbarIntegration(toolbarPlan)

    return summarizeToolbarResult(toolbarPlan, buttonPlan, statePlan, integrationPlan)
}
```

## 强制约束

- 必须明确包含 Input、处理事项、Output 三块核心内容。
- 任务编排必须包含伪代码。
- 必须同时设计按钮入口、状态切换和联动行为。
- 不得把 EditorWindow 主体、ContextMenu 或运行期 UI 职责混入本 skill。
- 若缺少核心 Toolbar 行为，应先返回阻塞项。

## 成功标准

- 能整理 Toolbar 扩展的职责边界
- 能给出按钮入口与状态切换的清晰结构
- 能覆盖联动、刷新和缓存流程
- 能输出可直接落地的 Toolbar 扩展结构建议
