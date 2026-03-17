import { useState, useRef, useCallback, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom"; // 新增 useLocation
import { motion } from "framer-motion";
import RecordButton from "@/components/RecordButton";
import Timer from "@/components/Timer";

// ... 其他 import 保持不变

const RecordingPage = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const [isRecording, setIsRecording] = useState(false);
  const [transcript, setTranscript] = useState(""); 
  const transcriptRef = useRef("");
  
  const recognitionRef = useRef<any>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);

  // 将 startRecording 移到 useEffect 之前，或者保证它在初始化后能被调用
  const startRecording = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;

      mediaRecorder.onstop = () => {
        stream.getTracks().forEach((t) => t.stop());
        const finalText = transcriptRef.current;
        navigate("/result", { 
          state: { 
            text: finalText,
            isContinuing: true 
          } 
        });
      };

      mediaRecorder.start();
      recognitionRef.current?.start();
      setIsRecording(true);
      setTranscript("");
      transcriptRef.current = "";
    } catch (err) {
      alert("请允许麦克风权限");
    }
  }, [navigate]);

  useEffect(() => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (SpeechRecognition) {
      const recognition = new SpeechRecognition();
      recognition.continuous = true;
      recognition.interimResults = true;
      recognition.lang = "zh-CN";
      recognition.onresult = (event: any) => {
        let fullTranscript = "";
        for (let i = 0; i < event.results.length; i++) {
          fullTranscript += event.results[i][0].transcript;
        }
        setTranscript(fullTranscript);
        transcriptRef.current = fullTranscript;
      };
      recognition.onerror = (event: any) => console.error("语音识别错误:", event.error);
      recognitionRef.current = recognition;

      // --- 最小修改点：检测 autoStart 信号并自动开启 ---
      if (location.state?.autoStart) {
        startRecording();
        // 清除信号，防止刷新重复触发
        window.history.replaceState({}, document.title);
      }
      // --------------------------------------------
    }
  }, [location.state, startRecording]); // 加入依赖项

  const stopRecording = useCallback(() => {
    if (mediaRecorderRef.current?.state !== "inactive") {
      recognitionRef.current?.stop(); 
      mediaRecorderRef.current?.stop();
      setIsRecording(false);
    }
  }, []);

  return (
    // ... 剩余渲染部分保持完全不变
    <div className="flex min-h-[100dvh] flex-col items-center justify-between px-6 pb-20 pt-20">
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center max-w-md">
        <h1 className="text-xl font-semibold text-foreground mb-4">
          {isRecording ? "正在聆听…" : "继续补充内容"}
        </h1>
        {isRecording && (
          <p className="text-sm text-primary animate-pulse line-clamp-2 px-4">
            “{transcript}”
          </p>
        )}
      </motion.div>

      <div className="flex flex-col items-center gap-8">
        <RecordButton
          isRecording={isRecording}
          onStart={startRecording}
          onStop={stopRecording}
        />
        <Timer isRunning={isRecording} />
      </div>

      <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-sm text-muted-foreground">
        {isRecording ? "说完了点击结束" : "点击开始说话"}
      </motion.p>
    </div>
  );
};

export default RecordingPage;