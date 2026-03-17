import { Entry, MoodType } from "@/lib/types";

const STORAGE_KEY = "voice-reflection-entries";

// Pre-seed demo data
const DEMO_ENTRIES: Entry[] = [
  {
    id: "demo-1",
    date: new Date().toISOString(),
    rawText: "今天主要在做项目的前端重构，把组件拆分得更细了。下午开了个需求评审会，讨论了下个迭代的方向。整体节奏还不错，就是有点累。明天打算先把剩下的几个页面做完。",
    summary: {
      completed: ["完成前端组件重构", "参加需求评审会议", "整理下个迭代的技术方案"],
      problems: ["部分组件性能需要优化", "需求评审中有几个点还需要再确认"],
      mood: "calm" as MoodType,
      moodNote: "整体状态平稳，虽然有些疲惫但很充实",
      plans: ["完成剩余页面开发", "跟产品确认需求细节", "做一次代码审查"],
    },
    createdAt: new Date().toISOString(),
  },
  {
    id: "demo-2",
    date: new Date(Date.now() - 86400000).toISOString(),
    rawText: "今天遇到了一个很棘手的 bug，花了大半天才定位到问题。不过最后解决的时候还是很有成就感的。晚上和同事聊了聊职业规划，收获挺多。",
    summary: {
      completed: ["修复了一个困扰两天的生产 bug", "完善了错误监控方案", "与同事交流职业发展"],
      problems: ["调试效率需要提升，花了太多时间", "文档更新滞后"],
      mood: "happy" as MoodType,
      moodNote: "虽然调试辛苦，但解决问题的成就感很棒",
      plans: ["补充技术文档", "学习新的调试工具", "整理 bug 修复经验"],
    },
    createdAt: new Date(Date.now() - 86400000).toISOString(),
  },
  {
    id: "demo-3",
    date: new Date(Date.now() - 86400000 * 2).toISOString(),
    rawText: "项目上线前最后的冲刺阶段，压力挺大的。今天加班到很晚，不过核心功能都跑通了。希望明天上线顺利。",
    summary: {
      completed: ["核心功能联调完成", "完成上线前检查清单", "准备了回滚方案"],
      problems: ["工作节奏太紧张，需要更好的时间管理", "部分边界情况未覆盖"],
      mood: "stressed" as MoodType,
      moodNote: "上线前压力较大，需要注意休息",
      plans: ["执行上线部署", "监控线上数据", "给自己放半天假"],
    },
    createdAt: new Date(Date.now() - 86400000 * 2).toISOString(),
  },
  {
    id: "demo-4",
    date: new Date(Date.now() - 86400000 * 4).toISOString(),
    rawText: "今天状态不太好，有点低落。工作上没什么大进展，感觉卡在一个技术选型的问题上。",
    summary: {
      completed: ["完成了技术选型的初步调研", "写了对比文档"],
      problems: ["技术选型还未决定", "状态不好影响了工作效率"],
      mood: "sad" as MoodType,
      moodNote: "心情低落，需要调整状态",
      plans: ["找 mentor 聊聊技术选型", "早点休息调整状态"],
    },
    createdAt: new Date(Date.now() - 86400000 * 4).toISOString(),
  },
];

function initDemoData() {
  const raw = localStorage.getItem(STORAGE_KEY);
  if (!raw || JSON.parse(raw).length === 0) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(DEMO_ENTRIES));
  }
}

// Auto-init on import
//initDemoData();

export function getEntries(): Entry[] {
  const raw = localStorage.getItem(STORAGE_KEY);
  if (!raw) return [];
  try {
    return JSON.parse(raw);
  } catch {
    return [];
  }
}

export function saveEntry(entry: Entry): void {
  const entries = getEntries();
  entries.unshift(entry);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(entries));
}

export function deleteEntry(id: string): void {
  const entries = getEntries().filter((e) => e.id !== id);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(entries));
}

export function getEntryById(id: string): Entry | undefined {
  return getEntries().find((e) => e.id === id);
}

// Random mock summaries for demo variety
const MOCK_SUMMARIES = [
  {
    completed: ["完成了产品原型设计", "与设计师对齐视觉风格", "搭建了项目基础架构"],
    problems: ["原型细节还需打磨", "设计资源不够用"],
    mood: "calm" as MoodType,
    moodNote: "有条不紊地推进中",
    plans: ["细化交互设计", "开始前端开发", "准备下周的评审"],
  },
  {
    completed: ["学习了新的框架特性", "重构了核心模块", "写了单元测试"],
    problems: ["学习曲线比预期陡峭", "测试覆盖率还不够"],
    mood: "happy" as MoodType,
    moodNote: "学到新东西的感觉真好！",
    plans: ["继续深入学习", "提高测试覆盖率", "分享学习心得"],
  },
  {
    completed: ["完成了数据迁移", "优化了查询性能", "修复了3个线上问题"],
    problems: ["数据量大导致迁移耗时长", "需要更好的监控"],
    mood: "stressed" as MoodType,
    moodNote: "任务密集，需要合理安排优先级",
    plans: ["完善监控告警", "做性能基准测试", "整理运维文档"],
  },
];

export function generateMockSummary(): Entry["summary"] {
  return MOCK_SUMMARIES[Math.floor(Math.random() * MOCK_SUMMARIES.length)];
}
