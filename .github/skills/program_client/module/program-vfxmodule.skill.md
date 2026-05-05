---
name: program-vfxmodule
description: "用于 VFXModule 编写与调整，适用于特效模板缓存、对象池复用、Spawn/Unspawn 生命周期管理，以及运行期特效 Tick 驱动的设计。"
---

# Program VFXModule Skill

## 目的

该 skill 用于整理和实现 VFXModule 相关结构，重点覆盖特效模板缓存、实例对象池、运行期 Spawn / Unspawn、跟随目标、结束态回收和逐帧 Tick 驱动。

参考实现锚点来自 MoodPuzzle 中的 VFXModule 符号与结构信息，关键模式包括：

- `VFXModuleContext` 聚合 repo、poolService、template 和 poolRoot
- `VFXModuleRepo` 维护全量索引、按 TypeID 索引和临时数组
- `VFXModulePoolService` 管理复用池
- `VFXModuleSM` 持有 `SpriteRenderer`、`Animator`、`ParticleSystem`、belong 信息和结束态
- `VFXModule` 暴露 `Inject`、`InitIE`、`Spawn`、`Unspawn`、`Tick`、`TearDown`

## 适用场景

- 需要新建或重构 `VFXModule`
- 需要设计特效对象池、模板缓存或运行期实例索引
- 需要定义 Spawn / 回收 / 跟随 / 自动销毁规则
- 需要补充逐帧驱动、结束态检查或分组卸载逻辑

在以下情况不要使用本 skill：

- 只修改某个单独的 VFX prefab 或粒子资源
- 只处理美术资源导入或渲染效果参数
- 只做通用 MonoBehaviour 脚本结构整理，但不涉及 VFXModule 职责本身

## 接收的 Input

- VFXModule 的目标路径、类名、命名空间和运行期目录
- 特效模板来源、索引键、类型分组和 `TypeID` 规则
- 对象池规模、复用策略、回收条件和销毁条件
- 跟随对象、belong 标识、层级、排序层和播放结束判定规则
- 初始化流程、逐帧 Tick 频率、批量卸载和清理要求

若缺少模板索引、回收规则或 Spawn 参数约束，则不能可靠给出 VFXModule 实现方案。

## 处理的事项

1. 识别目标是否属于 VFXModule 或同类运行期特效模块。
2. 整理模板缓存、运行期实例索引、对象池和上下文字段。
3. 设计 `Spawn`、`Unspawn`、按 belong 卸载、按类型卸载和 `Tick` 驱动。
4. 设计 `VFXModuleSM` 或等价状态组件需要持有的运行期字段。
5. 约束结束态检测、跟随目标失效、自动回收和统一 `TearDown`。
6. 输出可直接实现的 VFXModule 结构、方法骨架和注意事项。

## 输出的 Output

program-vfxmodule.skill 的 Output 应包含：

- VFXModule 的职责拆分摘要
- 模板缓存、repo、pool 和状态组件的结构建议
- Spawn / Unspawn / Tick / TearDown 的关键方法清单
- 回收策略、结束态检查和 belong 关联规则
- 若信息不足，返回阻塞项与下一步建议

## 任务编排

program-vfxmodule.skill 的任务编排是先确认特效模板与索引方式，再整理池化与状态组件，最后输出运行期接口与回收规则。

伪代码如下：

```text
programVFXModule(input) {
    if (isMissingVFXModuleSpec(input)) {
        return buildBlockedResult(input)
    }

    var vfxPlan = analyzeVFXModuleScope(input)
    var repoPlan = buildVFXRepo(vfxPlan)
    var poolPlan = buildVFXPool(vfxPlan)
    var statePlan = buildVFXStateMachine(vfxPlan)
    var lifecyclePlan = buildVFXLifecycle(vfxPlan)

    return summarizeVFXModuleResult(vfxPlan, repoPlan, poolPlan, statePlan, lifecyclePlan)
}
```

约束说明：

- VFXModule 应聚焦特效实例管理，不承载业务判定逻辑。
- `Spawn` 与 `Unspawn` 需要成对设计，避免只定义生成不定义回收路径。
- 若包含逐帧 `Tick`，必须明确结束态判定、跟随更新和回收时机。
- repo、pool、template 和状态组件的职责边界必须清晰，避免相互混写。

## 实现流程

### 第一步：确认模板与索引

明确特效模板来源、`TypeID` / 分组规则、缓存键和模板加载时机。

### 第二步：确认池化策略

设计对象池容器、复用流程、池根节点和实例初始状态。

### 第三步：确认状态组件字段

整理实例需要持有的 id、belong、跟随开关、销毁策略、渲染组件和播放结束状态。

### 第四步：设计生命周期接口

整理 `Inject`、`InitIE`、`Spawn`、`Unspawn`、`Tick`、`TearDown` 等关键入口。

### 第五步：输出结果

返回 VFXModule 的结构建议、关键方法、回收规则与阻塞项。

## 强制约束

- 必须明确包含 Input、处理事项、Output 三块核心内容。
- 任务编排必须包含伪代码。
- 必须同时设计模板缓存、实例索引、对象池和回收规则。
- 不得把美术资源制作职责混入 VFXModule 结构说明。
- 若缺少模板索引或回收规则，应先返回阻塞项。

## 成功标准

- 能整理 VFXModule 的 repo / pool / template / 状态组件边界
- 能给出 Spawn、Unspawn、Tick、TearDown 的完整生命周期
- 能覆盖跟随目标、结束态检查和回收规则
- 能输出可直接落地的 VFXModule 结构建议