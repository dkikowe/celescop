import { Link, useNavigate, useParams } from "react-router";
import { HomeIcon } from "../components/icons/home-icon";
import { Button } from "../components/ui/button";
import { LoaderIcon } from "lucide-react";
import { useForm } from "react-hook-form";
import { useUpdateGoal, useGetGoal } from "../hooks/useGoal";
import { SubGoal } from "../types/goal";
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
import { useEffect } from "react";
import toast from "react-hot-toast";

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
  subGoals?: {
    id?: number;
    description: string;
    deadline: Date;
    isCompleted: boolean;
  }[];
  image: File;
  currentGoal?: any;
}

const convertDateToDeadline = (
  date: Date
): "3_MONTHS" | "6_MONTHS" | "1_YEAR" => {
  const now = new Date();
  const diffTime = date.getTime() - now.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  if (diffDays <= 90) return "3_MONTHS";
  if (diffDays <= 180) return "6_MONTHS";
  return "1_YEAR";
};

export function EditGoal() {
  const navigate = useNavigate();
  const { id } = useParams();
  const queryClient = useQueryClient();

  const { data: goal } = useGetGoal(Number(id));

  const { register, handleSubmit, setValue, watch } = useForm<Form>({
    defaultValues: {
      privacy: goal?.privacy || "PRIVATE",
      deadline: goal?.deadline || "3_MONTHS",
      urgencyLevel: goal?.urgencyLevel || "LOW",
      title: goal?.title || "",
      specific: goal?.specific || "",
      measurable: goal?.measurable || "",
      attainable: goal?.attainable || "",
      award: goal?.award || "",
      relevant: goal?.relevant || "",
      subGoals: goal?.subGoals || [],
    },
  });

  useEffect(() => {
    if (goal) {
      console.log("Goal from backend:", goal);
      setValue("title", goal.title);
      setValue("urgencyLevel", goal.urgencyLevel);
      setValue("specific", goal.specific);
      setValue("measurable", goal.measurable);
      setValue("attainable", goal.attainable);
      setValue("award", goal.award);
      setValue("relevant", goal.relevant);
      setValue("privacy", goal.privacy);
      setValue("deadline", convertDateToDeadline(new Date(goal.deadline)));
      setValue(
        "subGoals",
        goal.subGoals?.map((subGoal: SubGoal) => ({
          ...subGoal,
          deadline: subGoal.deadline ? new Date(subGoal.deadline) : new Date(),
        })) || []
      );
      setValue("currentGoal", goal);
    }
  }, [goal]);

  useEffect(() => {
    setValue(
      "description",
      `${watch("specific")}, ${watch("measurable")}, ${watch(
        "attainable"
      )}, ${watch("relevant")}\n\n${
        watch("award") ? `Награда: ${watch("award")}` : ""
      }`
    );
  }, [
    watch("specific"),
    watch("measurable"),
    watch("attainable"),
    watch("award"),
    watch("relevant"),
  ]);

  const { mutate: updateGoal, isPending } = useUpdateGoal(Number(id), () => {
    queryClient.invalidateQueries({ queryKey: ["get goals"] });
    setTimeout(() => navigate("/"), 1000);
  });

  return (
    <section className="relative pb-20">
      <Link to="/" className="p-3 flex justify-end">
        <HomeIcon />
      </Link>

      <CreateGoalTitle />

      <form
        onSubmit={handleSubmit((data) => {
          console.log("Form data before cleaning:", data);
          const { currentGoal, ...dataWithoutCurrentGoal } = data;

          if (!dataWithoutCurrentGoal.image && !currentGoal?.imageUrl) {
            toast.error("Пожалуйста, загрузите фото для цели");
            return;
          }

          if (
            !dataWithoutCurrentGoal.subGoals ||
            dataWithoutCurrentGoal.subGoals.length === 0
          ) {
            toast.error("Пожалуйста, добавьте хотя бы одну задачу");
            return;
          }

          const cleanedData = {
            ...dataWithoutCurrentGoal,
            deadline: dataWithoutCurrentGoal.deadline || "3_MONTHS",
            privacy: dataWithoutCurrentGoal.privacy || "PRIVATE",
            award: dataWithoutCurrentGoal.award,
            subGoals: dataWithoutCurrentGoal.subGoals?.map((subGoal) => ({
              description: subGoal.description,
              deadline: new Date(subGoal.deadline),
            })),
          };
          console.log("Cleaned data to send:", cleanedData);
          updateGoal({ data: cleanedData });
        })}
      >
        <section className="px-4 pt-5 flex flex-col gap-5 w-full">
          <CreateGoalTitleField register={register} />
          <CreateGoalUrgency setValue={setValue} watch={watch} />
        </section>

        <div className="bg-[#27448D] my-5 py-0.5 text-center text-white text-lg text-semibold">
          <span>Описание цели</span>
        </div>

        <section className="flex flex-col gap-5 px-4">
          <CreateGoalSpecific register={register} />
          <CreateGoalMeasurable register={register} />
          <CreateGoalAttainable register={register} />
          <CreateGoalRelevant register={register} />
          <CreateGoalDescription
            register={register}
            watch={watch}
            setValue={setValue}
          />
          <CreateGoalAward register={register} />
          <CreateGoalDeadline setValue={setValue} />
          <CreateGoalSubGoal watch={watch} setValue={setValue} />
          <CreateGoalImageField watch={watch} setValue={setValue} />
          <CreateGoalPrivacy setValue={setValue} watch={watch} />
        </section>
      </form>

      {/* Фиксированная кнопка внизу */}
      <div className="fixed flex justify-end bottom-0 left-0 right-0  p-4 z-10">
        <Button
          type="submit"
          className=""
          disabled={isPending}
          onClick={handleSubmit((data) => {
            const { currentGoal, ...dataWithoutCurrentGoal } = data;
            if (
              !dataWithoutCurrentGoal.image &&
              !watch("currentGoal")?.imageUrl
            ) {
              toast.error("Пожалуйста, загрузите фото для цели");
              return;
            }
            if (
              !dataWithoutCurrentGoal.subGoals ||
              dataWithoutCurrentGoal.subGoals.length === 0
            ) {
              toast.error("Пожалуйста, добавьте хотя бы одну задачу");
              return;
            }
            const cleanedData = {
              ...dataWithoutCurrentGoal,
              deadline: dataWithoutCurrentGoal.deadline || "3_MONTHS",
              privacy: dataWithoutCurrentGoal.privacy || "PRIVATE",
              award: dataWithoutCurrentGoal.award,
              subGoals: dataWithoutCurrentGoal.subGoals?.map((subGoal) => ({
                description: subGoal.description,
                deadline: new Date(subGoal.deadline),
              })),
            };
            updateGoal({ data: cleanedData });
          })}
        >
          {isPending && <LoaderIcon className="animate-spin mr-2" />}
          {isPending ? "Сохранение..." : "Готово"}
        </Button>
      </div>
    </section>
  );
}
