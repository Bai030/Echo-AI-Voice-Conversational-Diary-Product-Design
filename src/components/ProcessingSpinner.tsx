import { motion } from "framer-motion";

const ProcessingSpinner = () => {
  return (
    <div className="flex flex-col items-center gap-8">
      <div className="flex gap-2">
        {[0, 1, 2, 3, 4, 5].map((i) => (
          <motion.div
            key={i}
            className="h-2.5 w-2.5 rounded-full bg-primary"
            animate={{ y: [-4, 4, -4], opacity: [0.4, 1, 0.4] }}
            transition={{
              repeat: Infinity,
              duration: 1.2,
              delay: i * 0.15,
              ease: "easeInOut",
            }}
          />
        ))}
      </div>
      <p className="text-muted-foreground text-lg">整理你的思绪中…</p>
    </div>
  );
};

export default ProcessingSpinner;
