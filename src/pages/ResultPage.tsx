import { useNavigate, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import { useState, useEffect, useRef } from "react";
import { getChatReply, summarizeConversation, ChatMessage } from "@/lib/ai";
import { saveEntry } from "@/lib/store"; 
import { Button } from "@/components/ui/button";
import { Mic, CheckCircle2 } from "lucide-react"; // 移除了不必要的图标引用
import SummaryCard from "@/components/SummaryCard";

const ResultPage = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const [displayText, setDisplayText] = useState(""); 
  const [messages, setMessages] = useState<ChatMessage[]>(() => {
    const saved = localStorage.getItem("temp_chat_history");
    return saved ? JSON.parse(saved) : [];
  });
  const [summary, setSummary] = useState<any>(null);
  const [status, setStatus] = useState<'listening' | 'thinking' | 'speaking' | 'done'>('listening');
  const [mode, setMode] = useState<'voice' | 'summary'>('voice');

  const messagesRef = useRef<ChatMessage[]>(messages);

  useEffect(() => {
    messagesRef.current = messages;
    localStorage.setItem("temp_chat_history", JSON.stringify(messages));
  }, [messages]);

  useEffect(() => {
    const handleVoicesChanged = () => window.speechSynthesis.getVoices();
    window.speechSynthesis.onvoiceschanged = handleVoicesChanged;
    handleVoicesChanged();
    return () => { window.speechSynthesis.onvoiceschanged = null; };
  }, []);

  useEffect(() => {
    if (location.state?.text) {
      handleVoiceChat(location.state.text);
      window.history.replaceState({}, document.title);
    }
  }, [location.state?.text]);

  const handleVoiceChat = async (text: string) => {
    setStatus('thinking');
    const userMessage: ChatMessage = { role: "user", content: text };
    const nextMessages = [...messagesRef.current, userMessage];
    setMessages(nextMessages);
    
    const reply = await getChatReply(nextMessages); 
    const assistantMessage: ChatMessage = { role: "assistant", content: reply };
    setMessages(prev => [...prev, assistantMessage]);
    playHumanLikeResponse(reply);
  };

  const playHumanLikeResponse = (text: string) => {
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    const synth = window.speechSynthesis;
    const voices = synth.getVoices();
    const xiaoxiao = voices.find(v => v.name.includes('Xiaoxiao')) || voices[0];
    
    if (xiaoxiao) utterance.voice = xiaoxiao;
    utterance.onboundary = (event) => {
      setDisplayText(text.substring(0, event.charIndex + event.charLength));
    };
    setStatus('speaking');
    utterance.onend = () => {
      setStatus('listening');
      setTimeout(() => setDisplayText(""), 1000);
    };
    setTimeout(() => synth.speak(utterance), 100);
  };

  const handleFinish = async () => {
    setStatus('thinking');
    const result = await summarizeConversation(messagesRef.current);
    if (result) {
      setSummary(result);
      setMode('summary');
      setStatus('done');
      localStorage.removeItem("temp_chat_history");
    }
  };

  const handleSave = () => {
    if (!summary) return;
    const entry = {
      id: crypto.randomUUID(),
      date: new Date().toISOString(),
      rawText: messagesRef.current
        .filter(m => m.role !== 'system')
        .map(m => `${m.role === 'user' ? '用户' : '教练'}: ${m.content}`)
        .join("\n"),
      summary: { ...summary, mood: summary.mood || "calm" },
      createdAt: new Date().toISOString(),
    };
    saveEntry(entry);
    navigate("/timeline");
  };

  return (
    <div className="min-h-screen bg-slate-50/30 text-slate-900 flex flex-col items-center py-12 px-6 relative overflow-x-hidden">
      {mode === 'voice' ? (
        <div className="flex flex-col items-center justify-between h-[80vh] w-full">
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center space-y-4 w-full">
            <h1 className="text-xl font-semibold text-slate-900">
              {status === 'speaking' ? "正在回应…" : "AI 语音教练"}
            </h1>
            <div className="h-12 flex items-center justify-center">
              {status === 'speaking' ? (
                <p className="text-sm text-orange-600 animate-pulse line-clamp-2 px-8 font-medium italic">“{displayText}”</p>
              ) : (
                <motion.p animate={{ opacity: [0.4, 1, 0.4] }} transition={{ repeat: Infinity, duration: 2.5 }} className="text-orange-500 font-bold text-xs tracking-widest">
                  {status === 'listening' ? "我在听，请继续..." : "正在思考..."}
                </motion.p>
              )}
            </div>
          </motion.div>

          <div className="relative flex items-center justify-center h-64 w-64">
             <motion.div animate={{ scale: status === 'speaking' ? [1, 1.1, 1] : 1 }} className="absolute w-40 h-40 bg-white shadow-xl rounded-full border border-orange-50" />
             <div className="flex items-center gap-1.5 h-24 z-10">
               {[...Array(12)].map((_, i) => (
                 <motion.div key={i} animate={{ height: status === 'speaking' ? [15, 60, 20] : [8, 12, 8], backgroundColor: status === 'speaking' ? "#f97316" : "#fed7aa" }} transition={{ repeat: Infinity, duration: 0.5, delay: i * 0.04 }} className="w-2 rounded-full" />
               ))}
             </div>
          </div>

          <div className="w-full max-w-xs space-y-4">
            {status === 'listening' && (
              <Button onClick={() => navigate("/recording", { state: { autoStart: true } })} className="w-full h-16 rounded-2xl bg-orange-500 hover:bg-orange-600 text-white text-lg font-bold shadow-lg shadow-orange-200 border-none transition-transform active:scale-95">
                <Mic className="mr-2 h-6 w-6" /> 继续补充
              </Button>
            )}
            <Button variant="ghost" onClick={handleFinish} className="w-full text-white hover:text-orange-600 py-4 text-sm font-medium">
              <CheckCircle2 className="mr-2 h-4 w-4" /> 结束复盘并生成总结
            </Button>
          </div>
        </div>
      ) : (
        /* 修改点：极简总结界面，逻辑全部委托给 SummaryCard */
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-lg flex flex-col gap-6">
          
          <SummaryCard 
            summary={summary} 
            rawText={messages.filter(m => m.role !== 'system').map(m => `${m.role === 'user' ? '用户' : '教练'}: ${m.content}`).join('\n')}
          />

          <div className="flex gap-4 w-full">
            <Button variant="outline" onClick={() => setMode('voice')} className="flex-1 py-7 rounded-2xl border-slate-200 text-slate-500 font-medium">
              重新聊聊
            </Button>
            <Button onClick={handleSave} className="flex-1 py-7 rounded-2xl bg-orange-600 text-white font-bold shadow-lg shadow-orange-100 active:scale-95 transition-transform">
              确认并存入时间轴
            </Button>
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default ResultPage;