import { Entry, MOOD_CONFIG, MoodType } from "@/lib/types"; // 补充 MoodType 引用
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { format } from "date-fns";

interface TimelineListProps {
  entries: Entry[];
}

const TimelineList = ({ entries }: TimelineListProps) => {
  const navigate = useNavigate();

  if (entries.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-muted-foreground">
        <p className="text-lg">还没有记录</p>
        <p className="text-sm mt-1">开始你的第一次复盘吧</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {entries.map((entry, i) => {
        // 获取情绪配置
        const moodInfo = MOOD_CONFIG[entry.summary.mood as MoodType];
        
        return (
          <motion.button
            key={entry.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
            onClick={() => navigate(`/entry/${entry.id}`)}
            // 增加 overflow-hidden 以便显示绝对定位的边条
            className="w-full rounded-2xl bg-card p-4 text-left transition-transform active:scale-[0.98] relative overflow-hidden shadow-sm border border-slate-100/50"
          >
            {/* 核心修改：左侧情绪色条 */}
            <div className={`absolute left-0 top-0 bottom-0 w-1.5 ${moodInfo?.bg || 'bg-slate-200'}`} />
            
            <div className="flex items-center justify-between pl-2"> {/* 增加左间距防止文字贴着色条 */}
              <div>
                <p className={`font-bold text-[13px] ${moodInfo?.text || 'text-foreground'}`}>
                  {format(new Date(entry.createdAt), "MMM dd · HH:mm")}
                </p>
                <p className="text-sm font-medium text-slate-600 mt-1 line-clamp-1">
                  {entry.summary.moodNote || entry.summary.completed[0] || "复盘记录"}
                </p>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <span className="text-2xl">{moodInfo?.emoji}</span>
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${moodInfo?.bg || 'bg-slate-100'} ${moodInfo?.text || 'text-slate-400'}`}>
                  {moodInfo?.label}
                </span>
              </div>
            </div>
          </motion.button>
        );
      })}
    </div>
  );
};

export default TimelineList;