import { Route, Routes, useLocation, useNavigate } from "react-router";
import { useEffect, useState } from "react";
import { useAuthStore } from "./store/auth.store";
import { useInitData } from "./hooks/useInitData";
import { useAuth, useRefresh } from "./hooks/useAuth";

import { SettingsPage } from "./pages/SettingsPage";
import { PrivacyPolicyPage } from "./pages/PrivacyPolicy";
import { HomePage } from "./pages/Home";
import { RegisterPage } from "./pages/Register";
import { PersonalDataAgreementPage } from "./pages/PersonalDataAgreement";
import { HelloPage } from "./pages/HelloPage";
import { LoginPage } from "./pages/Login";
import { CreateGoal } from "./pages/CreateGoal";
import { EditGoal } from "./pages/EditGoal";
import { friendshipService } from "./services/friendship.service";
import ChatAI from "./pages/ChatAI";
import { ToastHost } from "./components/ui/toast-host";

function App() {
  const { isAuth } = useAuthStore();
  const location = useLocation();
  const navigate = useNavigate();
  const initData = useInitData();
  const [isInitializing, setIsInitializing] = useState(true);

  const authMutation = useAuth(() => {
    setIsInitializing(false);
  }, false);

  const refreshMutation = useRefresh();

  // Автоматическая аутентификация при инициализации
  useEffect(() => {
    const initializeAuth = async () => {
      // Сначала проверяем, есть ли сохраненный токен
      const token = localStorage.getItem("accessToken");
      if (token && !isAuth) {
        // Пытаемся обновить токен
        try {
          await refreshMutation.mutateAsync();
        } catch (error) {
          console.error("Ошибка обновления токена:", error);
          // Если токен недействителен, пробуем авторизоваться заново
          if (initData) {
            try {
              await authMutation.mutateAsync({ initData });
            } catch (authError) {
              console.error("Ошибка автоматической аутентификации:", authError);
            }
          }
        }
      } else if (initData && !isAuth) {
        // Если нет токена, но есть данные Telegram, авторизуемся
        try {
          await authMutation.mutateAsync({ initData });
        } catch (error) {
          console.error("Ошибка автоматической аутентификации:", error);
        }
      }
      setIsInitializing(false);
    };

    initializeAuth();
  }, [initData, isAuth]);

  useEffect(() => {
    const inviteCode = window?.Telegram?.WebApp?.initDataUnsafe?.start_param;
    if (!inviteCode?.includes("invite")) return;

    const inviteId = inviteCode.split("_")[1];

    async function createFriendship() {
      if (isAuth && inviteId.length) {
        await friendshipService.createFriendship(inviteId);
      }
    }

    createFriendship();
  }, [isAuth]);

  // Убираем принудительное перенаправление на /login
  // Пользователи всегда могут видеть главную страницу

  // Перенаправляем на главную страницу после успешной аутентификации только с страниц логина и регистрации
  useEffect(() => {
    if (
      isAuth &&
      (location.pathname === "/login" || location.pathname === "/register")
    ) {
      navigate("/");
    }
  }, [isAuth, location.pathname, navigate]);

  useEffect(() => {
    if (sessionStorage.getItem("helloShown") !== "true") navigate("/hello");
  }, [sessionStorage.getItem("helloShown")]);

  // Лог недельного отчёта при входе в приложение (хук должен вызываться безусловно)

  // Показываем загрузку во время инициализации
  if (isInitializing) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Загрузка...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <ToastHost />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/hello" element={<HelloPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/settings" element={<SettingsPage />} />
        <Route path="/privacy-policy" element={<PrivacyPolicyPage />} />
        <Route path="/create-goal" element={<CreateGoal />} />
        <Route path="/edit-goal/:id" element={<EditGoal />} />
        <Route path="/chat" element={<ChatAI />} />
        <Route
          path="/personal-data-agreement"
          element={<PersonalDataAgreementPage />}
        />
      </Routes>
    </>
  );
}

export default App;
