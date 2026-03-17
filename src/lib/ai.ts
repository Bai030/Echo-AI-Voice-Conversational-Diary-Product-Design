const API_KEY = import.meta.env.VITE_DEEPSEEK_API_KEY;
const API_URL = "https://api.chatanywhere.tech/v1/chat/completions"; 

import { MOOD_CONFIG, UserProfile, MoodType } from "./types";

export interface ChatMessage {
  role: "system" | "user" | "assistant";
  content: string;
}

// 辅助函数：安全获取本地画像
const getLocalProfile = (): string => {
  const profile = localStorage.getItem("user_profile");
  if (!profile) return "尚未了解用户背景。";
  try {
    const p: UserProfile = JSON.parse(profile);
    return `职业: ${p.role}, 技术栈: ${p.techStack.join(", ")}, 兴趣/关注点: ${p.interests.join(", ")}, 风格偏好: ${p.style}`;
  } catch {
    return "背景资料解析失败。";
  }
};

/**
 * 1. 理性通道：JSON 提取
 */
export async function analyzeReflections(prompt: string) {
  if (!prompt) return null;
  try {
    const response = await fetch(API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${API_KEY}`
      },
      body: JSON.stringify({
        model: "gpt-4o-mini", 
        messages: [
          {
            role: "system",
            content: "你是一个专业的 JSON 转换接口。严格输出 JSON 格式，严禁解释或使用 Markdown 标签。"
          },
          { role: "user", content: prompt }
        ],
        response_format: { type: 'json_object' }
      })
    });

    if (!response.ok) return null;
    const data = await response.json();
    const rawContent = data.choices?.[0]?.message?.content;
    if (!rawContent) return null;

    const cleanJson = rawContent.replace(/```json|```/g, "").trim();
    return JSON.parse(cleanJson);
  } catch (error) {
    console.error("AI 分析失败:", error);
    return null;
  }
}

/**
 * 2. 感性通道：注入记忆的对话
 */
export async function getChatReply(history: ChatMessage[]) {
  const userContext = getLocalProfile(); // 注入记忆
  try {
    const response = await fetch(API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${API_KEY}`
      },
      body: JSON.stringify({
        model: "gpt-4o-mini", 
        messages: [
          { 
            role: "system", 
            content: `你是一个富有同理心的 AI 复盘教练。
【你的记忆：关于用户】
${userContext}

【对话原则】
1. **个性化回应**：利用记忆中的信息（职业、目标等）让回复更贴切。
2. **先听后说**：确认用户情绪。
3. **保持简短**：回复在 80 字内。
4. **拒绝机械化**：不要说废话，像老朋友一样聊天。`
          },
          ...history 
        ]
      })
    });

    const data = await response.json();
    return data.choices?.[0]?.message?.content || "信号有点弱，请再说一遍。";
  } catch (error) {
    return "我的大脑连接暂时中断了。";
  }
}

/**
 * 3. 业务调度：提取复盘并进化记忆
 */
export async function summarizeConversation(history: ChatMessage[]) {
  const moodKeys = Object.keys(MOOD_CONFIG).join(", ");
  const userContext = getLocalProfile(); // 读取现有画像用于对比

  const chatContext = history
    .filter(m => m.role !== 'system')
    .map(m => `${m.role === 'user' ? '用户' : '助手'}: ${m.content}`)
    .join("\n");

  const taskDescription = `
请作为资深复盘专家，分析对话并提取数据。同时观察用户是否有身份或关注点的“进化”。

【已知用户画像】
${userContext}

【任务要求】
1. 情绪(mood): 必须从 [${moodKeys}] 中选。
2. 进化记忆(profileUpdates): 如果在对话中发现了用户新的职业身份、技术工具、长期目标或兴趣，请提取出来。如果无变化则留空。

【输出 JSON】
{
  "completed": [],
  "problems": [],
  "plans": [],
  "mood": "",
  "moodNote": "",
  "profileUpdates": {
    "role": "识别到的新身份",
    "techStack": ["新技能"],
    "interests": ["新关注点"],
    "style": "新沟通偏好"
  }
}

【对话记录】
${chatContext}
`;

  const result = await analyzeReflections(taskDescription);

  if (result) {
    const isValid = Object.keys(MOOD_CONFIG).includes(result.mood);
    const finalResult = isValid ? result : { ...result, mood: 'calm' };
    
    // 静默进化：在后台异步合并画像
    if (result.profileUpdates) {
      updateUserProfileSilent(result.profileUpdates);
    }
    
    return finalResult;
  }
  return null;
}

/**
 * 内部函数：合并并更新本地画像
 */
function updateUserProfileSilent(updates: any) {
  try {
    const raw = localStorage.getItem("user_profile");
    const old: UserProfile = raw ? JSON.parse(raw) : { role: "", techStack: [], interests: [], style: "", lastUpdated: "" };
    
    const updated: UserProfile = {
      ...old,
      role: updates.role || old.role,
      style: updates.style || old.style,
      techStack: Array.from(new Set([...old.techStack, ...(updates.techStack || [])])),
      interests: Array.from(new Set([...old.interests, ...(updates.interests || [])])),
      lastUpdated: new Date().toISOString()
    };
    
    localStorage.setItem("user_profile", JSON.stringify(updated));
  } catch (e) {
    console.error("更新画像失败", e);
  }
}