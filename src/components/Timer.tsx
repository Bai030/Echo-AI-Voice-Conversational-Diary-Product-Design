import { useEffect, useState } from "react";

interface TimerProps {
  isRunning: boolean;
  onTimeUpdate?: (seconds: number) => void;
}

const Timer = ({ isRunning, onTimeUpdate }: TimerProps) => {
  const [seconds, setSeconds] = useState(0);

  useEffect(() => {
    if (!isRunning) {
      setSeconds(0);
      return;
    }
    const interval = setInterval(() => {
      setSeconds((s) => {
        const next = s + 1;
        onTimeUpdate?.(next);
        return next;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [isRunning, onTimeUpdate]);

  const mins = Math.floor(seconds / 60).toString().padStart(2, "0");
  const secs = (seconds % 60).toString().padStart(2, "0");

  return (
    <span className="font-mono text-4xl tracking-widest text-foreground/80">
      {mins}:{secs}
    </span>
  );
};

export default Timer;
