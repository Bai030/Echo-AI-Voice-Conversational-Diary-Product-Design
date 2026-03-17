import { useNavigate, useLocation } from "react-router-dom";
import { Home, Clock } from "lucide-react";

const NavigationBar = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const isHome = location.pathname === "/";
  const isTimeline = location.pathname === "/timeline";

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 border-t border-border bg-background/80 backdrop-blur-xl">
      <div className="mx-auto flex max-w-md items-center justify-around py-2 pb-[max(0.5rem,env(safe-area-inset-bottom))]">
        <button
          onClick={() => navigate("/")}
          className={`flex flex-col items-center gap-0.5 px-6 py-1.5 transition-colors ${
            isHome ? "text-primary" : "text-muted-foreground"
          }`}
        >
          <Home size={22} />
          <span className="text-[10px] font-medium">首页</span>
        </button>
        <button
          onClick={() => navigate("/timeline")}
          className={`flex flex-col items-center gap-0.5 px-6 py-1.5 transition-colors ${
            isTimeline ? "text-primary" : "text-muted-foreground"
          }`}
        >
          <Clock size={22} />
          <span className="text-[10px] font-medium">时间线</span>
        </button>
      </div>
    </nav>
  );
};

export default NavigationBar;
