import { Link } from "react-router";
import { HomeCreateGoal } from "../components/home/home-create-goal";
import { HomeList } from "../components/home/home-list";
import { HomeStatistics } from "../components/home/home-statistics";
import { MessageCircle, SettingsIcon } from "lucide-react";
import { useAuthStore } from "../store/auth.store";
import { useEffect, useState } from "react";
import { useInitData } from "../hooks/useInitData";
import { userService } from "../services/user.service";
import { useAuth } from "../hooks/useAuth";
import { aiService } from "@/services/ai.service";
import { Block } from "@/components/ui/block";

export function HomePage() {
  const { isAuth } = useAuthStore();
  const initData = useInitData();
  const { mutate: auth } = useAuth(undefined, false);
  const [bootstrapping, setBootstrapping] = useState<boolean>(true);

  useEffect(() => {
    // Авто-логин через Telegram initData, если пользователь уже есть
    async function tryAutoAuth() {
      if (isAuth) {
        setBootstrapping(false);
        return;
      }
      const tgId = initData?.user?.id?.toString();
      if (!tgId) {
        setBootstrapping(false);
        return;
      }
      try {
        const res = await userService.getUser(tgId);
        if (res?.data) {
          if (!initData) return;
          auth({ initData: initData });
        }
        // Убираем принудительное перенаправление на /register
        // Пользователь может остаться на главной странице
      } catch {
        // В случае ошибки просто остаёмся на странице
      } finally {
        setBootstrapping(false);
      }
    }
    tryAutoAuth();
  }, [isAuth, initData]);

  if (bootstrapping) return null;
  return (
    <section>
      <div className="px-4 flex items-end justify-between gap-1 w-full">
        <h2 className="font-bold text-lg">Статистика</h2>
        <div className="flex items-center gap-4 mt-5">
          <Link to="/chat" className="flex flex-col gap-1 items-center">
            <MessageCircle color="#27448D" size={36} />
            <span className="text-xs">Чат</span>
          </Link>
          <Link to="/settings" className="flex flex-col gap-1 items-center">
            <SettingsIcon color="#27448D" size={36} />
            <span className="text-xs">Настройки</span>
          </Link>
        </div>
      </div>
      <HomeStatistics />
      {isAuth ? (
        <>
          <HomeList />
          <WeeklyReportSection />
        </>
      ) : (
        <div className="flex flex-col items-center justify-center py-8 px-4">
          <h3 className="text-lg font-semibold mb-4 text-center">
            Добро пожаловать! Для начала работы зарегистрируйтесь
          </h3>
          <Link
            to="/register"
            className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-6 rounded-lg transition-colors"
          >
            Зарегистрироваться
          </Link>
        </div>
      )}
      {isAuth && (
        <HomeCreateGoal className="fixed bottom-5 right-5 [&_button]:aspect-square [&_button]:px-3 [&_button]:py-1 text-4xl [&_button]:flex [&_button]:items-center [&_button]:justify-center" />
      )}
    </section>
  );
}

function WeeklyReportSection() {
  const [text, setText] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const data = await aiService.getWeeklyReport();
        console.log("[AI] /ai/goal/weekly-report <- response (Home):", data);
        const t = typeof data === "string" ? data : data?.text || "";
        if (mounted) setText(t);
      } finally {
        if (mounted) setLoading(false);
      }
    })();
    return () => {
      mounted = false;
    };
  }, []);

  return (
    <div className="mt-6 px-4 pb-24">
      <Block title="Отчёт недели от ИИ">
        <div className="px-4 w-full">
          {loading ? (
            <div className="text-gray-500">Генерация отчета...</div>
          ) : text ? (
            <div className="whitespace-pre-wrap text-gray-800 leading-relaxed">
              {text}
            </div>
          ) : null}
        </div>
      </Block>
    </div>
  );
}
