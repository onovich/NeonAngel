---
name: program-editor-entity
description: "用于根据 Entity 与 ScriptableObject 实现对应的 EditorEntity(EM)，适用于字段映射、保存入口、编辑器态校验、命名同步和工具化编辑流程。"
---

# Program Editor Entity Skill

## 目的

该 skill 用于整理和实现 EditorEntity(EM) 相关结构，重点覆盖根据 Entity 与 ScriptableObject 建立编辑器态映射、编辑器交互入口、保存流程和校验逻辑。

目标是产出结构清晰、可直接落地的 EditorEntity(EM) 方案，而不是只停留在零散 Inspector 字段补丁。

## 适用场景

- 需要根据已有 Entity 与 ScriptableObject 新建 EditorEntity(EM)
- 需要重构已有 EM 的字段同步、保存入口或命名规则
- 需要整理编辑器态数据与运行期数据之间的映射关系
- 需要为关卡、配置、生成点或工具对象补充编辑器态辅助组件

在以下情况不要使用本 skill：

- 只创建运行期 Entity 本体
- 只创建 ScriptableObject 资源文件
- 只实现通用 EditorWindow、Toolbar 或菜单入口

## 接收的 Input

- 对应 Entity 类型、ScriptableObject 类型、目标路径和命名空间
- 需要暴露的字段、双向同步规则、保存入口和命名规则
- 编辑器期按钮、ContextMenu、校验逻辑和 Gizmos / 可视化需求
- 运行期与编辑器期的边界，以及哪些数据应回写到 Entity 或 SO

若缺少对应 Entity / SO、字段映射或保存规则，则不能可靠给出 EditorEntity(EM) 实现方案。

## 处理的事项

1. 识别目标是否属于 EditorEntity(EM) 或同类编辑器态实体组件。
2. 整理 Entity、ScriptableObject 与 EditorEntity(EM) 之间的职责边界。
3. 设计字段映射、保存入口、命名同步和编辑器按钮行为。
4. 设计编辑器态校验、回写流程和必要的可视化辅助。
5. 输出可直接实现的 EditorEntity(EM) 结构、方法骨架和注意事项。

## 输出的 Output

program-editor-entity.skill 的 Output 应包含：

- EditorEntity(EM) 的职责拆分摘要
- Entity / SO / EM 的字段映射与回写规则
- 保存入口、命名同步和校验流程建议
- 关键方法、按钮入口与辅助可视化边界
- 若信息不足，返回阻塞项与下一步建议

## 任务编排

program-editor-entity.skill 的任务编排是先确认 Entity 与 SO 的映射关系，再整理保存与校验流程，最后输出 EditorEntity(EM) 结构与编辑器交互入口。

伪代码如下：

```text
programEditorEntity(input) {
    if (isMissingEditorEntitySpec(input)) {
        return buildBlockedResult(input)
    }

    var entityPlan = analyzeEditorEntityScope(input)
    var mappingPlan = buildEntitySoMapping(entityPlan)
    var savePlan = buildEditorSaveFlow(entityPlan)
    var validationPlan = buildEditorValidationFlow(entityPlan)
    var visualizationPlan = buildEditorVisualizationPlan(entityPlan)

    return summarizeEditorEntityResult(entityPlan, mappingPlan, savePlan, validationPlan, visualizationPlan)
}
```

## 强制约束

- 必须明确包含 Input、处理事项、Output 三块核心内容。
- 任务编排必须包含伪代码。
- 必须同时设计字段映射、保存入口和编辑器态校验。
- 不得把运行期 Entity 本体或 ScriptableObject 资源创建职责混入本 skill。
- 若缺少核心映射规则，应先返回阻塞项。

## 成功标准

- 能整理 EditorEntity(EM) 的职责边界
- 能给出 Entity / SO / EM 的映射与回写结构
- 能覆盖保存、命名同步和编辑器态校验流程
- 能输出可直接落地的 EditorEntity(EM) 结构建议
