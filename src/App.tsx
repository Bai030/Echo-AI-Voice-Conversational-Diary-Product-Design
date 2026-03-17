import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import HomePage from "./pages/HomePage";
import RecordingPage from "./pages/RecordingPage";
import ProcessingPage from "./pages/ProcessingPage";
import ResultPage from "./pages/ResultPage";
import TimelinePage from "./pages/TimelinePage";
import EntryDetailPage from "./pages/EntryDetailPage";
import NotFound from "./pages/NotFound";
// ... 之前的 import 保持不变
import JournalPage from "./pages/JournalPage"; // 1. 引入新创建的页面

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <div className="mx-auto max-w-md">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/recording" element={<RecordingPage />} />
            <Route path="/journal" element={<JournalPage />} /> {/* 2. 添加日记输入路由 */}
            <Route path="/processing" element={<ProcessingPage />} />
            <Route path="/result" element={<ResultPage />} />
            <Route path="/timeline" element={<TimelinePage />} />
            <Route path="/entry/:id" element={<EntryDetailPage />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </div>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
