---
name: linux-nginx
description: "用于 Linux 环境下的 Nginx 安装与配置，适用于 HTTP/HTTPS 站点、TCP 转发、证书参数确认、服务重载与结果验证。"
---

# Linux Nginx Skill

此 skill 提取了 Linux Nginx 代理的实现流程、配置约束和非交互式参考。

## 接收的 Input

- 目标 Linux 主机信息和连接方式
- 目标发行版或待探测的操作系统信息
- 域名、监听端口、上游映射规则和 TCP 转发需求
- HTTPS 证书路径、私钥路径和是否启用跳转的要求

若站点参数、证书参数或端口映射规则不完整，则不能生成配置。

## 处理的事项

1. 确认远程连接上下文并侦测目标发行版。
2. 向用户获取完整站点参数、证书参数和 TCP 转发规则。
3. 以非交互方式安装 Nginx 并设置开机自启。
4. 生成 HTTP/HTTPS 站点配置或 stream 转发配置。
5. 执行 `nginx -t` 校验、重载服务并验证结果。

## 输出的 Output

linux-nginx.skill 的 Output 应包含：

- 识别出的发行版与安装方案
- 生成的站点或 stream 配置范围
- 配置校验与服务重载结果
- HTTP、HTTPS 或 TCP 转发验证结果与失败原因

## 任务编排

linux-nginx.skill 的任务编排是先确认环境和配置参数，再安装 Nginx，随后写配置、校验并验证服务。

伪代码如下：

```text
linuxNginx(input) {
    if (isMissingHostContext(input)) {
        return buildBlockedResult(input)
    }

    var osPlan = detectNginxHostOs(input)
    if (isMissingNginxSiteParams(input)) {
        return askUserForNginxParams(osPlan)
    }

    var installResult = installNginx(osPlan)
    var configResult = writeNginxConfig(installResult, input)
    var testResult = testNginxConfig(configResult)
    var verifyResult = verifyNginxEndpoints(testResult, input)

    return summarizeLinuxNginxResult(osPlan, installResult, configResult, testResult, verifyResult)
}
```

约束说明：

- 证书路径、私钥路径和端口映射缺失时，禁止写配置。
- 必须先 `nginx -t`，后重载服务。
- 输出必须区分安装、配置、校验和验证四个阶段。

## 核心职责

- 识别 Linux 发行版（Ubuntu/Debian、CentOS/RHEL）
- 安装并启动 Nginx
- 配置 HTTP/HTTPS 站点
- 配置 TCP 转发（stream）
- 验证 Nginx 服务可用性

## 实现流程

1. **连接确认**：执行前先确认是否需要通过远程 SSH 连接到目标服务器，并获取连接信息。
2. **环境侦测**：使用 `cat /etc/os-release` 等命令确定发行版。
3. **强制询问站点参数**：使用 `ask-questions` 工具获取站点域名、端口映射规则、证书路径、是否启用 HTTP 至 HTTPS 跳转，及 TCP 转发需求。
4. **执行安装**：根据包管理器选择 apt / yum / dnf，使用非交互参数安装 Nginx 并设置开机自启。
5. **初始化与配置**：生成站点配置或 stream 配置文件，确保 `nginx -t` 校验通过后重载服务。
6. **验证结果**：使用 `systemctl status nginx` 和 `curl` / `nc` 等命令验证 HTTP、HTTPS 与 TCP 转发。

## 约束

- 在未获取完整域名、端口映射规则及证书参数前，禁止写入站点配置。
- 使用非交互方式安装与配置，避免命令阻塞输入。
- 禁止使用伪 HTTPS；证书路径必须存在且可访问。
- 禁止重复映射同一监听端口至多个上游。
- 使用中文交流。

## Gist：Linux Nginx 非交互式配置参考（HTTP/HTTPS/TCP）

### Ubuntu/Debian (APT)

```bash
sudo apt update
sudo apt install -y nginx
sudo systemctl enable nginx
sudo systemctl start nginx

sudo tee /etc/nginx/sites-available/{Domain}.conf >/dev/null <<'EOF'
server {
    listen 80;
    server_name {Domain};

    location / {
        proxy_pass http://{UpstreamHost}:{UpstreamPort};
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
EOF

sudo ln -sf /etc/nginx/sites-available/{Domain}.conf /etc/nginx/sites-enabled/{Domain}.conf
sudo nginx -t
sudo systemctl reload nginx

sudo mkdir -p /etc/nginx/stream.d
sudo grep -Fq "include /etc/nginx/stream.d/*.conf;" /etc/nginx/nginx.conf || \
    sudo sed -i '/http\s*{/i stream {\n    include /etc/nginx/stream.d/*.conf;\n}\n' /etc/nginx/nginx.conf

sudo tee /etc/nginx/stream.d/tcp-{TcpListenPort}.conf >/dev/null <<'EOF'
server {
    listen {TcpListenPort};
    proxy_pass {TcpTargetHost}:{TcpTargetPort};
}
EOF

sudo nginx -t
sudo systemctl reload nginx
```

### CentOS/RHEL (YUM/DNF)

```bash
sudo dnf install -y nginx
sudo systemctl enable nginx
sudo systemctl start nginx

sudo tee /etc/nginx/conf.d/{Domain}.conf >/dev/null <<'EOF'
server {
    listen 80;
    server_name {Domain};
    return 301 https://$host$request_uri;
}

server {
    listen 443 ssl;
    server_name {Domain};

    ssl_certificate {CertFile};
    ssl_certificate_key {KeyFile};

    location / {
        proxy_pass http://{UpstreamHost}:{UpstreamPort};
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
EOF

sudo nginx -t
sudo systemctl reload nginx

sudo mkdir -p /etc/nginx/stream.d
sudo grep -Fq "include /etc/nginx/stream.d/*.conf;" /etc/nginx/nginx.conf || \
  sudo sed -i '/http\s*{/i stream {\n    include /etc/nginx/stream.d/*.conf;\n}\n' /etc/nginx/nginx.conf

sudo tee /etc/nginx/stream.d/tcp-{TcpListenPort}.conf >/dev/null <<'EOF'
server {
    listen {TcpListenPort};
    proxy_pass {TcpTargetHost}:{TcpTargetPort};
}
EOF

sudo nginx -t
sudo systemctl reload nginx
```