import { useContext, useEffect, useState } from "react";
import { Button } from "../ui/button";
import { DialogContext } from "../ui/dialog";
import { useCompleteGoal } from "../../hooks/useGoal";
import { AchievementPopup } from "../AchievementPopup";

export function HomeCompleteGoal({
  goalId,
  award,
}: {
  goalId: number;
  award?: string;
}) {
  const dialogContextValues = useContext(DialogContext);
  const closeDialog = dialogContextValues?.closeDialog;
  const [showAchievement, setShowAchievement] = useState(false);
  const [savedAward, setSavedAward] = useState<string | undefined>(award);
  const {
    mutate: completeGoal,
    isPending,
    isSuccess,
  } = useCompleteGoal(goalId);

  // Сохраняем награду при первом рендере
  useEffect(() => {
    setSavedAward(award);
  }, []);

  useEffect(() => {
    if (isSuccess) {
      setShowAchievement(true);
      // // Триггер: цель завершена (отключено)
      // (async () => {
      //   try {
      //     const text = await aiService.triggerMessage({
      //       type: "GOAL_COMPLETED",
      //       goalTitle,
      //     });
      //     console.log("[AI notify] GOAL_COMPLETED <-", text);
      //     notify.show(text);
      //   } catch {}
      // })();
      setTimeout(() => {
        setShowAchievement(false);
        closeDialog?.();
      }, 5000);
    }
  }, [isSuccess]);

  return (
    <>
      <Button
        disabled={isPending}
        onClick={() => document.getElementById("confirm-image")?.click()}
      >
        {isPending ? "Обработка..." : "Загрузить фото"}
      </Button>
      <input
        type="file"
        name="confirm-image"
        id="confirm-image"
        className="hidden"
        onChange={(e) => completeGoal(e.target.files?.[0])}
      />
      <AchievementPopup
        isOpen={showAchievement}
        onClose={() => setShowAchievement(false)}
        award={savedAward}
      />
    </>
  );
}
