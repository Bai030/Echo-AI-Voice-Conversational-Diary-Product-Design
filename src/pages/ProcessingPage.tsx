import { useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom"; // 1. 引入 useLocation
import { motion } from "framer-motion";
import ProcessingSpinner from "@/components/ProcessingSpinner";

const ProcessingPage = () => {
  const navigate = useNavigate();
  const location = useLocation(); // 2. 获取位置对象

  useEffect(() => {
    // 从 location.state 中提取之前录音转好的文字
    // 如果没有文字（比如直接刷新页面进来的），给一个默认占位符
    const transcript = location.state?.text || "";

    // Simulate AI processing
    const timer = setTimeout(() => {
      // 3. 修改跳转路径：将文字传递给结果页 /result
      navigate("/result", { state: { text: transcript } });
    }, 2500);
    
    return () => clearTimeout(timer);
  }, [navigate, location.state]); // 增加依赖项

  return (
    <div className="flex min-h-[100dvh] flex-col items-center justify-center px-6">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="flex flex-col items-center gap-4"
      >
        <h1 className="text-xl font-semibold text-foreground">正在总结…</h1>
        <ProcessingSpinner />
      </motion.div>
    </div>
  );
};

export default ProcessingPage;