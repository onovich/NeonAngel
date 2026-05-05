---
name: program-assetmodule
description: "用于 AssetModule 编写与调整，适用于资源分批加载、Addressables 标签编排、资源索引缓存与运行期资产访问入口的设计。"
---

# Program AssetModule Skill

## 目的

该 skill 用于整理和实现 AssetModule 相关的程序结构，重点覆盖资源注册、批次加载、缓存索引、加载阶段拆分，以及运行期资产访问入口。

参考实现锚点来自 MoodPuzzle 的 `AssetsModule.cs`，重点模式包括：

- 以多组 Dictionary / List 持有运行期资源索引
- 以 `PartA`、`PartB`、`PartC`、`PartDelay` 分阶段加载 Addressables
- 通过 `LoadLabel`、`LoadKeys` 统一封装异步加载入口
- 对已加载句柄进行缓存，便于后续释放、排查和重复访问控制

## 适用场景

- 需要新建或重构 `AssetsModule`
- 需要梳理资源缓存字段、资源字典和预制体引用
- 需要设计 Addressables 标签分批加载流程
- 需要补充资源索引注册、加载完成回调或阶段完成状态

在以下情况不要使用本 skill：

- 只修改单个 ScriptableObject 资源定义
- 只处理 prefab、shader 或 `.asset` 资源文件生成
- 只做通用 Unity C# 脚本结构整理，但并不涉及 AssetModule 职责本身

## 接收的 Input

- AssetModule 的目标路径、类名、命名空间和运行期目录
- 需要管理的资源类别，例如 panel、stage、skill、good、cabinet、stuff、l10n、ads、audio、vfx
- Addressables 的标签分组、分批加载阶段和完成时机
- 缓存结构、回调队列、释放策略和错误处理要求
- 是否需要兼容特定平台或条件编译分支

若缺少资源类别、加载阶段或标签分组规则，则不能可靠给出 AssetModule 实现方案。

## 处理的事项

1. 识别目标是否属于 AssetModule 或同类资源总入口模块。
2. 整理模块中需要维护的资源字典、列表、prefab 引用和句柄缓存。
3. 设计资源分批加载阶段，例如 PartA、PartB、PartC、PartDelay。
4. 设计 `LoadLabel`、`LoadKeys`、资源遍历注册和加载完成回调模式。
5. 约束错误处理、句柄缓存、重复加载防护和延迟回调队列。
6. 输出可直接实现的 AssetModule 结构、方法骨架和注意事项。

## 输出的 Output

program-assetmodule.skill 的 Output 应包含：

- AssetModule 的职责拆分摘要
- 建议维护的资源缓存字段与索引结构
- 分批加载流程与关键方法清单
- Addressables 句柄管理与错误处理规则
- 若信息不足，返回阻塞项与下一步建议

## 任务编排

program-assetmodule.skill 的任务编排是先确认资源范围与加载阶段，再整理缓存结构与加载骨架，最后输出可落地的模块结果。

伪代码如下：

```text
programAssetModule(input) {
    if (isMissingAssetModuleSpec(input)) {
        return buildBlockedResult(input)
    }

    var assetPlan = analyzeAssetModuleScope(input)
    var cachePlan = buildAssetCaches(assetPlan)
    var loadPlan = buildAddressablesLoadPhases(assetPlan)
    var handlePlan = buildHandleManagement(assetPlan)

    return summarizeAssetModuleResult(assetPlan, cachePlan, loadPlan, handlePlan)
}
```

约束说明：

- AssetModule 应聚焦资源访问与加载编排，不承载具体业务流程。
- Addressables 标签加载必须包含失败分支与状态检查，不能只写成功路径。
- 若模块包含分阶段加载，必须明确每一阶段的完成标记和后续回调时机。
- 句柄缓存和资源索引需要成对设计，避免只缓存资源不管理加载句柄。

## 实现流程

### 第一步：确认资源范围

明确 AssetModule 需要索引哪些资源类型，以及这些资源是列表、字典还是单例 prefab 引用。

### 第二步：确认加载阶段

根据启动流程拆分加载阶段，例如首包资源、运行期资源、延迟资源和条件触发资源。

### 第三步：设计缓存与句柄结构

为资源数据和 Addressables 句柄分别建立字段，并定义键类型与容量预估。

### 第四步：设计加载入口

整理 `LoadLabel`、`LoadKeys`、资源遍历注册、排序与完成回调。

### 第五步：输出结果

返回 AssetModule 的结构建议、关键方法、状态字段与阻塞项。

## 强制约束

- 必须明确包含 Input、处理事项、Output 三块核心内容。
- 任务编排必须包含伪代码。
- 必须把资源缓存结构、加载阶段和句柄管理一起设计。
- 不得把具体资源文件生成职责混入 AssetModule 结构说明。
- 若缺少关键加载阶段或标签分组信息，应先返回阻塞项。

## 成功标准

- 能整理 AssetModule 的缓存结构与加载边界
- 能给出分阶段 Addressables 加载方案
- 能覆盖资源索引、句柄管理和错误处理
- 能输出可直接落地的 AssetModule 结构建议