export type MoodType = "inspired" | "happy" | "focused" | "calm" | "tired" | "sad" | "stressed" | "confused";

// --- 新增：用户画像接口 ---
export interface UserProfile {
  role: string;          // 职业/身份 (如: CS研究生)
  techStack: string[];   // 技术栈/工具
  interests: string[];   // 兴趣/关注点 (如: Dataset Distillation)
  style: string;         // 沟通偏好
  lastUpdated: string;
}

// --- 修改：增加 AI 记忆进化字段 ---
export interface EntrySummary {
  completed: string[];
  problems: string[];
  mood: MoodType;
  moodNote: string;
  plans: string[];
  // AI 对用户画像的更新建议
  profileUpdates?: Partial<UserProfile>; 
}

export interface Entry {
  id: string;
  date: string;
  rawText: string;
  summary: EntrySummary;
  createdAt: string;
}

export const MOOD_CONFIG: Record<MoodType, { 
  emoji: string; 
  label: string; 
  color: string; 
  bg: string; 
  text: string;
  hex: string;
}> = {
  inspired: { emoji: "💡", label: "灵感", color: "mood-inspired", bg: "bg-amber-100", text: "text-amber-700", hex: "#fef3c7" }, 
  happy: { emoji: "😀", label: "开心", color: "mood-happy", bg: "bg-orange-100", text: "text-orange-700", hex: "#ffedd5" },
  focused: { emoji: "🎯", label: "高效", color: "mood-focused", bg: "bg-violet-100", text: "text-violet-700", hex: "#ede9fe" },
  calm: { emoji: "🙂", label: "平静", color: "mood-calm", bg: "bg-blue-100", text: "text-blue-700", hex: "#dbeafe" },
  tired: { emoji: "😴", label: "疲惫", color: "mood-tired", bg: "bg-slate-200", text: "text-slate-700", hex: "#e2e8f0" },
  sad: { emoji: "😔", label: "低落", color: "mood-sad", bg: "bg-indigo-100", text: "text-indigo-700", hex: "#e0e7ff" },
  stressed: { emoji: "😓", label: "焦虑", color: "mood-stressed", bg: "bg-rose-100", text: "text-rose-700", hex: "#ffe4e6" },
  confused: { emoji: "🤔", label: "困惑", color: "mood-confused", bg: "bg-emerald-100", text: "text-emerald-700", hex: "#d1fae5" },
};