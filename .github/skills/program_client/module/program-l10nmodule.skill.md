---
name: program-l10nmodule
description: "用于 L10NModule 编写与调整，适用于多语言词条仓储、语言切换、资源 fallback、EntityTypeID 索引，以及运行期本地化查询接口的设计。"
---

# Program L10NModule Skill

## 目的

该 skill 用于整理和实现 L10NModule 相关结构，重点覆盖多语言词条仓储、语言切换、按语言索引、按 `EntityTypeID` 查询、英文 fallback，以及文本/图片/音频/prefab 的本地化访问。

参考锚点来自 MoodPuzzle 的 `L10NModule.md`，关键模式包括：

- `L10NSO` 作为词条资源，内部维护多语言内容数组
- 以 `Dictionary<SystemLanguage, L10NEntity>` 按语言持有顶层仓储
- 以 `Dictionary<EntityTypeID, L10NOneLangTC>` 按词条键查询当前语言数据
- 暴露 `AddAll`、`Language_Set`、`TryGet(L10NSO, out ...)`、`TryGet(EntityTypeID, out ...)`
- 查询失败时自动 fallback 到英文

## 适用场景

- 需要新建或重构 `L10NModule` / `L10NManager`
- 需要设计多语言词条仓储、语言切换与 fallback
- 需要补充按词条 ID 查询、批量载入或 Addressables 接入
- 需要统一文字、图片、音频、prefab 的本地化访问方式

在以下情况不要使用本 skill：

- 只修改单个本地化资源词条内容
- 只做翻译文本编辑，不涉及 L10NModule 结构
- 只处理 UI 文本显示逻辑，而不涉及本地化仓储模块本身

## 接收的 Input

- L10NModule 的目标路径、类名、命名空间和运行期目录
- 词条资源结构、`EntityTypeID` 规则、语言集合和 fallback 语言
- 需要支持的资源类型，例如文本、图片、音频、prefab
- 批量载入方式、Addressables 分组和运行期初始化时机
- 查询接口、默认语言检测和平台语言映射规则

若缺少词条键规则、语言集合或 fallback 约束，则不能可靠给出 L10NModule 实现方案。

## 处理的事项

1. 识别目标是否属于 L10NModule 或同类本地化仓储模块。
2. 整理词条资源结构、按语言仓储和按 `EntityTypeID` 索引结构。
3. 设计批量载入、语言切换和查询接口。
4. 设计默认语言检测、平台语言映射和英文 fallback 规则。
5. 约束文本、图片、音频、prefab 等多种资源类型的访问方式。
6. 输出可直接实现的 L10NModule 结构、方法骨架和注意事项。

## 输出的 Output

program-l10nmodule.skill 的 Output 应包含：

- L10NModule 的职责拆分摘要
- 词条资源、仓储与索引结构建议
- 载入、切换语言、查询和 fallback 的关键方法清单
- 平台语言映射与多资源类型访问规则
- 若信息不足，返回阻塞项与下一步建议

## 任务编排

program-l10nmodule.skill 的任务编排是先确认词条结构与语言集合，再整理仓储与查询接口，最后输出语言切换与 fallback 规则。

伪代码如下：

```text
programL10NModule(input) {
    if (isMissingL10NModuleSpec(input)) {
        return buildBlockedResult(input)
    }

    var l10nPlan = analyzeL10NModuleScope(input)
    var entryPlan = buildL10NEntries(l10nPlan)
    var repoPlan = buildL10NRepository(l10nPlan)
    var queryPlan = buildL10NQueries(l10nPlan)
    var languagePlan = buildLanguageFallbackRules(l10nPlan)

    return summarizeL10NModuleResult(l10nPlan, entryPlan, repoPlan, queryPlan, languagePlan)
}
```

约束说明：

- L10NModule 应聚焦本地化数据仓储与查询，不承载 UI 展示逻辑。
- 语言切换、查询和 fallback 必须成组设计，避免只定义语言字段不定义查询行为。
- `EntityTypeID` 与词条资源结构需要保持稳定映射，避免运行期查询键不一致。
- 多资源类型访问应复用统一词条结构，而不是为每种资源拆成无关仓储。

## 实现流程

### 第一步：确认词条与语言结构

明确 `L10NSO` 或等价词条资源的字段结构、语言集合与资源类型。

### 第二步：确认仓储与索引

设计按语言分仓、按 `EntityTypeID` 查询的索引结构，以及批量加载入口。

### 第三步：确认切换与 fallback

整理当前语言设置、平台语言映射、英文 fallback 与查询失败处理。

### 第四步：确认访问接口

设计按资源对象或按 `EntityTypeID` 查询的接口，以及资源下标访问约定。

### 第五步：输出结果

返回 L10NModule 的结构建议、关键方法、语言规则与阻塞项。

## 强制约束

- 必须明确包含 Input、处理事项、Output 三块核心内容。
- 任务编排必须包含伪代码。
- 必须同时设计词条结构、仓储索引、查询接口和 fallback 规则。
- 不得把翻译内容生产职责混入 L10NModule 结构说明。
- 若缺少词条键规则、语言集合或 fallback 规则，应先返回阻塞项。

## 成功标准

- 能整理 L10NModule 的词条、仓储和索引边界
- 能给出 AddAll、Language_Set、TryGet 等完整接口面
- 能覆盖平台语言映射、英文 fallback 和多资源类型访问规则
- 能输出可直接落地的 L10NModule 结构建议