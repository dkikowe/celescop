import {
  UseFormRegister,
  UseFormWatch,
  UseFormSetValue,
} from "react-hook-form";
import { Block } from "../ui/block";
import { Button } from "../ui/button";
import { useEffect, useMemo, useState } from "react";
import { aiService } from "@/services/ai.service";

export function CreateGoalDescription({
  register,
  watch,
  setValue,
  disableAutoGenerate = false,
}: {
  register: UseFormRegister<any>;
  watch: UseFormWatch<any>;
  setValue: UseFormSetValue<any>;
  disableAutoGenerate?: boolean;
}) {
  const [isLoading, setIsLoading] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [originalDescription, setOriginalDescription] = useState<string>("");
  const smartFilled = useMemo(() => {
    const required = [
      watch("title"),
      watch("specific"),
      watch("measurable"),
      watch("attainable"),
      watch("relevant"),
    ];
    return required.every((v) => typeof v === "string" && v.trim().length > 0);
  }, [
    watch("title"),
    watch("specific"),
    watch("measurable"),
    watch("attainable"),
    watch("relevant"),
  ]);

  const handleGenerate = async () => {
    try {
      setIsLoading(true);
      const title = watch("title") as string;
      const contextParts = [
        watch("specific"),
        watch("measurable"),
        watch("attainable"),
        watch("relevant"),
      ].filter(Boolean);
      const context = contextParts.join("\n");
      const text = await aiService.generateGoalDescription({ title, context });
      console.log("[AI] /ai/goal/description <- response:", { text });
      setValue("description", text, { shouldDirty: true });
      setOriginalDescription(text);
    } catch (e) {
      // Ошибка покажется через axios interceptor/toast
    } finally {
      setIsLoading(false);
    }
  };

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleSave = () => {
    setIsEditing(false);
  };

  const handleCancel = () => {
    setValue("description", originalDescription, { shouldDirty: true });
    setIsEditing(false);
  };

  // Автогенерация при заполненных SMART полях (с дебаунсом)
  useEffect(() => {
    if (disableAutoGenerate || !smartFilled) return;
    const t = setTimeout(() => {
      handleGenerate();
    }, 600);
    return () => clearTimeout(t);
  }, [
    disableAutoGenerate,
    smartFilled,
    watch("title"),
    watch("specific"),
    watch("measurable"),
    watch("attainable"),
    watch("relevant"),
  ]);

  // Отслеживаем изменения описания для сохранения оригинального текста
  useEffect(() => {
    const currentDescription = watch("description");
    if (currentDescription) {
      setOriginalDescription(currentDescription);
    }
  }, [watch("description")]);

  return (
    <Block title="Полное описание цели:">
      <div className="w-full px-4">
        <textarea
          {...register("description")}
          required
          readOnly={!isEditing}
          className={`border-b-1 border-[#2F51A8] w-full h-40 outline-none resize-none ${
            isEditing ? "bg-white" : "bg-gray-50"
          }`}
        />

        <div className="flex justify-between items-center mt-3">
          {isLoading && (
            <div className="text-sm text-gray-500">Генерация...</div>
          )}

          <div className="flex gap-2 ml-auto">
            {!isEditing ? (
              <Button
                type="button"
                onClick={handleEdit}
                className="px-4 py-1 text-sm"
              >
                Редактировать
              </Button>
            ) : (
              <>
                <Button
                  type="button"
                  onClick={handleSave}
                  className="px-4 py-1 text-sm"
                >
                  Сохранить
                </Button>
                <Button
                  type="button"
                  onClick={handleCancel}
                  className="px-4 py-1 text-sm bg-gray-500 hover:bg-gray-600"
                >
                  Отмена
                </Button>
              </>
            )}
          </div>
        </div>
      </div>
    </Block>
  );
}
