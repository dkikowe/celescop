import { useEffect, useMemo, useRef, useState } from "react";
import { aiService } from "@/services/ai.service";
import { goalService } from "@/services/goal.service";
import { Button } from "@/components/ui/button";
import { Link } from "react-router";
import { Send } from "lucide-react";
import { useAuthStore } from "@/store/auth.store";

interface Message {
  role: "user" | "assistant";
  content: string;
}

export function ChatAI() {
  const { user } = useAuthStore();
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [goals, setGoals] = useState<any[]>([]);
  const [selectedGoalTitle, setSelectedGoalTitle] = useState<string>("");
  const bottomRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    goalService
      .getGoals()
      .then((res) => setGoals(res.data || []))
      .catch(() => {});
  }, []);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const context = useMemo(() => {
    const prepared = goals?.map((g: any) => ({
      id: g.id,
      title: g.title,
      description: g.description,
      progress: {
        completed: g.completedSubGoalsCount || 0,
        total: g.subGoalsCount || 0,
      },
      subGoals: (g.subGoals || []).map((s: any) => ({
        description: s.description,
        done: !!s.isCompleted,
      })),
    }));
    // Если выбрана фокусная цель — переносим её первой и добавим подсказку в начало истории
    const focused = selectedGoalTitle
      ? prepared.sort((a: any, b: any) =>
          a.title === selectedGoalTitle
            ? -1
            : b.title === selectedGoalTitle
            ? 1
            : 0
        )
      : prepared;
    return { goals: focused };
  }, [goals]);

  const send = async () => {
    if (!input.trim()) return;
    const question = input.trim();
    setMessages((prev) => [...prev, { role: "user", content: question }]);
    setInput("");
    try {
      setIsLoading(true);
      const history = messages.slice(-10);
      const answer = await aiService.chatAboutGoals({
        question,
        focus: selectedGoalTitle || undefined,
        context,
        history,
      });
      setMessages((prev) => [...prev, { role: "assistant", content: answer }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <section className="flex flex-col h-[100dvh]">
      <div className="p-3 border-b flex items-center gap-3">
        <Link
          to="/"
          className="w-9 h-9 rounded-full bg-[#2F51A8] text-white flex items-center justify-center"
          aria-label="Назад"
          title="Назад"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <polyline points="15 18 9 12 15 6"></polyline>
          </svg>
        </Link>
        <h2 className="font-semibold">Чат с ИИ</h2>
        <div className="ml-auto flex items-center gap-2">
          <label className="text-sm text-gray-600">Фокус:</label>
          <select
            value={selectedGoalTitle}
            onChange={(e) => setSelectedGoalTitle(e.target.value)}
            className="border rounded px-2 py-1 text-sm"
          >
            <option value="">Все цели</option>
            {goals?.map((g: any) => (
              <option key={g.id ?? g.title} value={g.title}>
                {g.title}
              </option>
            ))}
          </select>
        </div>
      </div>
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {messages.map((m, i) => (
          <div
            key={i}
            className={`flex gap-2 ${
              m.role === "user" ? "justify-end" : "justify-start"
            }`}
          >
            {m.role === "assistant" && (
              <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center text-xs select-none">
                AI
              </div>
            )}
            <div
              className={`max-w-[80%] px-3 py-2 rounded-lg ${
                m.role === "user" ? "bg-[#2F51A8] text-white" : "bg-gray-100"
              }`}
            >
              {m.content}
            </div>
            {m.role === "user" && (
              <img
                src={user?.photoUrl || "/logo.png"}
                alt="user"
                className="w-8 h-8 rounded-full object-cover"
              />
            )}
          </div>
        ))}
        {isLoading && (
          <div className="text-left">
            <div className="inline-block px-3 py-2 rounded-lg bg-gray-100">
              Печатает...
            </div>
          </div>
        )}
        <div ref={bottomRef} />
      </div>
      <div className="p-3 border-t flex gap-2">
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Задайте вопрос по своим целям"
          className="flex-1 border rounded px-3 py-2 outline-none min-h-24 max-h-48 resize-y"
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              send();
            }
          }}
        />
        <Button
          type="button"
          onClick={send}
          disabled={isLoading}
          className="!p-0 w-11 h-11 rounded-full flex items-center justify-center bg-[#2F51A8] text-white relative -top-1 hover:bg-[#1f3a78] active:opacity-90 transition-colors"
          aria-label="Отправить"
          title="Отправить"
        >
          <Send size={18} />
        </Button>
      </div>
    </section>
  );
}

export default ChatAI;
