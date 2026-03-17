import { motion } from "framer-motion";

interface RecordButtonProps {
  isRecording: boolean;
  onStart: () => void;
  onStop: () => void;
}

const RecordButton = ({ isRecording, onStart, onStop }: RecordButtonProps) => {
  return (
    <div className="relative flex items-center justify-center">
      {/* Pulse rings when recording */}
      {isRecording && (
        <>
          <span className="absolute h-32 w-32 rounded-full bg-recording/20 animate-pulse-ring" />
          <span className="absolute h-32 w-32 rounded-full bg-recording/10 animate-pulse-ring [animation-delay:0.5s]" />
        </>
      )}

      <motion.button
        whileTap={{ scale: 0.92 }}
        onClick={isRecording ? onStop : onStart}
        className={`relative z-10 flex h-24 w-24 items-center justify-center rounded-full shadow-lg transition-colors duration-300 ${
          isRecording
            ? "bg-recording"
            : "bg-primary"
        }`}
      >
        {isRecording ? (
          <motion.div
            initial={{ scale: 1 }}
            animate={{ scale: [1, 1.1, 1] }}
            transition={{ repeat: Infinity, duration: 1.5 }}
            className="h-8 w-8 rounded-sm bg-primary-foreground"
          />
        ) : (
          <div className="h-8 w-8 rounded-full bg-primary-foreground" />
        )}
      </motion.button>
    </div>
  );
};

export default RecordButton;
