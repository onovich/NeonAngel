---
name: program-inputmodule
description: "用于 InputModule 编写与调整，适用于输入动作初始化、运行期输入状态维护、按键重绑、绑定序列化，以及逐帧输入处理逻辑的设计。"
---

# Program InputModule Skill

## 目的

该 skill 用于整理和实现 InputModule 相关结构，重点覆盖输入动作创建与启用、逐帧输入状态读取、鼠标/指针状态维护、重绑句柄管理，以及输入绑定的保存与恢复。

参考实现锚点来自 MoodPuzzle 的 `InputModule.cs`，关键模式包括：

- `Ctor` 中创建并启用 `NJInputActions`
- 持有 `RebindingOperation` 句柄并在 `TearDown` 中释放
- 在 `Process(float dt)` 中逐帧读取 `Pointer.current` 和鼠标按压状态
- 维护 `MouseStatus`、`MouseScreenPosition`、`IsDragging`
- 通过 `ToJson` / `FromJson` 保存与恢复 binding overrides

## 适用场景

- 需要新建或重构 `InputModule`
- 需要设计输入动作初始化与逐帧输入处理
- 需要补充按键重绑、默认绑定恢复或绑定序列化
- 需要维护鼠标、触控或其他指针状态

在以下情况不要使用本 skill：

- 只修改某个具体输入事件绑定值
- 只调整业务层输入响应逻辑，而不涉及 InputModule 结构
- 只做通用 Unity 脚本整理，但不涉及输入模块职责本身

## 接收的 Input

- InputModule 的目标路径、类名、命名空间和运行期目录
- 使用的输入系统方案、输入动作类、设备类型和状态字段
- 需要支持的输入类别，例如鼠标、触控、键盘、手柄
- 是否需要支持按键重绑、默认恢复、绑定保存和加载
- 输入状态的消费方式、逐帧处理要求和异常恢复要求

若缺少输入设备范围、动作定义或序列化需求，则不能可靠给出 InputModule 实现方案。

## 处理的事项

1. 识别目标是否属于 InputModule 或同类输入总入口模块。
2. 整理输入动作实例、设备状态字段和逐帧输入读取逻辑。
3. 设计重绑句柄生命周期、默认绑定恢复和绑定序列化接口。
4. 设计鼠标、触控或其他指针状态的维护方式。
5. 约束 `Ctor`、`Init`、`Process`、`Reset`、`TearDown` 的职责边界。
6. 输出可直接实现的 InputModule 结构、方法骨架和注意事项。

## 输出的 Output

program-inputmodule.skill 的 Output 应包含：

- InputModule 的职责拆分摘要
- 输入动作实例、状态字段和处理方法建议
- 重绑、默认恢复、保存与加载接口清单
- 逐帧状态更新与异常恢复规则
- 若信息不足，返回阻塞项与下一步建议

## 任务编排

program-inputmodule.skill 的任务编排是先确认输入设备与动作定义，再整理状态字段与重绑流程，最后输出逐帧处理与序列化接口。

伪代码如下：

```text
programInputModule(input) {
    if (isMissingInputModuleSpec(input)) {
        return buildBlockedResult(input)
    }

    var inputPlan = analyzeInputModuleScope(input)
    var actionPlan = buildInputActions(inputPlan)
    var statePlan = buildInputStates(inputPlan)
    var rebindingPlan = buildRebindingFlow(inputPlan)
    var persistencePlan = buildBindingPersistence(inputPlan)

    return summarizeInputModuleResult(inputPlan, actionPlan, statePlan, rebindingPlan, persistencePlan)
}
```

约束说明：

- InputModule 应聚焦输入状态采集与绑定管理，不承载业务响应逻辑。
- 输入动作实例的创建、启用、释放必须成对设计，避免只初始化不清理。
- 若支持重绑，必须明确重绑句柄的开始、取消、完成和释放时机。
- 输入状态字段与逐帧 `Process` 逻辑应一致，避免状态只声明不更新。

## 实现流程

### 第一步：确认输入设备与动作

明确使用的输入系统、动作类、设备类型以及需要维护的核心状态。

### 第二步：确认状态字段

整理鼠标、触控、键盘或手柄状态字段，以及是否需要拖拽、长按、首次按下等派生状态。

### 第三步：确认重绑与恢复流程

设计默认绑定恢复、重绑句柄释放、保存与加载 binding overrides 的接口。

### 第四步：确认逐帧处理

整理 `Process(float dt)` 或等价入口中的状态读取、判定和重置规则。

### 第五步：输出结果

返回 InputModule 的结构建议、关键方法、状态规则与阻塞项。

## 强制约束

- 必须明确包含 Input、处理事项、Output 三块核心内容。
- 任务编排必须包含伪代码。
- 必须同时设计输入动作生命周期、状态更新和绑定持久化。
- 不得把业务事件响应职责混入 InputModule 结构说明。
- 若缺少输入动作定义或持久化需求，应先返回阻塞项。

## 成功标准

- 能整理 InputModule 的动作实例与状态字段边界
- 能给出 Ctor、Init、Process、Reset、TearDown 的完整职责划分
- 能覆盖重绑、默认恢复和绑定序列化规则
- 能输出可直接落地的 InputModule 结构建议