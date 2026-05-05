---
name: csharp-mysql
description: "用于 C# 与 MySQL 的联合代码实现，适用于数据库连接、DatabaseManager、实体类、Repository、事务处理与查询模式模板。"
---

# CSharp MySQL Skill

此 skill 提取 C# 代码层面与 MySQL 数据访问相关的实现模板，避免语言混淆，专注于 C# 与 MySQL 的联合代码实现。

## 接收的 Input

- 目标 C# 项目的数据库访问需求
- 已确定的数据库表、实体和 Repository 设计
- 当前项目使用的 ORM、连接库或访问层接口
- 需要实现的连接初始化、实体类、Repository、事务或查询模板

若未提供目标实体或访问层边界，则不能可靠生成实现方案。

## 处理的事项

1. 将数据库访问需求映射为 C# 连接、实体、Repository 和事务代码结构。
2. 设计 `DatabaseManager`、实体类和 Repository 的实现模板。
3. 组织 CRUD、分页、联表查询和事务使用方式。
4. 校验实现是否保持 C# 风格，并遵守项目选定的 ORM 或访问层。
5. 输出可直接落地的 C# MySQL 代码实现方案。

## 输出的 Output

csharp-mysql.skill 的 Output 应包含：

- C# 连接初始化和数据库管理器模板
- 实体类与 Repository 实现建议
- 事务和复杂查询实现方式
- 需要注意的 ORM 约束和实现风险

## 任务编排

csharp-mysql.skill 的任务编排是先确认访问层边界，再生成 C# 数据访问模板，最后汇总可实现结果。

伪代码如下：

```text
csharpMysql(input) {
    if (isMissingCSharpMysqlSpec(input)) {
        return buildBlockedResult(input)
    }

    var accessPlan = analyzeCSharpMysqlScope(input)
    var connectionCode = buildConnectionTemplate(accessPlan)
    var entityCode = buildEntityTemplates(accessPlan)
    var repositoryCode = buildRepositoryTemplates(accessPlan)
    var transactionCode = buildTransactionPatterns(accessPlan)

    return summarizeCSharpMysqlResult(accessPlan, connectionCode, entityCode, repositoryCode, transactionCode)
}
```

约束说明：

- 该 skill 只处理 C# 代码实现，不扩展到数据库总体架构设计。
- 必须沿用项目当前选定的 ORM 或访问层，不引入越界实现。
- 输出必须保持 C# 风格和可直接编码的结构。

## 代码责任边界

- 仅处理 C# 代码实现层面
- 包括数据库连接、DatabaseManager、实体类、Repository、事务与查询模式
- 不涉及 SQL 方言以外的业务架构设计

## 核心模板

### C# 数据库连接初始化

```csharp
var connStr = "Server=127.0.0.1;Port=3306;Database={DbName};User ID=root;Password=yourpwd;CharSet=utf8mb4;";

using var connection = CreateConnection(connStr);
connection.Open();
```

### DatabaseManager（建库 + 建表）

```csharp
public class DatabaseManager {
    private readonly IDbConnection _connection;
    private readonly string _serverConnStr;

    public DatabaseManager(string connStr) {
        _connection = CreateConnection(connStr);
        _serverConnStr = RemoveDatabaseSegment(connStr) + "Database=mysql;";
    }

    public async Task CreateDatabaseIfNotExistsAsync(string dbName) {
        using var connection = CreateConnection(_serverConnStr);
        await connection.ExecuteAsync(
            $"CREATE DATABASE IF NOT EXISTS `{dbName}` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;");
    }

    public void SyncTable<TTable>() where TTable : class {
        // 使用项目已选的 ORM/迁移工具同步表结构
    }

    private IDbConnection CreateConnection(string connStr) {
        // 根据项目环境创建数据库连接对象
        throw new NotImplementedException();
    }

    private string RemoveDatabaseSegment(string connStr) {
        // 移除连接串中的 Database= 段
        throw new NotImplementedException();
    }
}
```

### 实体类模板

```csharp
[Table(Name = "{TableName}")]
public class {Table} {
    [Column(IsPrimary = true, IsIdentity = true)]
    public long Id { get; set; }

    [Column(StringLength = 128, IsNullable = false)]
    public string Name { get; set; } = string.Empty;

    [Column(IsNullable = true)]
    public string? Description { get; set; }

    [Column(ServerTime = DateTimeKind.Utc, CanUpdate = false)]
    public DateTime CreatedAt { get; set; }

    [Column(ServerTime = DateTimeKind.Utc)]
    public DateTime UpdatedAt { get; set; }
}
```

### Repository 模板

```csharp
public class {Table}Repository {
    private readonly IGenericRepository<{Table}> _repo;

    public {Table}Repository(IGenericRepository<{Table}> repo) {
        _repo = repo;
    }

    public Task<{Table}?> GetByIdAsync(long id) =>
        _repo.Where(e => e.Id == id).FirstAsync();

    public Task<List<{Table}>> GetAllAsync() =>
        _repo.Select.ToListAsync();

    public async Task<{Table}> CreateAsync({Table} table) {
        await _repo.InsertAsync(table);
        return table;
    }

    public Task UpdateAsync({Table} table) =>
        _repo.UpdateAsync(table);

    public Task DeleteAsync(long id) =>
        _repo.DeleteAsync(e => e.Id == id);
}
```

### 事务与查询模式

```csharp
using var uow = unitOfWorkFactory.Create();
var repoA = uow.GetRepository<TableA>();
var repoB = uow.GetRepository<TableB>();

await repoA.InsertAsync(a);
await repoB.InsertAsync(b);

uow.Commit();
```

```csharp
var list = await repo.Select
    .Where(e => e.Name.Contains(keyword))
    .OrderByDescending(e => e.CreatedAt)
    .Page(pageIndex, pageSize)
    .ToListAsync();
```

```csharp
var result = await repo.Select<OrderTable, UserTable>()
    .LeftJoin((o, u) => o.UserId == u.Id)
    .Where((o, u) => u.IsActive)
    .ToListAsync((o, u) => new { o.Id, u.Name });
```

## 约束

- 代码实现必须是 C# 风格，避免语言混淆。
- 如果涉及 SQL 或数据库访问逻辑，应使用项目当前选定的 ORM 或数据库访问层。
- 采用中文交流。
