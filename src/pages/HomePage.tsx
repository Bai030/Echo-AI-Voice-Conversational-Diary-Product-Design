import { useNavigate } from "react-router-dom";
import { format } from "date-fns";
import { motion } from "framer-motion";
import { PenLine } from "lucide-react"; // 1. 引入图标
import RecordButton from "@/components/RecordButton";
import NavigationBar from "@/components/NavigationBar";
import { getEntries } from "@/lib/store";
import { Button } from "@/components/ui/button"; // 2. 引入 Button

const HomePage = () => {
  const navigate = useNavigate();
  const entries = getEntries();
  const lastEntry = entries[0];

  const handleStart = () => {
    navigate("/recording", { state: { autoStart: true } });
  };

  return (
    <div className="flex min-h-[100dvh] flex-col items-center justify-between px-6 pb-24 pt-20">
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center"
      >
        <p className="text-sm font-medium text-muted-foreground tracking-widest uppercase">
          今天
        </p>
        <h1 className="mt-1 text-3xl font-bold tracking-tight text-foreground">
          {format(new Date(), "MMM dd")}
        </h1>
      </motion.div>

      <div className="flex flex-col items-center gap-10"> {/* 增加容器包裹录音和文字入口 */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.15 }}
          className="flex flex-col items-center gap-5"
        >
          <RecordButton isRecording={false} onStart={handleStart} onStop={() => {}} />
          <p className="text-muted-foreground text-sm font-medium">点击开始语音复盘</p>
        </motion.div>

        {/* 3. 新增：跳转文字日记的按钮 */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.25 }}
        >
          <Button 
            variant="ghost" 
            onClick={() => navigate("/journal")}
            className="flex items-center gap-2 text-slate-400 hover:text-orange-500 hover:bg-orange-50/50 rounded-xl transition-all"
          >
            <PenLine size={16} />
            <span className="text-sm">切换到文字日记</span>
          </Button>
        </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="text-center"
      >
        {lastEntry ? (
          <p className="text-xs text-muted-foreground">
            上次记录 {format(new Date(lastEntry.createdAt), "HH:mm")}
          </p>
        ) : (
          <p className="text-xs text-muted-foreground">开始你的第一次复盘</p>
        )}
      </motion.div>

      <NavigationBar />
    </div>
  );
};

export default HomePage;