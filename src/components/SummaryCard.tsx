import { EntrySummary, MOOD_CONFIG } from "@/lib/types";
import { motion, AnimatePresence } from "framer-motion"; // 新增 AnimatePresence
import { useState } from "react"; // 新增 useState
import { MessageCircle, ChevronDown, ChevronUp } from "lucide-react"; // 新增图标

interface SummaryCardProps {
  summary: EntrySummary | null;
  rawText?: string; // 新增：可选的对话文本属性
}

const sectionVariants = {
  hidden: { opacity: 0, y: 12 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.1, duration: 0.4 },
  }),
};

const SummaryCard = ({ summary, rawText }: SummaryCardProps) => {
  const [showRaw, setShowRaw] = useState(false); // 管理对话折叠状态

  if (!summary) {
    return (
      <div className="rounded-2xl bg-card p-10 text-center text-muted-foreground border border-dashed">
        正在分析数据中...
      </div>
    );
  }

  const safeMoodKey = (summary.mood && MOOD_CONFIG[summary.mood]) ? summary.mood : 'neutral';
  const moodInfo = MOOD_CONFIG[safeMoodKey];

  const sections = [
    { icon: "✅", title: "今日完成", items: summary.completed || [] },
    { icon: "⚠️", title: "遇到问题", items: summary.problems || [] },
    { icon: "📌", title: "明日计划", items: summary.plans || [] },
  ];

  return (
    <div className="space-y-5">
      {sections.map((section, i) => (
        <motion.div
          key={section.title}
          custom={i}
          initial="hidden"
          animate="visible"
          variants={sectionVariants}
          className="rounded-2xl bg-card p-5"
        >
          <h3 className="mb-3 text-sm font-semibold text-muted-foreground tracking-wide">
            {section.icon} {section.title}
          </h3>
          <ul className="space-y-2">
            {(section.items || []).length > 0 ? (
              section.items.map((item, j) => (
                <li key={j} className="text-foreground/90 text-[15px] leading-relaxed pl-1">
                  • {item}
                </li>
              ))
            ) : (
              <li className="text-muted-foreground text-sm italic">暂无记录</li>
            )}
          </ul>
        </motion.div>
      ))}

      {/* 情绪状态卡片 */}
      <motion.div custom={3} initial="hidden" animate="visible" variants={sectionVariants} className="rounded-2xl bg-card p-5">
        <h3 className="mb-3 text-sm font-semibold text-muted-foreground tracking-wide">🙂 情绪状态</h3>
        <div className="flex items-center gap-3">
          <span className="text-3xl">{moodInfo?.emoji || "😐"}</span>
          <div>
            <p className="font-medium text-foreground">{moodInfo?.label || "平静"}</p>
            <p className="text-sm text-muted-foreground">{summary.moodNote || "记录生活点滴"}</p>
          </div>
        </div>
      </motion.div>

      {/* 新增：原始对话折叠区块 (仅在传入 rawText 时渲染) */}

      {/* 修改后的：原始对话折叠区块 */}
{rawText && (
  <motion.div 
    custom={4} 
    initial="hidden" 
    animate="visible" 
    variants={sectionVariants} 
    className="rounded-2xl bg-card overflow-hidden"
  >
    <button 
      onClick={() => setShowRaw(!showRaw)}
      className="w-full px-5 py-5 flex items-center justify-between text-sm font-semibold text-muted-foreground tracking-wide hover:bg-slate-50/50 transition-colors"
    >
      <div className="flex items-center gap-2">
        {/* 根据内容动态显示标题文本 */}
        <span>{rawText.includes("用户:") ? "💬 原始对话记录" : "📝 原始日记内容"}</span>
      </div>
      {showRaw ? <ChevronUp className="w-4 h-4 text-slate-300" /> : <ChevronDown className="w-4 h-4 text-slate-300" />}
    </button>

    <AnimatePresence>
      {showRaw && (
        <motion.div 
          initial={{ height: 0, opacity: 0 }} 
          animate={{ height: "auto", opacity: 1 }} 
          exit={{ height: 0, opacity: 0 }}
        >
          <div className="px-5 pb-6 pt-0 border-t border-slate-50/50">
            {/* 逻辑判断：如果是语音对话格式 */}
            {rawText.includes("用户:") || rawText.includes("教练:") ? (
              <div className="space-y-3 pt-4">
                {rawText.split('\n').filter(Boolean).map((line, idx) => {
                  const isUser = line.startsWith("用户");
                  return (
                    <div key={idx} className={`flex ${isUser ? 'justify-end' : 'justify-start'}`}>
                      <div className={`max-w-[85%] px-3 py-2 rounded-2xl text-[13px] leading-relaxed ${
                        isUser ? 'bg-orange-500 text-white rounded-tr-none' : 'bg-slate-100 text-slate-600 rounded-tl-none'
                      }`}>
                        {line.replace(/^(用户|教练): /, "")}
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              /* 逻辑判断：如果是纯文字日记格式 */
              <div className="pt-4 pb-2">
                <p className="text-[14px] text-slate-600 leading-relaxed whitespace-pre-wrap pl-1">
                  {rawText}
                </p>
              </div>
            )}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  </motion.div>
)}
    </div>
  );
};

export default SummaryCard;