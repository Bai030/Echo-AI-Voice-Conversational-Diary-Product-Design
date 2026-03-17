import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { 
  format, 
  startOfMonth, 
  endOfMonth, 
  startOfWeek, 
  endOfWeek, 
  eachDayOfInterval, 
  isSameDay, 
  addMonths, 
  subMonths 
} from "date-fns";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion"; // 增加 AnimatePresence

import { MOOD_CONFIG, MoodType } from "@/lib/types"; // 确保引入配置

interface TimelineCalendarProps {
  entries: any[];
}

const TimelineCalendar = ({ entries }: TimelineCalendarProps) => {
  const navigate = useNavigate();
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedDay, setSelectedDay] = useState<Date>(new Date());

  const monthStart = startOfMonth(currentMonth);
  const monthEnd = endOfMonth(monthStart);
  const calendarStart = startOfWeek(monthStart);
  const calendarEnd = endOfWeek(monthEnd);
  const days = eachDayOfInterval({ start: calendarStart, end: calendarEnd });

  const selectedEntries = entries.filter(e => isSameDay(new Date(e.createdAt), selectedDay));

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
      <div className="bg-card rounded-3xl p-5 border border-slate-100 shadow-sm">
        <div className="flex items-center justify-between mb-6">
          <h2 className="font-bold text-slate-700">{format(currentMonth, "yyyy年 M月")}</h2>
          <div className="flex gap-1">
            <Button variant="ghost" size="icon" onClick={() => setCurrentMonth(subMonths(currentMonth, 1))} className="h-8 w-8 text-slate-400">
              <ChevronLeft size={18} />
            </Button>
            <Button variant="ghost" size="icon" onClick={() => setCurrentMonth(addMonths(currentMonth, 1))} className="h-8 w-8 text-slate-400">
              <ChevronRight size={18} />
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-7 mb-4">
          {['日', '一', '二', '三', '四', '五', '六'].map(d => (
            <div key={d} className="text-center text-[11px] font-bold text-slate-300">{d}</div>
          ))}
        </div>
        
        <div className="grid grid-cols-7 gap-y-1">
          {days.map((day, i) => {
            const dayEntries = entries.filter(e => isSameDay(new Date(e.createdAt), day));
            const isSelected = isSameDay(day, selectedDay);
            const isCurrentMonth = isSameDay(startOfMonth(day), monthStart);
            const isToday = isSameDay(day, new Date());

            // 核心修改：获取该日期主情绪对应的样式
            const primaryMood = dayEntries[0]?.summary?.mood as MoodType;
            const moodStyle = primaryMood ? MOOD_CONFIG[primaryMood] : null;

            return (
              <div 
                key={i} 
                onClick={() => setSelectedDay(day)}
                className={`aspect-square flex flex-col items-center justify-center rounded-2xl relative transition-all cursor-pointer ${
                  !isCurrentMonth ? 'opacity-10' : 'opacity-100'
                } ${
                  isSelected 
                    ? 'bg-slate-800 text-white shadow-md' // 选中时改为深色沉浸感
                    : (moodStyle ? `${moodStyle.bg} ${moodStyle.text}` : '') // 应用热力图颜色
                }`}
              >
                <span className={`text-[13px] ${isSelected ? 'text-white' : (isToday && !moodStyle ? 'text-orange-600 font-bold' : 'font-medium')}`}>
                  {format(day, 'd')}
                </span>
                
                {/* 仅在未选中且有热力图颜色时，点点改为白色或减弱，防止视觉混乱 */}
                {dayEntries.length > 0 && !isSelected && !moodStyle && (
                  <div className="absolute bottom-2.5 w-1 h-1 bg-orange-500 rounded-full" />
                )}
              </div>
            );
          })}
        </div>
      </div>
      
      {/* 底部列表保持逻辑不变，但可以给时间戳加个颜色点缀 */}
      <div className="space-y-3">
        <p className="text-[11px] font-bold text-slate-400 px-1 uppercase tracking-wider">
          {format(selectedDay, "M月d日")} · {selectedEntries.length} 条记录
        </p>
        <AnimatePresence mode="wait">
          <motion.div key={selectedDay.toISOString()} initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} className="space-y-2">
            {selectedEntries.map(entry => {
              const moodInfo = MOOD_CONFIG[entry.summary.mood as MoodType];
              return (
                <div 
                  key={entry.id} 
                  onClick={() => navigate(`/entry/${entry.id}`)}
                  className="p-4 rounded-2xl bg-white border border-slate-100 flex items-center justify-between active:scale-[0.98] transition-all"
                >
                  <div className="flex flex-col">
                    <div className="flex items-center gap-2 mb-0.5">
                       <span className={`text-[10px] font-bold ${moodInfo?.text || 'text-orange-400'}`}>
                         {format(new Date(entry.createdAt), "HH:mm")}
                       </span>
                       <span className="text-xs">{moodInfo?.emoji}</span>
                    </div>
                    <span className="text-sm font-semibold text-slate-700 line-clamp-1">
                      {entry.summary.moodNote || "记录内容"}
                    </span>
                  </div>
                  <ChevronRight size={14} className="text-slate-300" />
                </div>
              );
            })}
            {selectedEntries.length === 0 && (
              <div className="py-8 text-center text-[12px] text-slate-300 italic bg-slate-50/50 rounded-2xl border border-dashed">
                这一天没有记录
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    </motion.div>
  );
};

export default TimelineCalendar;