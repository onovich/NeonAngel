---
name: csharp-network
description: "用于 C# 网络实现细节，适用于设计 IMessage、消息类、对象池、NetworkServer/NetworkModule 封装，以及 Telepathy 兼容的主线程消息处理。"
---

# CSharp Network Skill

此 skill 提取 C# 网络实现的语言级细节与实现模板，专注于 `IMessage` 设计、消息类、NetworkServer、NetworkModule 和 Telepathy 兼容。

## 接收的 Input

- 目标 C# 网络模块的实现需求
- 已确定的协议设计、消息类型和消息 ID 范围
- 传输层约束、线程模型和兼容性要求
- 需要实现的 `IMessage`、消息池、`NetworkServer` 或 `NetworkModule` 范围

若缺少协议定义、消息范围或线程约束，则不能可靠生成实现方案。

## 处理的事项

1. 将通用网络设计映射为 C# 的接口、消息类和传输层封装。
2. 设计 `IMessage`、消息类、消息池和消息工厂注册方式。
3. 设计 `NetworkServer`、`NetworkModule` 与 Telepathy 兼容的封装结构。
4. 校验所有业务回调是否保持在 `Tick` 主线程触发。
5. 输出可直接实现的 C# 网络代码模板和约束说明。

## 输出的 Output

csharp-network.skill 的 Output 应包含：

- `IMessage`、消息类和消息池实现建议
- `NetworkServer`、`NetworkModule` 的代码结构
- 主线程调度和传输层解耦规则
- 兼容性与禁用项提醒

## 任务编排

csharp-network.skill 的任务编排是先确认协议与线程边界，再组织 C# 网络模板，最后输出实现结果。

伪代码如下：

```text
csharpNetwork(input) {
    if (isMissingCSharpNetworkSpec(input)) {
        return buildBlockedResult(input)
    }

    var networkPlan = analyzeCSharpNetworkScope(input)
    var messageCode = buildMessageInterfacesAndTypes(networkPlan)
    var poolCode = buildMessagePool(networkPlan)
    var transportCode = buildNetworkServerAndModule(networkPlan)
    validateMainThreadDispatch(transportCode)

    return summarizeCSharpNetworkResult(networkPlan, messageCode, poolCode, transportCode)
}
```

约束说明：

- 禁改 `Telepathy/` 和禁用 `BinaryPrimitives` 的规则必须保留。
- 所有业务处理回调都必须由 `Tick` 在主线程执行。
- 输出必须是 C# 实现级模板，而不是回退成通用协议描述。

## 代码责任边界
- 仅处理 C# 网络实现细节
- 包括 `IMessage` 接口、消息类、消息池、传输层封装和主线程调度
- 不涉及高层业务流程设计或协议定义

## 核心模板

### 1. `IMessage` 接口
```csharp
public interface IMessage {
    ushort MessageId { get; }
    byte BodyType { get; }
    void WriteTo(IBinaryWriter writer);
    void ReadFrom(IBinaryReader reader);
    void Reset();
}
```

### 2. 消息类模板
```csharp
public class PingMessage_Req : IMessage {
    public ushort MessageId => MessageConst.PingMessageReq;
    public byte BodyType => BodyType.None;

    public void WriteTo(IBinaryWriter writer) {
        // 无需写 body
    }

    public void ReadFrom(IBinaryReader reader) {
        // 无需读 body
    }

    public void Reset() {
        // 清理临时字段
    }
}
```

### 3. MessagePool 模板
```csharp
public class MessagePool {
    private readonly Dictionary<ushort, Queue<IMessage>> _pools = new();
    private readonly Dictionary<ushort, Func<IMessage>> _factories = new();

    public void Register<T>(ushort messageId, Func<IMessage> factory) where T : IMessage {
        _factories[messageId] = factory;
        _pools[messageId] = new Queue<IMessage>();
    }

    public IMessage Rent(ushort messageId) {
        if (_pools.TryGetValue(messageId, out var queue) && queue.Count > 0) {
            return queue.Dequeue();
        }
        return _factories[messageId]();
    }

    public void Return(IMessage message) {
        message.Reset();
        _pools[message.MessageId].Enqueue(message);
    }
}
```

### 4. NetworkServer / Telepathy 封装
```csharp
public class NetworkServer {
    private readonly Telepathy.Server _server;

    public NetworkServer(int port) {
        _server = new Telepathy.Server();
        // 初始化配置
    }

    public void Init() {
        // 绑定事件和回调
    }

    public void Start() {
        _server.Start(port);
    }

    public void Stop() {
        _server.Stop();
    }

    public void Tick() {
        while (_server.GetNextMessage(out var msg)) {
            HandleData(msg);
        }
    }
}
```

### 5. Tick 主线程回调
- 所有业务处理回调必须由 `Tick` 在主线程触发
- 传输层负责收集原始数据并交给主线程处理
- 不要在网络回调中直接执行游戏逻辑

## 约束
- 禁改 `Telepathy/`
- 禁用 `BinaryPrimitives`
- JSON 统一使用 Newtonsoft.Json 库
- C# 网络代码必须兼容 `netstandard2.1`
- 使用 `IBinaryWriter` / `IBinaryReader` 或等价接口，避免直接依赖平台特殊类型
- 只用中文

## 说明
- 本 skill 针对 C# 网络实现细节。通用协议和消息流程请参考 `skills/coding/network/network.skill.md`。