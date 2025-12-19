# 文献追溯 (Literature Trace)

这是一个用于学术文献追踪与管理的开源项目，旨在帮助研究人员高效地从 PubMed、ArXiv 等平台获取、同步和管理学术论文。

## 项目结构

```text
.
├── backend/                        # 后端服务版本 A (Express + MongoDB)
├── literature-trace-backend/       # 后端服务版本 B (核心 API 服务)
│   ├── models/                     # 数据模型 (Mongoose)
│   ├── routes/                     # API 路由
│   ├── services/                   # 外部 API 对接服务 (PubMed, ArXiv)
│   └── utils/                      # 工具类 (日志等)
└── literature-trace-miniprogram/   # 微信小程序前端
    ├── pages/                      # 小程序页面 (首页、详情、WebView)
    └── app.json                    # 小程序全局配置
```

## 技术栈

### 后端 (Backend)
- **框架**: Node.js + Express
- **数据库**: MongoDB (Mongoose)
- **缓存**: Redis
- **日志**: Winston
- **工具**: Axios (API 请求), Dotenv (环境配置)

### 前端 (Frontend)
- **平台**: 微信小程序 (WeChat Mini Program)
- **样式**: 原生 WXSS + V2 样式库

## 快速开始

### 1. 后端配置

进入 `literature-trace-backend` 目录：
```bash
cd literature-trace-backend
npm install
```

在目录下创建 `.env` 文件并配置环境变量：
```env
PORT=3000
MONGODB_URI=mongodb://localhost:27017/literature_trace
REDIS_URL=redis://localhost:6379
LOG_LEVEL=info
```

启动服务：
```bash
npm run dev
```

### 2. 小程序配置

1. 下载并安装 [微信开发者工具](https://developers.weixin.qq.com/miniprogram/dev/devtools/download.html)。
2. 导入 `literature-trace-miniprogram` 文件夹。
3. 修改 `app.js` 或相关配置文件中的 API 地址为你的后端地址。
4. 在开发者工具中点击“编译”即可预览。

## 主要功能

- **文献搜索**: 对接 PubMed 和 ArXiv 接口，实时检索学术论文。
- **数据同步**: 支持将文献数据同步至本地数据库。
- **详情展示**: 提供文献的详细信息展示，并支持通过 WebView 查看原文。
- **日志追踪**: 完善的后端日志记录系统。
