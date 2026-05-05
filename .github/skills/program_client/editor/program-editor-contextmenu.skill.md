---
name: program-editor-contextmenu
description: "用于实现 Unity Editor ContextMenu，适用于 Assets、Hierarchy、Inspector 等菜单入口、校验逻辑、菜单分组和批处理操作。"
---

# Program Editor ContextMenu Skill

## 目的

该 skill 用于整理和实现 Unity Editor 的 ContextMenu 相关结构，重点覆盖 Assets、Hierarchy、Inspector 等入口下的菜单命令、验证逻辑和批处理行为。

目标是产出结构清晰、可直接落地的菜单扩展方案，而不是只零散添加单个 MenuItem。

## 适用场景

- 需要新建或重构 Assets 右键菜单
- 需要新建或重构 Hierarchy / GameObject 菜单
- 需要整理 Inspector 上下文菜单或辅助编辑命令
- 需要设计菜单验证、批量处理和日志输出规则

在以下情况不要使用本 skill：

- 只实现 EditorWindow 主界面
- 只实现 Toolbar 顶栏扩展
- 只实现运行期 UI 交互

## 接收的 Input

- 菜单入口类型、菜单路径、优先级和目标路径
- 目标对象类型、选择规则、校验条件和批处理范围
- 需要执行的编辑器动作、日志格式和错误处理方式
- 是否需要拆分校验方法、执行方法和辅助工具方法

若缺少菜单路径、目标对象类型或核心处理动作，则不能可靠给出 ContextMenu 实现方案。

## 处理的事项

1. 识别目标是否属于 Assets、Hierarchy、Inspector 或同类 ContextMenu 扩展。
2. 整理菜单入口、校验逻辑、执行逻辑和批处理边界。
3. 设计 MenuItem 路径、优先级、验证函数和错误提示。
4. 设计选择对象遍历、批处理流程、日志与刷新行为。
5. 输出可直接实现的 ContextMenu 结构、方法骨架和注意事项。

## 输出的 Output

program-editor-contextmenu.skill 的 Output 应包含：

- ContextMenu 的入口拆分摘要
- 菜单路径、校验规则和执行流程建议
- 批处理、日志与刷新行为约束
- 关键方法边界与注意事项
- 若信息不足，返回阻塞项与下一步建议

## 任务编排

program-editor-contextmenu.skill 的任务编排是先确认菜单入口与对象范围，再整理校验与执行流程，最后输出菜单扩展结构与批处理规则。

伪代码如下：

```text
programEditorContextMenu(input) {
    if (isMissingContextMenuSpec(input)) {
        return buildBlockedResult(input)
    }

    var menuPlan = analyzeContextMenuScope(input)
    var validationPlan = buildMenuValidation(menuPlan)
    var executionPlan = buildMenuExecution(menuPlan)
    var batchPlan = buildMenuBatchFlow(menuPlan)

    return summarizeContextMenuResult(menuPlan, validationPlan, executionPlan, batchPlan)
}
```

## 强制约束

- 必须明确包含 Input、处理事项、Output 三块核心内容。
- 任务编排必须包含伪代码。
- 必须同时设计菜单路径、校验逻辑和执行逻辑。
- 不得把 EditorWindow、Toolbar 或运行期逻辑职责混入本 skill。
- 若缺少核心菜单行为，应先返回阻塞项。

## 成功标准

- 能整理 ContextMenu 的职责边界
- 能给出菜单路径与校验规则的清晰结构
- 能覆盖批处理、日志和刷新流程
- 能输出可直接落地的 ContextMenu 结构建议
