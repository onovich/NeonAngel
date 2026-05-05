---
name: redis
description: "用于 Redis 连接管理与缓存实现，适用于封装字符串/Hash 等数据结构操作、分布式锁、发布订阅以及缓存键命名与过期策略。"
---

# Redis Skill

此 skill 定义了 Redis 连接管理、缓存逻辑、数据结构操作、分布式锁与 Pub/Sub 实现规范。适用于任意编程语言，以下示例仅作参考。

## 接收的 Input

- 目标缓存或消息场景的业务需求
- Redis 连接方式、数据库编号、认证信息和客户端库范围
- 需要操作的数据结构，例如 String、Hash、Set、List、ZSet、锁或 Pub/Sub
- Key 命名、过期时间和并发约束

若缺少连接方式、数据结构目标或 Key 约束，则不能可靠设计实现方案。

## 处理的事项

1. 设计 Redis 连接管理器和客户端初始化方式。
2. 设计缓存访问、Hash 操作、分布式锁和发布订阅的实现模式。
3. 定义 Key 命名与过期策略。
4. 校验实现是否满足异步调用、前缀命名和避免生产环境危险查询的约束。
5. 输出可交给具体语言实现层继续落地的 Redis 方案。

## 输出的 Output

redis.skill 的 Output 应包含：

- Redis 初始化和连接管理方案
- 各数据结构或能力的实现建议
- Key 命名和过期策略
- 并发、性能和风险提示

## 任务编排

redis.skill 的任务编排是先识别缓存场景，再选择对应 Redis 能力，最后输出连接与访问方案。

伪代码如下：

```text
redisDesign(input) {
    if (isMissingRedisRequirement(input)) {
        return buildBlockedResult(input)
    }

    var connectionPlan = designRedisConnection(input)
    var featurePlan = designRedisFeatures(connectionPlan, input)
    var keyPlan = defineRedisKeyPolicy(featurePlan, input)
    validateRedisSafetyRules(keyPlan)

    return summarizeRedisDesign(connectionPlan, featurePlan, keyPlan)
}
```

约束说明：

- 必须显式约定过期时间和 Key 前缀规则。
- 不允许把 `KEYS *` 作为生产方案的一部分。
- 输出必须覆盖连接、能力选择和 Key 策略三个层面。

## 目标

- 提供 Redis 客户端访问与缓存封装的通用规范
- 约定缓存 Key 命名、过期策略和序列化方式
- 提供 Hash/Set/List/ZSet 的标准操作模板
- 实现基于 Redis 的分布式锁与发布/订阅流程

## Redis 初始化与管理器

以下为 C# 参考实现。具体客户端库按语言和项目依赖选择；C# 场景 JSON 序列化请使用 `Newtonsoft.Json`。

```csharp
using StackExchange.Redis;
using Newtonsoft.Json;

public static class RedisManager {
    private static readonly Lazy<ConnectionMultiplexer> lazyConnection = new Lazy<ConnectionMultiplexer>(() => {
        var connStr = "127.0.0.1:6379,password=yourpwd,defaultDatabase=0";
        var options = ConfigurationOptions.Parse(connStr);
        // options.ReconnectRetryPolicy = new LinearRetry(5000);
        return ConnectionMultiplexer.Connect(options);
    });

    public static ConnectionMultiplexer Connection => lazyConnection.Value;

    public static IDatabase Db => Connection.GetDatabase();
}
```

## 缓存操作（String）

```csharp
public static class RedisCache {
    public static async Task SetCacheAsync<T>(string key, T data, TimeSpan? expiry = null) {
        var json = JsonConvert.SerializeObject(data);
        await RedisManager.Db.StringSetAsync(key, json, expiry);
    }

    public static async Task<T?> GetCacheAsync<T>(string key) {
        var val = await RedisManager.Db.StringGetAsync(key);
        if (val.IsNullOrEmpty) return default;
        return JsonConvert.DeserializeObject<T>(val.ToString());
    }

    public static async Task RemoveCacheAsync(string key) {
        await RedisManager.Db.KeyDeleteAsync(key);
    }
}
```

## Hash 操作

```csharp
await RedisManager.Db.HashSetAsync("user:1001", new HashEntry[] {
    new HashEntry("Name", "Alice"),
    new HashEntry("Age", "25")
});

var name = await RedisManager.Db.HashGetAsync("user:1001", "Name");
var allEntries = await RedisManager.Db.HashGetAllAsync("user:1001");
```

## 分布式锁

```csharp
public static async Task<bool> DoWithLockAsync(string lockKey, TimeSpan lockTimeout, Func<Task> action) {
    string lockToken = Guid.NewGuid().ToString();
    bool acquired = await RedisManager.Db.LockTakeAsync(lockKey, lockToken, lockTimeout);
    if (!acquired) return false;

    try {
        await action();
        return true;
    } finally {
        await RedisManager.Db.LockReleaseAsync(lockKey, lockToken);
    }
}
```

## 发布/订阅（Pub/Sub）

```csharp
var subscriber = RedisManager.Connection.GetSubscriber();
await subscriber.PublishAsync("channel:match:events", "match_started_101");
await subscriber.SubscribeAsync("channel:match:events", (channel, message) => {
    Console.WriteLine($"Received on {channel}: {message}");
});
```

## Key 命名规范

- 格式: `系统前缀:模块:子模块:特定标识`
- 示例: `GameServer:Match:Player:1001`, `Web:Session:Tokenxyz`

## 约束

- 明确指定缓存过期时间，避免产生永久垃圾数据
- Redis Key 应包含足够前缀与层级，不使用 `KEYS *` 进行生产查询
- 优先使用异步 Redis 客户端 API，避免阻塞主线程
