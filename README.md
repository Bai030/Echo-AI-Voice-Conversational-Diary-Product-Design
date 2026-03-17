# 🧠 AI-Driven Reflexion Journal (进化型 AI 复盘笔记)

这是一个基于 **React + TypeScript** 开发的智能化个人复盘工具。它不仅能记录你的日常，还能通过“理性”与“感性”双通道 AI 逻辑，构建你的**数字孪生画像**。

## ✨ 核心特性

- **🌈 情绪热力图 (Mood Heatmap)**：基于 `date-fns` 构建的日历视图，自动根据每日主情绪渲染色彩，直观呈现你的心理状态周期。
- **🧬 进化型 AI 记忆 (Evolving AI Memory)**：
    - **自动画像提取**：AI 会在复盘时自动识别并记录你的职业、技术栈、长期目标。
    - **本地深度持久化**：用户信息加密存储于 `LocalStorage`，实现真正的个性化智能体。
    - **上下文注入**：AI 助手会根据你的背景（如：研究员、开发者）调整对话风格和共情深度。
- **🌓 双轨处理逻辑**：
    - **理性通道**：精准提取完成事项、问题与计划，生成结构化 JSON。
    - **感性通道**：提供 80 字以内的共情对话，拒绝机械化回复，保持真人感。
- **📱 极简交互**：基于 `framer-motion` 的流畅动效，支持响应式布局与 shadcn/ui 组件库。

## 🛠️ 技术栈

- **Frontend**: React 18, Vite, TypeScript
- **Styling**: Tailwind CSS, Shadcn UI, Lucide Icons
- **Animation**: Framer Motion
- **Date Logic**: date-fns
- **AI Engine**: GPT-4o-mini / DeepSeek (通过 API 调度实现)

## 🚀 快速开始

### 1. 克隆并安装
```sh
git clone <https://github.com/Bai030/Echo-AI-Voice-Conversational-Diary-Product-Design.git>
cd <YOUR_PROJECT_NAME>
npm install
```

### 2. 配置环境变量
在项目根目录创建 .env 文件（或在 Lovable 设置中添加）：
```sh
代码段
VITE_DEEPSEEK_API_KEY=你的API密匙
```

### 3. 启动开发服务器
```sh
Bash
npm run dev
```

## 📝 使用说明
### 📂 核心代码说明

- src/lib/ai.ts: AI 调度层。处理记忆提取、画像合并与双通道对话逻辑。
- src/lib/types.ts: 类型定义层。定义了 UserProfile、Entry 和情绪配置。
- src/pages/JournalPage.tsx: 输入与进化层。实现 AI 总结与本地记忆的静默更新。
- src/components/TimelineCalendar.tsx: 可视化层。实现情绪热力图的色彩渲染。


## 🛡️ 隐私说明
本应用优先考虑隐私安全，所有的 AI 画像 (UserProfile) 均存储在用户的本地浏览器（LocalStorage）中，不会持久化存储在任何第三方服务器。

## 💡 如何验证 AI 记忆？
在 Edge/Chrome 中按 F12 -> Application (应用) -> Local Storage (本地存储)。
查看 user_profile 键值，见证 AI 对你的理解是如何一步步“进化”的。
