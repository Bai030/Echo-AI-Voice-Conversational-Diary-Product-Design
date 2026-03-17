import { useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft, Trash2 } from "lucide-react";
import { format } from "date-fns";
import SummaryCard from "@/components/SummaryCard";
import { getEntryById, deleteEntry } from "@/lib/store";
import { Button } from "@/components/ui/button";

// ... 前面 import 保持不变

const EntryDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const entry = id ? getEntryById(id) : undefined;

  if (!entry) {
    return (
      <div className="flex min-h-[100dvh] items-center justify-center">
        <p className="text-muted-foreground">记录未找到</p>
      </div>
    );
  }

  const handleDelete = () => {
    if (confirm("确定要删除这条记录吗？")) {
      deleteEntry(entry.id);
      navigate("/timeline");
    }
  };

  return (
    <div className="min-h-[100dvh] px-6 pb-10 pt-6">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="mb-6 flex items-center justify-between"
      >
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-1 text-primary"
        >
          <ArrowLeft size={20} />
          <span className="text-sm font-medium">返回</span>
        </button>
        <h1 className="text-lg font-semibold text-foreground">
          {format(new Date(entry.date), "MMM dd")} 详情
        </h1>
        <div className="w-14" />
      </motion.div>

      {/* 修改点 1：传入 rawText 属性 */}
      <SummaryCard summary={entry.summary} rawText={entry.rawText} />

      {/* 修改点 2：删掉了原来的“原始转写”平铺区块，因为它现在已经由 SummaryCard 内部处理了 */}

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
        className="mt-8"
      >
        <Button
          variant="outline"
          onClick={handleDelete}
          className="w-full rounded-xl py-6 text-destructive border-destructive/30"
        >
          <Trash2 size={16} className="mr-2" />
          删除记录
        </Button>
      </motion.div>
    </div>
  );
};

export default EntryDetailPage;
