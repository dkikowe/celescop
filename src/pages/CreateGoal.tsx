import { Link, useNavigate } from "react-router";
import { HomeIcon } from "../components/icons/home-icon";
import { Button } from "../components/ui/button";
import { LoaderIcon } from "lucide-react";
import { useForm } from "react-hook-form";
import { useCreateGoal } from "../hooks/useGoal";
import toast from "react-hot-toast";
import {
  CreateGoalTitle,
  CreateGoalAttainable,
  CreateGoalAward,
  CreateGoalDeadline,
  CreateGoalDescription,
  CreateGoalMeasurable,
  CreateGoalPrivacy,
  CreateGoalRelevant,
  CreateGoalSpecific,
  CreateGoalSubGoal,
  CreateGoalTitleField,
  CreateGoalUrgency,
  CreateGoalImageField,
} from "../components/create-goal";
import { useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { aiService } from "@/services/ai.service";

interface Form {
  title: string;
  urgencyLevel: "LOW" | "AVERAGE" | "HIGH";
  specific: string;
  measurable: string;
  attainable: string;
  award: string;
  description: string;
  relevant: string;
  privacy: "PRIVATE" | "PUBLIC";
  deadline: "3_MONTHS" | "6_MONTHS" | "1_YEAR";
  subGoals?: { description: string; deadline: Date }[];
  image?: File;
  template?:
    | "Похудеть"
    | "Заработать"
    | "Купить ценную вещь"
    | "Путешествие"
    | "Изучить что то новое";
  shortDescription?: string;
}

export function CreateGoal() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { register, handleSubmit, setValue, watch, reset } = useForm<Form>({
    defaultValues: {
      privacy: "PRIVATE",
      deadline: "3_MONTHS",
      urgencyLevel: "LOW",
    },
  });

  // Описание теперь генерируется только через ИИ (см. компонент CreateGoalDescription)

  const { mutate: createGoal, isPending } = useCreateGoal(() => {
    reset();
    queryClient.invalidateQueries({ queryKey: ["get goals"] });
    setTimeout(() => navigate("/"), 1000);
  });

  const handleFormSubmit = (data: Form) => {
    console.log("Form data before cleaning:", data);

    if (!data.subGoals || data.subGoals.length === 0) {
      toast.error("Пожалуйста, добавьте хотя бы одну задачу");
      return;
    }

    const cleanedData = {
      ...data,
      description: data.description,
      award: data.award ? `Награда: ${data.award}` : undefined,
      subGoals: data.subGoals?.map((subGoal) => ({
        description: subGoal.description,
        deadline: subGoal.deadline,
      })),
      source: data.template ? "template" : undefined,
      // Убираем template из данных если он пустой
      ...(data.template ? { template: data.template } : {}),
    };

    // Удаляем template из финальных данных если он пустой
    if (!data.template) {
      delete cleanedData.template;
    }

    console.log("Cleaned data to send:", cleanedData);
    createGoal({
      data: cleanedData,
    });
  };

  return (
    <section className="relative pb-20">
      <Link to="/" className="p-3 flex justify-end">
        <HomeIcon />
      </Link>

      <CreateGoalTitle />

      <form onSubmit={handleSubmit(handleFormSubmit)}>
        <section className="px-4 pt-5 flex flex-col gap-5 w-full">
          <CreateGoalTitleField register={register} />
          <div className="bg-white rounded-md border p-4">
            <label className="block mb-2 text-sm text-gray-600">Шаблон</label>
            <select
              {...register("template")}
              className="w-full border rounded px-3 py-2"
            >
              <option value="">Без шаблона</option>
              <option value="Похудеть">Похудеть</option>
              <option value="Заработать">Заработать</option>
              <option value="Купить ценную вещь">Купить ценную вещь</option>
              <option value="Путешествие">Путешествие</option>
              <option value="Изучить что то новое">Изучить что то новое</option>
            </select>
            {watch("template") && (
              <div className="mt-3">
                <label className="block mb-2 text-sm text-gray-600">
                  Короткое описание
                </label>
                <input
                  type="text"
                  {...register("shortDescription")}
                  placeholder="Например: похудеть к лету на 5 кг"
                  className="w-full border rounded px-3 py-2"
                />
                <TemplateGoalGenerator watch={watch} setValue={setValue} />
              </div>
            )}
          </div>
          <CreateGoalUrgency setValue={setValue} watch={watch} />
        </section>

        <div className="bg-[#27448D] my-5 py-0.5 text-center text-white text-lg text-semibold">
          <span>Описание цели</span>
        </div>

        <section className="flex flex-col gap-5 px-4">
          {!watch("template") && (
            <>
              <CreateGoalSpecific register={register} />
              <CreateGoalMeasurable register={register} />
              <CreateGoalAttainable register={register} />
              <CreateGoalRelevant register={register} />
              <CreateGoalAward register={register} />
            </>
          )}
          <CreateGoalDescription
            register={register}
            watch={watch}
            setValue={setValue}
          />
          <CreateGoalDeadline setValue={setValue} />
          <CreateGoalSubGoal watch={watch} setValue={setValue} />
          <CreateGoalImageField watch={watch} setValue={setValue} />
          <CreateGoalPrivacy setValue={setValue} watch={watch} />
        </section>

        {/* Фиксированная кнопка внизу */}
        <div className="fixed flex justify-end bottom-0 left-0 right-0  p-4 z-10">
          <Button type="submit" className="" disabled={isPending}>
            {isPending && <LoaderIcon className="animate-spin mr-2" />}
            {isPending ? "Сохранение..." : "Готово"}
          </Button>
        </div>
      </form>
    </section>
  );
}

function TemplateGoalGenerator({
  watch,
  setValue,
}: {
  watch: any;
  setValue: any;
}) {
  const [isGenerating, setIsGenerating] = useState(false);
  const [hasGenerated, setHasGenerated] = useState(false);

  return (
    <div className="flex justify-between items-center">
      {isGenerating && (
        <span className="text-sm text-gray-500">Генерация...</span>
      )}
      <Button
        type="button"
        className="mt-4"
        onClick={async () => {
          try {
            setIsGenerating(true);
            // Если уже генерировали — очистим поля перед повторной генерацией
            if (hasGenerated) {
              setValue("description", "", { shouldDirty: true });
              setValue("subGoals", [], { shouldDirty: true });
            }
            const deadlineEnum = watch("deadline");
            const deadline =
              deadlineEnum === "3_MONTHS"
                ? "3 месяца"
                : deadlineEnum === "6_MONTHS"
                ? "6 месяцев"
                : deadlineEnum === "1_YEAR"
                ? "1 год"
                : undefined;
            // const maxItems =
            //   deadlineEnum === "1_YEAR"
            //     ? 12
            //     : deadlineEnum === "6_MONTHS"
            //     ? 10
            //     : 6;
            const resp = await aiService.generateGoalFromTemplate({
              template: watch("template")!,
              deadline,
              shortDescription: watch("shortDescription"),
            });
            console.log("[AI] /ai/goal/template <- response:", resp);
            if (resp.description)
              setValue("description", resp.description as any, {
                shouldDirty: true,
              });
            if (resp.tasks?.length) {
              const mapped = resp.tasks.map((t: any) => {
                if (typeof t === "string")
                  return {
                    description: t,
                    deadline: new Date(),
                    aiGenerated: true,
                  };
                return {
                  description: t.description,
                  deadline: t.deadline ? new Date(t.deadline) : new Date(),
                  aiGenerated: true,
                };
              });
              setValue("subGoals", mapped as any, { shouldDirty: true });
            }
            setHasGenerated(true);
            toast.success("Цель сгенерирована");
          } catch (e) {
          } finally {
            setIsGenerating(false);
          }
        }}
        disabled={isGenerating}
      >
        {isGenerating
          ? "Генерация..."
          : hasGenerated
          ? "Сгенерировать ещё раз"
          : "Сгенерировать цель"}
      </Button>
    </div>
  );
}
