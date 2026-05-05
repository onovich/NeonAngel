---
name: program-adsmodule
description: "用于 AdsModule 编写与调整，适用于广告配置缓存、Banner/Reward/Interstitial 等广告类型管理、加载展示回调、平台广告实体封装，以及运行期广告状态维护。"
---

# Program AdsModule Skill

## 目的

该 skill 用于整理和实现 AdsModule 相关结构，重点覆盖广告配置缓存、广告资源索引、Banner / Reward / Interstitial 等广告类型管理、平台广告实体封装、加载展示回调，以及运行期广告播放状态维护。

参考锚点来自 MoodPuzzle 的 `AdsManager.cs`、`AdsAssets.cs`、`AdsSO.cs` 和平台广告接入面，关键模式包括：

- `AdsSO` 维护 `typeID`、`AdsType`、`adUnitID`
- `AdsAssets` 负责把 `AdsSO` 建成 `Dictionary<TypeID, AdsSO>`
- `AdsManager` 负责 `AddAll`、`TearDown`、`Banner_Show`、`Banner_Hide`、`Reward_Play`
- 运行期以 `AdsRepository` 持有平台广告实体，并按 `TypeID` 复用
- 平台广告对象具备 `OnLoad`、`OnError`、`Show`、`Hide`、`Destroy`、`Close` 等生命周期

## 适用场景

- 需要新建或重构 `AdsModule` / `AdsManager`
- 需要设计广告配置缓存、广告位索引和广告实体仓储
- 需要补充 Banner、Reward、Interstitial 等广告类型的加载与展示流程
- 需要统一平台广告回调、失败处理、播放状态与清理逻辑

在以下情况不要使用本 skill：

- 只修改某个广告位 ID 或广告文案配置
- 只调整单次业务广告触发时机，而不涉及 AdsModule 结构
- 只处理平台 SDK 接入细节，但不整理广告模块本身的职责边界

## 接收的 Input

- AdsModule 的目标路径、类名、命名空间和运行期目录
- 广告配置资源结构、`TypeID` 规则、广告类型和广告位 ID
- 需要支持的广告类型，例如 Banner、RewardVideo、Interstitial
- 平台适配要求、广告加载展示回调、错误码处理和关闭事件
- 播放状态、冷却限制、并发策略、复用策略和清理要求

若缺少广告类型、广告配置键或平台回调规则，则不能可靠给出 AdsModule 实现方案。

## 处理的事项

1. 识别目标是否属于 AdsModule 或同类运行期广告管理模块。
2. 整理广告配置资源、按 `TypeID` 缓存和广告实体仓储结构。
3. 设计 Banner、Reward、Interstitial 等广告类型的加载、展示、隐藏和销毁流程。
4. 设计广告回调、失败类型、播放状态和平台差异处理。
5. 约束广告实例复用、冷却时间、超时等待和统一 `TearDown`。
6. 输出可直接实现的 AdsModule 结构、方法骨架和注意事项。

## 输出的 Output

program-adsmodule.skill 的 Output 应包含：

- AdsModule 的职责拆分摘要
- 广告配置缓存、仓储与实体结构建议
- 加载、展示、隐藏、关闭、销毁的关键方法清单
- 平台广告回调、失败处理和播放状态规则
- 若信息不足，返回阻塞项与下一步建议

## 任务编排

program-adsmodule.skill 的任务编排是先确认广告类型与配置结构，再整理广告实体与仓储，最后输出展示流程与平台回调规则。

伪代码如下：

```text
programAdsModule(input) {
    if (isMissingAdsModuleSpec(input)) {
        return buildBlockedResult(input)
    }

    var adsPlan = analyzeAdsModuleScope(input)
    var configPlan = buildAdsConfigCache(adsPlan)
    var repoPlan = buildAdsRepository(adsPlan)
    var displayPlan = buildAdsDisplayFlows(adsPlan)
    var platformPlan = buildAdsPlatformRules(adsPlan)

    return summarizeAdsModuleResult(adsPlan, configPlan, repoPlan, displayPlan, platformPlan)
}
```

约束说明：

- AdsModule 应聚焦广告资源与展示控制，不承载业务奖励发放逻辑。
- 广告配置缓存、广告实体仓储和平台广告对象职责必须分层，避免混写。
- 广告展示流程必须覆盖加载成功、加载失败、关闭回调和清理路径。
- 平台冷却时间、展示限制和实例失效规则必须纳入实现约束。

## 实现流程

### 第一步：确认广告配置与类型

明确广告资源配置结构、`TypeID` 键、广告类型和广告位 ID 规则。

### 第二步：确认仓储与实体

设计广告配置缓存、运行期广告实体仓储和按类型复用策略。

### 第三步：确认展示流程

整理 Banner、Reward、Interstitial 的加载、展示、隐藏、销毁和关闭回调流程。

### 第四步：确认平台约束

整理微信小游戏、字节或其他平台的广告创建 API、加载限制、冷却和失败处理。

### 第五步：输出结果

返回 AdsModule 的结构建议、关键方法、平台规则与阻塞项。

## 强制约束

- 必须明确包含 Input、处理事项、Output 三块核心内容。
- 任务编排必须包含伪代码。
- 必须同时设计广告配置缓存、广告实体仓储、展示流程和平台回调。
- 不得把奖励结算或业务事件处理职责混入 AdsModule 结构说明。
- 若缺少广告类型、平台限制或失败处理规则，应先返回阻塞项。

## 成功标准

- 能整理 AdsModule 的配置缓存、仓储和实体边界
- 能给出 Banner、Reward、Interstitial 的完整展示控制面
- 能覆盖平台回调、失败处理、冷却限制和清理规则
- 能输出可直接落地的 AdsModule 结构建议