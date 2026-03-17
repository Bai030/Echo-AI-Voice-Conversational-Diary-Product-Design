import { useState } from "react";
import { motion } from "framer-motion";
import { LayoutList, Calendar as CalendarIcon } from "lucide-react"; // 引入切换图标
import TimelineList from "@/components/TimelineList";
import TimelineCalendar from "@/components/TimelineCalendar"; // 假设我们将日历逻辑封装在这里
import NavigationBar from "@/components/NavigationBar";
import { getEntries } from "@/lib/store";

const TimelinePage = () => {
  const [viewMode, setViewMode] = useState<'list' | 'calendar'>('list');
  const entries = getEntries();

  return (
    <div className="min-h-[100dvh] px-6 pb-24 pt-14">
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8 flex items-center justify-between"
      >
        <h1 className="text-2xl font-bold text-foreground">时间线</h1>
        
        {/* 视图切换开关 */}
        <div className="flex bg-slate-200/50 p-1 rounded-xl">
          <button 
            onClick={() => setViewMode('list')}
            className={`p-1.5 rounded-lg transition-all ${viewMode === 'list' ? 'bg-white shadow-sm text-orange-600' : 'text-slate-400'}`}
          >
            <LayoutList size={18} />
          </button>
          <button 
            onClick={() => setViewMode('calendar')}
            className={`p-1.5 rounded-lg transition-all ${viewMode === 'calendar' ? 'bg-white shadow-sm text-orange-600' : 'text-slate-400'}`}
          >
            <CalendarIcon size={18} />
          </button>
        </div>
      </motion.div>

      {/* 条件渲染视图 */}
      {viewMode === 'list' ? (
        <TimelineList entries={entries} />
      ) : (
        <TimelineCalendar entries={entries} />
      )}

      <NavigationBar />
    </div>
  );
};

export default TimelinePage;