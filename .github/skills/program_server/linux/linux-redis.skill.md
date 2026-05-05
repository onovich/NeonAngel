---
name: linux-redis
description: "用于 Linux 环境下的 Redis 安装与初始化，适用于识别发行版、非交互安装、密码配置、服务启动以及结果验证。"
---

# Linux Redis Skill

此 skill 提取了 Linux Redis 代理的实现流程、配置约束和非交互式初始化参考。

## 接收的 Input

- 目标 Linux 主机信息和连接方式
- 目标发行版或待探测的操作系统信息
- Redis 安装目标、服务名和初始化要求
- 用户明确提供的 Redis 访问密码

若未提供 Redis 密码，则不能进入配置修改与初始化阶段。

## 处理的事项

1. 确认是否需要远程 SSH，并准备主机连接上下文。
2. 识别 Linux 发行版并选择对应安装命令。
3. 向用户获取 Redis 访问密码。
4. 以非交互方式安装 Redis 并启动服务。
5. 写入 `requirepass`、重启服务并验证访问结果。

## 输出的 Output

linux-redis.skill 的 Output 应包含：

- 识别出的发行版与安装方案
- Redis 安装和服务启动结果
- 密码配置是否完成
- 最终验证结果和失败原因

## 任务编排

linux-redis.skill 的任务编排是先确认主机与发行版，再获取访问密码，随后执行安装、配置和验证。

伪代码如下：

```text
linuxRedis(input) {
	if (isMissingHostContext(input)) {
		return buildBlockedResult(input)
	}

	var osPlan = detectRedisHostOs(input)
	if (isMissingRedisPassword(input)) {
		return askUserForRedisPassword(osPlan)
	}

	var installResult = installRedisServer(osPlan, input)
	var configResult = configureRedisPassword(installResult, input.redisPassword)
	var verifyResult = verifyRedisService(configResult, input.redisPassword)

	return summarizeLinuxRedisResult(osPlan, installResult, configResult, verifyResult)
}
```

约束说明：

- Redis 密码未确认前，禁止写配置文件。
- 安装与配置必须采用非交互方式。
- 输出必须明确区分安装结果、配置结果和验证结果。

## 核心职责

- 识别 Linux 发行版（Ubuntu/Debian、CentOS/RHEL）
- 安装 Redis Server
- 运行 Redis 初始化与安全配置
- 启动并设置 Redis 服务开机自启
- 验证 Redis 服务可用性

## 实现流程

1. **连接确认**：执行前先确认是否需要通过远程 SSH 连接到目标服务器，并获取连接信息。
2. **环境侦测**：使用 `cat /etc/os-release` 等命令确定发行版。
3. **强制询问密码**：使用 `ask-questions` 工具获取 Redis 访问密码，禁止默认无密码配置。
4. **执行安装**：根据包管理器选择 apt / yum / dnf，使用非交互参数安装 Redis。
5. **初始化与配置**：定位 Redis 配置文件并通过 `sed` 修改或追加 `requirepass`，然后重启服务。
6. **验证结果**：使用 `redis-cli -a <密码> ping` 验证服务可用性。

## 约束

- 在未获取 Redis 密码前，禁止执行配置修改与初始化操作。
- 使用非交互方式安装与配置，避免命令阻塞输入。
- 密码配置必须明确写入配置文件并验证生效。
- 使用中文交流。

## Gist：Linux Redis 非交互式初始化参考

### Ubuntu/Debian (APT)

```bash
sudo apt update
sudo apt install -y redis-server
sudo systemctl enable redis-server

sudo sed -i 's/^# *requirepass .*/requirepass {RedisPassword}/g' /etc/redis/redis.conf
sudo grep -q "^requirepass " /etc/redis/redis.conf || echo "requirepass {RedisPassword}" | sudo tee -a /etc/redis/redis.conf

sudo systemctl restart redis-server
```

### CentOS/RHEL (YUM/DNF)

```bash
sudo dnf install -y epel-release
sudo dnf install -y redis
sudo systemctl enable redis

sudo sed -i 's/^# *requirepass .*/requirepass {RedisPassword}/g' /etc/redis.conf
sudo grep -q "^requirepass " /etc/redis.conf || echo "requirepass {RedisPassword}" | sudo tee -a /etc/redis.conf

sudo systemctl restart redis
```