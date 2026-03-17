// src/pages/JournalPage.tsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { summarizeConversation } from "@/lib/ai"; 
import { saveEntry } from "@/lib/store";    
import { toast } from "sonner"; // 建议引入 toast 增强“进化感”

const JournalPage = () => {
  const [content, setContent] = useState("");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const navigate = useNavigate();

  const handleSaveJournal = async () => {
    if (!content.trim()) return;
    setIsAnalyzing(true);
    
    try {
      const mockMessages = [{ role: "user", content: content }];
      // ai.ts 内部已处理了 getLocalProfile 和 updateUserProfileSilent
      const result = await summarizeConversation(mockMessages as any);
      
      if (result) {
        // 核心修改：检测是否有画像进化并反馈给用户
        if (result.profileUpdates && Object.keys(result.profileUpdates).some(k => result.profileUpdates[k])) {
          toast.success("AI 助手已经记住了你的新特质 ✨", {
            description: "你的智能体已根据本次记录完成进化。"
          });
        }

        const entry = {
          id: crypto.randomUUID(),
          date: new Date().toISOString(),
          rawText: content, 
          summary: { 
            ...result, 
            mood: result.mood || "calm" 
          },
          createdAt: new Date().toISOString(),
        };

        saveEntry(entry);
        
        // 给用户一点点时间感受“进化”的反馈，然后再跳转
        setTimeout(() => navigate("/timeline"), 800);
      }
    } catch (error) {
      console.error("AI 分析失败:", error);
      toast.error("分析遇到了一点小麻烦，请重试");
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="min-h-[100dvh] bg-slate-50/30 flex flex-col px-6 py-8">
      {/* 头部和 Textarea 部分保持不变 */}
      <div className="flex items-center justify-between mb-8">
        <button onClick={() => navigate("/")} className="p-2 -ml-2 text-slate-400">
          <ArrowLeft size={24} />
        </button>
        <h1 className="text-lg font-bold text-slate-800">文字日记</h1>
        <div className="w-10" />
      </div>

      <textarea
        autoFocus
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder="在这里输入你的思考..."
        className="flex-1 w-full bg-transparent text-slate-700 text-lg leading-relaxed resize-none focus:outline-none placeholder:text-slate-300"
      />

      <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className="mt-6">
        <Button 
          onClick={handleSaveJournal}
          disabled={isAnalyzing || !content.trim()}
          className="w-full py-7 rounded-2xl bg-orange-600 hover:bg-orange-700 text-white font-bold shadow-lg shadow-orange-100 transition-all active:scale-[0.98]"
        >
          {isAnalyzing ? "AI 正在进化记忆..." : (
            <div className="flex items-center gap-2">
              <Sparkles size={20} />
              <span>完成记录并存入时间轴</span>
            </div>
          )}
        </Button>
      </motion.div>
    </div>
  );
};

export default JournalPage;