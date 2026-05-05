---
name: networkclientmodule
description: "用于 NetworkClientModule 编写与调整，适用于跨平台客户端连接封装、消息发送接收、心跳超时、自动重连、缓冲区管理，以及运行期连接状态维护。"
---

# NetworkClientModule Skill

## 目的

该 skill 用于整理和实现 NetworkClientModule 相关结构，重点覆盖跨平台客户端选择、连接状态维护、消息发送与接收、心跳超时检测、自动重连、缓冲区扩容，以及运行期网络回调分发。

参考锚点来自 MoodPuzzle 的 `NetworkModule.cs` 与 Network Module 说明，关键模式包括：

- 基于 `INetworkClient` 抽象封装 `TelepathyNetClient` / `WXNetClient`
- 暴露 `Connect`、`Disconnect`、`Send`、`SendMessage`、`Tick`
- 持有 `sendBuffer`、`recvBuffer`、最近连接端点、状态机和心跳时间戳
- 通过 `OnConnected`、`OnData`、`OnDisconnected`、`OnStateChanged` 向上层抛出结果
- 在 `Tick` 中处理心跳超时与自动重连

## 适用场景

- 需要新建或重构 `NetworkClientModule`
- 需要封装跨平台客户端接入与运行期连接状态
- 需要补充消息收发、缓冲区管理、心跳检测或自动重连
- 需要统一客户端网络事件与状态切换规则

在以下情况不要使用本 skill：

- 只修改单个业务消息体或协议字段
- 只处理服务端网络模块，而不是客户端连接模块
- 只做高层业务流程设计，但不涉及 NetworkClientModule 结构本身

## 接收的 Input

- NetworkClientModule 的目标路径、类名、命名空间和运行期目录
- 目标平台、客户端实现、传输层封装和条件编译要求
- 连接状态、重连间隔、心跳超时、端口约束和断线策略
- 消息发送格式、缓冲区大小、加解密规则和数据回调要求
- 生命周期入口、状态事件和上层消费方式

若缺少平台约束、连接状态规则或消息收发边界，则不能可靠给出 NetworkClientModule 实现方案。

## 处理的事项

1. 识别目标是否属于 NetworkClientModule 或同类客户端网络模块。
2. 整理客户端抽象、平台实现、连接状态和回调事件。
3. 设计消息发送、接收、缓冲区扩容和数据校验流程。
4. 设计心跳超时、断线处理、自动重连和状态切换逻辑。
5. 约束加解密、端口限制、主线程驱动和异常恢复。
6. 输出可直接实现的 NetworkClientModule 结构、方法骨架和注意事项。

## 输出的 Output

networkclientmodule.skill 的 Output 应包含：

- NetworkClientModule 的职责拆分摘要
- 客户端抽象、状态字段和事件接口建议
- 连接、发送、接收、重连、心跳的关键方法清单
- 缓冲区、加解密、平台限制与异常恢复规则
- 若信息不足，返回阻塞项与下一步建议

## 任务编排

networkclientmodule.skill 的任务编排是先确认平台与连接规则，再整理消息收发与状态机，最后输出运行期接口与重连约束。

伪代码如下：

```text
networkClientModule(input) {
    if (isMissingNetworkClientModuleSpec(input)) {
        return buildBlockedResult(input)
    }

    var networkPlan = analyzeNetworkClientModuleScope(input)
    var clientPlan = buildNetworkClients(networkPlan)
    var messagePlan = buildMessageTransport(networkPlan)
    var statePlan = buildConnectionStateMachine(networkPlan)
    var recoveryPlan = buildReconnectAndHeartbeat(networkPlan)

    return summarizeNetworkClientModuleResult(networkPlan, clientPlan, messagePlan, statePlan, recoveryPlan)
}
```

约束说明：

- NetworkClientModule 应聚焦客户端网络基础设施，不承载业务消息分发后的业务处理。
- 连接状态、重连策略和心跳检测必须成组设计，避免只定义单点功能。
- `Tick` 驱动必须与接收回调、超时检测和自动重连保持一致。
- 平台限制例如微信小游戏端口限制与建连频率限制必须纳入实现约束。

## 实现流程

### 第一步：确认平台与客户端抽象

明确目标平台、底层客户端实现、条件编译分支和客户端抽象接口。

### 第二步：确认消息收发结构

整理发送缓冲区、接收缓冲区、消息头、payload、加解密与回调方式。

### 第三步：确认连接状态机

设计 Connecting、Connected、Disconnected、Reconnecting 等状态，以及状态切换时机。

### 第四步：确认心跳与重连

整理心跳超时判定、断线后的自动重连、重连节流和手动断开行为。

### 第五步：输出结果

返回 NetworkClientModule 的结构建议、关键方法、平台约束与阻塞项。

## 强制约束

- 必须明确包含 Input、处理事项、Output 三块核心内容。
- 任务编排必须包含伪代码。
- 必须同时设计客户端抽象、收发流程、状态机和重连策略。
- 不得把业务协议流程或具体业务消息处理混入 NetworkClientModule 结构说明。
- 若缺少平台约束、心跳规则或缓冲区边界，应先返回阻塞项。

## 成功标准

- 能整理 NetworkClientModule 的客户端抽象与平台分支边界
- 能给出连接、发送、接收、Tick、重连、心跳的完整控制面
- 能覆盖缓冲区、加解密、状态切换和异常恢复规则
- 能输出可直接落地的 NetworkClientModule 结构建议