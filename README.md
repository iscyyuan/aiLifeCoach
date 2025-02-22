# AI Life Coach

一个基于DeepSeek R1 API的智能生活教练网站，通过AI驱动的对话为用户提供情感支持和生活建议。

## 项目概述

AI Life Coach 是一个专注于提供个性化生活指导的网络应用。它通过自然语言交互，为用户提供情绪支持、生活建议和行动计划。

## 功能特点

### 智能对话系统
- 基于 DeepSeek R1 API 的实时对话
- 自然语言理解和处理
- 上下文感知的多轮对话
- 打字机效果的 AI 回复

### 情感分析系统
- 实时情绪识别和分析
- 可视化情绪变化趋势图表
- 智能情绪评分机制
- 个性化情绪建议
- 详细的情绪统计报告

### 聊天记录管理
- 本地存储对话历史
- 智能时间显示（今天/昨天/具体日期）
- 一键导出聊天记录（UTF-8编码）
- 清晰的对话分隔格式
- 支持清除历史记录

### 用户界面
- 响应式设计，适配多种设备
- 简洁直观的操作界面
- 流畅的动画效果
- 实时状态反馈
- 错误处理和提示

## 技术实现

### 前端技术栈
- HTML5 + CSS3 + JavaScript (ES6+)
- 模块化 JavaScript
- LocalStorage 数据持久化
- Fetch API 异步通信
- CSS 变量主题定制

### 后端技术栈
- Node.js + Express 框架
- RESTful API 设计
- DeepSeek R1 API 集成
- CORS 跨域支持
- dotenv 环境变量管理


### 文件结构
```
aiLifeCoach/
├── public/
│   ├── css/
│   │   ├── main.css      # 主样式入口
│   │   ├── base.css      # 基础样式
│   │   ├── layout.css    # 布局样式
│   │   ├── chat.css      # 聊天相关样式
│   │   ├── sidebar.css   # 侧边栏样式
│   │   └── input.css     # 输入框样式
│   ├── js/
│   │   ├── main.js       # 主入口文件
│   │   ├── chat.js       # 聊天功能
│   │   ├── ui.js         # UI 交互
│   │   ├── storage.js    # 数据存储
│   │   └── utils.js      # 工具函数
│   └── index.html        # 主页面
├── src/
│   └── server.js         # 后端服务器
├── .env                  # 环境变量配置
├── .env.example         # 环境变量示例
└── README.md            # 项目文档
```

## API集成

### DeepSeek R1 API
- 端点：`https://ark.cn-beijing.volces.com/api/v3/chat/completions`
- 模型：deepseek-r1-250120
- 配置参数：
  - 温度：0.6
  - 超时设置：60秒

## 部署说明

1. 安装依赖：
```bash
npm install
```
2. 配置环境变量
3. 启动服务器：
```
npm start
```

## 技术规范
- 遵循W3C标准
- 采用ES6+语法
- RESTful API设计原则
- 响应式设计原则

## 维护说明
- 定期更新依赖包
- 监控API调用状态
- 优化用户体验
- 收集用户反馈

## 贡献指南
欢迎提交Issue和Pull Request来帮助改进项目。

## 许可证
MIT License