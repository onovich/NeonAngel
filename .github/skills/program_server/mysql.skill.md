---
name: mysql
description: "用于 MySQL 数据访问方案设计，适用于规划表结构、实体映射、Repository 模式、连接配置、事务处理与复杂查询策略。"
---

# MySQL Skill

此 skill 提取 MySQL 数据访问实现的通用流程与设计规范，适用于 ORM 或数据库访问层的模型、连接配置与 Repository 模式。

## 接收的 Input

- 目标业务的数据访问需求
- 需要设计的数据库、表结构、查询场景和事务边界
- 当前项目允许使用的 ORM 或数据库访问层
- 现有实体模型、连接约束和性能要求

若未提供目标查询场景、表结构方向或 ORM 边界，应先返回缺失项。

## 处理的事项

1. 分析业务需要哪些表、字段、索引和约束。
2. 设计实体映射、Repository 边界和连接配置方案。
3. 设计 CRUD、分页、复杂查询和事务处理策略。
4. 校验方案是否遵循项目许可的 ORM 与访问层约束。
5. 输出可交给实现阶段使用的数据库访问设计结果。

## 输出的 Output

mysql.skill 的 Output 应包含：

- 表结构与实体映射方案
- Repository 与连接配置建议
- 事务处理和复杂查询策略
- 约束、风险点和后续实现建议

## 任务编排

mysql.skill 的任务编排是先分析数据访问需求，再设计表结构和访问层，最后输出数据库访问方案。

伪代码如下：

```text
mysqlDesign(input) {
	if (isMissingMysqlRequirement(input)) {
		return buildBlockedResult(input)
	}

	var schemaPlan = designMysqlSchema(input)
	var repositoryPlan = designMysqlRepository(schemaPlan)
	var queryPlan = designMysqlQueries(schemaPlan, repositoryPlan)
	validateOrmConstraints(queryPlan, input)

	return summarizeMysqlDesign(schemaPlan, repositoryPlan, queryPlan)
}
```

约束说明：

- 该 skill 只产出数据访问方案，不直接落具体语言代码。
- 复杂查询也应保持 ORM 风格，不能退化成随意拼接裸 SQL。
- 输出必须能直接指导后续实现，而不是只给抽象概念。

## 核心职责

- 设计 MySQL 数据库访问方案
- 规划 Table 映射与字段类型
- 配置数据库连接并管理访问层
- 定义 Repository 模式与 CRUD 模板
- 提供事务处理与复杂查询策略

## 实现流程

1. 建立上下文：理解需求，确定目标数据库、表结构与业务查询场景。
2. 确定表结构：设计表名、字段类型、主键策略、索引和约束。
3. 定义实体：通过 Table 映射类表示业务模型。
4. 定义 Repository：封装增删改查、分页与查询模式。
5. 配置数据库访问层：创建数据库连接和 CodeFirst 同步规则。
6. 事务与复杂查询：制定可靠的 Unit of Work 和联表查询策略。

## 约束

- 仅使用项目许可的 ORM/数据库访问层，不引入未经批准的第三方 ORM。
- 避免直接操作裸 SQL；优先使用 ORM/访问层提供的 Fluent API。
- 复杂查询可使用 `ToSql()` 或等价调试，但输出实现应保持 ORM 风格。
- 采用中文交流。

## 说明

- 具体的 C# 代码实现与模板请参阅 `skills/coding/mysql/csharp-mysql.skill.md`。
- 本 skill 关注 MySQL 访问方案与数据库层设计。
