import { CheckIcon, EditIcon, XIcon, Calendar } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { UseFormSetValue, UseFormWatch } from "react-hook-form";

import Popup from "reactjs-popup";
import { Block } from "../ui/block";
import { Button } from "../ui/button";
import { aiService } from "@/services/ai.service";

export function CreateGoalSubGoal({
  watch,
  setValue,
}: {
  watch: UseFormWatch<any>;
  setValue: UseFormSetValue<any>;
}) {
  const [subGoalTemp, setSubGoalTemp] = useState<string>("");
  const [subGoalDateTemp, setSubGoalDateTemp] = useState<Date | null>(
    new Date()
  );
  const [subGoalCreateOpen, setSubGoalCreateOpen] = useState<boolean>(false);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [manualDateText, setManualDateText] = useState<string>("");
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [hasGenerated, setHasGenerated] = useState<boolean>(false);
  const createDateInputRef = useRef<HTMLInputElement | null>(null);

  const formatDateToManual = (date: Date): string => {
    const pad = (n: number) => (n < 10 ? `0${n}` : `${n}`);
    const dd = pad(date.getDate());
    const mm = pad(date.getMonth() + 1);
    const yyyy = date.getFullYear();
    const hh = pad(date.getHours());
    const min = pad(date.getMinutes());
    return `${dd}:${mm}:${yyyy} ${hh}:${min}`;
  };

  const formatDigitsToManual = (digits: string): string => {
    let out = "";
    for (let i = 0; i < digits.length && i < 12; i++) {
      out += digits[i];
      if (i === 1 || i === 3) out += ":";
      if (i === 7) out += " ";
      if (i === 9) out += ":";
    }
    return out;
  };

  const formatManualInput = (raw: string): string => {
    const digits = raw.replace(/\D/g, "");
    return formatDigitsToManual(digits);
  };

  const tryParseManual = (text: string): Date | null => {
    const m = text.match(/^(\d{2}):(\d{2}):(\d{4}) (\d{2}):(\d{2})$/);
    if (!m) return null;
    const [, ddStr, mmStr, yyyyStr, hhStr, minStr] = m;
    const dd = Number(ddStr);
    const mm = Number(mmStr);
    const yyyy = Number(yyyyStr);
    const hh = Number(hhStr);
    const min = Number(minStr);
    if (mm < 1 || mm > 12 || dd < 1 || dd > 31 || hh > 23 || min > 59)
      return null;
    const d = new Date(yyyy, mm - 1, dd, hh, min);
    return isNaN(d.getTime()) ? null : d;
  };

  const updateEditingSubGoal = (
    partial: Partial<{ description: string; deadlineYmd: string }>
  ) => {
    if (editingIndex === null) return;
    const subGoals = (watch("subGoals") || []) as any[];
    const updated = subGoals.map((sg, i) =>
      i === editingIndex
        ? {
            ...sg,
            ...(partial.description !== undefined
              ? { description: partial.description }
              : {}),
            ...(partial.deadlineYmd !== undefined
              ? { deadline: partial.deadlineYmd }
              : {}),
          }
        : sg
    );
    setValue("subGoals", updated, { shouldDirty: true, shouldTouch: true });
    try {
      console.log(
        "[CreateGoalSubGoal] typing -> subGoals:",
        updated.map((s: any) => ({
          description: s.description,
          deadline: s.deadline,
        }))
      );
    } catch {}
  };

  useEffect(() => {
    setSubGoalCreateOpen(false);
  }, [watch("subGoals")]);

  const handleAddSubGoal = () => {
    const subGoals = watch("subGoals") || [];
    const next = [
      ...subGoals,
      {
        description: subGoalTemp,
        deadline: (() => {
          const d = subGoalDateTemp || new Date();
          const pad = (n: number) => (n < 10 ? `0${n}` : `${n}`);
          return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(
            d.getDate()
          )}`;
        })(),
      },
    ];
    setValue("subGoals", next, { shouldDirty: true, shouldTouch: true });
    try {
      console.log(
        "[CreateGoalSubGoal] add -> subGoals:",
        next.map((s: any) => ({
          description: s.description,
          deadline: s.deadline,
        }))
      );
    } catch {}
    setSubGoalTemp("");
    setSubGoalDateTemp(new Date());
    setSubGoalCreateOpen(false);
  };

  const handleGenerateTasks = async () => {
    // Если уже генерировали ранее — очистим ранее сгенерированные задачи
    if (hasGenerated) {
      const keep = (watch("subGoals") || []).filter(
        (sg: any) => !sg.aiGenerated
      );
      setValue("subGoals", keep);
    }
    const title = watch("title") as string;
    const context = watch("description") as string;
    const deadlineEnum = watch("deadline") as string;
    const deadline =
      deadlineEnum === "3_MONTHS"
        ? "3 месяца"
        : deadlineEnum === "6_MONTHS"
        ? "6 месяцев"
        : deadlineEnum === "1_YEAR"
        ? "1 год"
        : undefined;
    const maxItems =
      deadlineEnum === "1_YEAR" ? 12 : deadlineEnum === "6_MONTHS" ? 10 : 6;
    try {
      setIsGenerating(true);
      const tasks = await aiService.generateTasks({
        title,
        context,
        maxItems,
        deadline,
      });
      console.log("[AI] /ai/goal/tasks <- response:", { tasks });
      const existing = watch("subGoals") || [];
      const mapped = tasks.map((t) => {
        if (typeof t === "string") {
          return { description: t, deadline: new Date(), aiGenerated: true };
        }
        const deadline = t.deadline ? new Date(t.deadline) : new Date();
        return { description: t.description, deadline, aiGenerated: true };
      });
      setHasGenerated(true);
      setValue("subGoals", [...existing, ...mapped]);
    } catch (e) {
      // Ошибка покажется через interceptor
    } finally {
      setIsGenerating(false);
    }
  };

  const handleRemoveSubGoal = (index: number) => {
    const value = watch("subGoals")?.filter((_: any, i: number) => i !== index);
    setValue("subGoals", value, { shouldDirty: true, shouldTouch: true });
    try {
      console.log(
        "[CreateGoalSubGoal] remove -> subGoals:",
        (value || []).map((s: any) => ({
          description: s.description,
          deadline: s.deadline,
        }))
      );
    } catch {}
  };

  const handleEditSubGoal = (index: number) => {
    const subGoal = watch("subGoals")[index];
    setSubGoalTemp(subGoal.description || "");
    const d = subGoal.deadline ? new Date(subGoal.deadline) : new Date();
    setSubGoalDateTemp(d);
    setEditingIndex(index);
  };

  const handleUpdateSubGoal = () => {
    if (editingIndex === null) {
      console.warn(
        "[CreateGoalSubGoal] handleUpdateSubGoal called but editingIndex is null"
      );
      return;
    }
    console.log(
      "[CreateGoalSubGoal] handleUpdateSubGoal called, editingIndex:",
      editingIndex,
      "subGoalTemp:",
      subGoalTemp
    );
    // Используем актуальные значения из формы, которые уже обновлены через updateEditingSubGoal
    const currentSubGoals = watch("subGoals") || [];
    const deadlineYmd = (() => {
      const d = subGoalDateTemp || new Date();
      const pad = (n: number) => (n < 10 ? `0${n}` : `${n}`);
      return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
    })();

    const updatedSubGoals = currentSubGoals.map((subGoal: any, i: number) => {
      if (i === editingIndex) {
        const updated = {
          ...subGoal,
          description: subGoalTemp, // Используем актуальное значение из textarea
          deadline: deadlineYmd,
        };
        console.log(
          "[CreateGoalSubGoal] Updating subGoal at index",
          i,
          "from:",
          subGoal,
          "to:",
          updated
        );
        return updated;
      }
      return subGoal;
    });
    setValue("subGoals", updatedSubGoals, {
      shouldDirty: true,
      shouldTouch: true,
    });
    try {
      console.log(
        "[CreateGoalSubGoal] update -> subGoals:",
        updatedSubGoals.map((s: any) => ({
          description: s.description,
          deadline: s.deadline,
        }))
      );
    } catch {}
    // Очищаем временные переменные
    setSubGoalTemp("");
    setSubGoalDateTemp(new Date());
    setEditingIndex(null);
  };

  const handleCloseSubGoal = () => {
    setSubGoalTemp("");
    setSubGoalDateTemp(new Date());
    setSubGoalCreateOpen(false);
    setEditingIndex(null);
  };

  const handleCloseEditingPopup = () => {
    setSubGoalTemp("");
    setSubGoalDateTemp(new Date());
    setEditingIndex(null);
  };

  return (
    <Block title="Перечень задач:">
      <table className="w-full border-collapse border-t scale-95 border-[#2F51A8]">
        <tbody className="w-full">
          {watch("subGoals")?.map((goal: any, index: number) => (
            <tr key={index} className="border border-[#2F51A8] flex w-full">
              <td className="border-r aspect-square border-[#2F51A8] py-2 px-4 text-center flex items-center justify-center">
                {index + 1}
              </td>
              <td className="border-r border-[#2F51A8] px-4 w-full py-2 line-clamp-1 flex items-center">
                {editingIndex === index ? (
                  <input
                    type="text"
                    value={subGoalTemp}
                    onChange={(e) => {
                      const v = e.target.value;
                      setSubGoalTemp(v);
                      updateEditingSubGoal({ description: v });
                    }}
                    onBlur={() => {
                      if (subGoalTemp.trim()) {
                        handleUpdateSubGoal();
                      } else {
                        handleCloseEditingPopup();
                      }
                    }}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        if (subGoalTemp.trim()) {
                          handleUpdateSubGoal();
                        }
                      }
                      if (e.key === "Escape") {
                        handleCloseEditingPopup();
                      }
                    }}
                    autoFocus
                    className="w-full outline-none border-b border-[#2F51A8]"
                  />
                ) : goal.description.length > 25 ? (
                  goal.description.slice(0, 25) + "..."
                ) : (
                  goal.description
                )}
              </td>
              <td className="px-2 flex items-center w-full">
                <input
                  type="date"
                  value={(() => {
                    const deadline =
                      editingIndex === index
                        ? subGoalDateTemp
                          ? (() => {
                              const d = subGoalDateTemp;
                              const pad = (n: number) =>
                                n < 10 ? `0${n}` : `${n}`;
                              return `${d.getFullYear()}-${pad(
                                d.getMonth() + 1
                              )}-${pad(d.getDate())}`;
                            })()
                          : ""
                        : goal.deadline
                        ? typeof goal.deadline === "string"
                          ? goal.deadline
                          : (() => {
                              const d = new Date(goal.deadline);
                              const pad = (n: number) =>
                                n < 10 ? `0${n}` : `${n}`;
                              return `${d.getFullYear()}-${pad(
                                d.getMonth() + 1
                              )}-${pad(d.getDate())}`;
                            })()
                        : "";
                    return deadline;
                  })()}
                  onChange={(e) => {
                    if (e.target.value) {
                      const d = new Date(e.target.value);
                      const pad = (n: number) => (n < 10 ? `0${n}` : `${n}`);
                      const deadlineYmd = `${d.getFullYear()}-${pad(
                        d.getMonth() + 1
                      )}-${pad(d.getDate())}`;

                      if (editingIndex === index) {
                        // Если уже в режиме редактирования, обновляем временное состояние
                        setSubGoalDateTemp(d);
                        updateEditingSubGoal({ deadlineYmd });
                      } else {
                        // Если не в режиме редактирования, сразу обновляем форму
                        const currentSubGoals = watch("subGoals") || [];
                        const updatedSubGoals = currentSubGoals.map(
                          (sg: any, i: number) => {
                            if (i === index) {
                              return {
                                ...sg,
                                deadline: deadlineYmd,
                              };
                            }
                            return sg;
                          }
                        );
                        setValue("subGoals", updatedSubGoals, {
                          shouldDirty: true,
                          shouldTouch: true,
                        });
                      }
                    }
                  }}
                  className="border rounded px-2 py-1 text-sm"
                />
              </td>
              <td className="border-l border-[#2F51A8] px-2 py-2 flex flex-col items-center gap-4">
                <button
                  type="button"
                  onClick={() => handleRemoveSubGoal(index)}
                >
                  <XIcon size={24} />
                </button>
                {editingIndex !== index && (
                  <button
                    type="button"
                    onClick={() => handleEditSubGoal(index)}
                  >
                    <EditIcon size={24} />
                  </button>
                )}
              </td>
            </tr>
          ))}
          <tr>
            <td colSpan={3}>
              <Popup
                open={subGoalCreateOpen}
                contentStyle={{
                  width: "80%",
                }}
                onOpen={() => setSubGoalCreateOpen(true)}
                onClose={handleCloseSubGoal}
                position="top left"
                arrow={false}
                trigger={
                  <button
                    type="button"
                    className="bg-[#2F51A8] aspect-square px-2 text-white text-xl flex items-center justify-center"
                  >
                    +
                  </button>
                }
              >
                <div className="w-full flex items-center gap-2">
                  <textarea
                    value={subGoalTemp}
                    onChange={(e) => setSubGoalTemp(e.target.value)}
                    placeholder="Введите задачу"
                    required
                    className="w-full outline-none resize-none"
                  />
                  <Button
                    type="button"
                    onClick={handleAddSubGoal}
                    className="aspect-square !p-2 rounded-sm"
                  >
                    <CheckIcon />
                  </Button>
                </div>
                <div className="mt-3">
                  Крайний срок
                  <div className="flex items-center gap-2 mt-2">
                    <input
                      type="text"
                      placeholder="ДД:ММ:ГГГГ ЧЧ:ММ"
                      value={manualDateText}
                      onChange={(e) => {
                        const formatted = formatManualInput(e.target.value);
                        setManualDateText(formatted);
                        const parsed = tryParseManual(formatted);
                        if (parsed) {
                          setSubGoalDateTemp(parsed);
                          const pad = (n: number) =>
                            n < 10 ? `0${n}` : `${n}`;
                          updateEditingSubGoal({
                            deadlineYmd: `${parsed.getFullYear()}-${pad(
                              parsed.getMonth() + 1
                            )}-${pad(parsed.getDate())}`,
                          });
                        }
                      }}
                      onKeyDown={(e) => {
                        if (e.key === "Backspace" && manualDateText) {
                          e.preventDefault();
                          const digits = manualDateText.replace(/\D/g, "");
                          const nextDigits = digits.slice(0, -1);
                          const nextFormatted =
                            formatDigitsToManual(nextDigits);
                          setManualDateText(nextFormatted);
                          const parsed = tryParseManual(nextFormatted);
                          if (parsed) {
                            setSubGoalDateTemp(parsed);
                            const pad = (n: number) =>
                              n < 10 ? `0${n}` : `${n}`;
                            updateEditingSubGoal({
                              deadlineYmd: `${parsed.getFullYear()}-${pad(
                                parsed.getMonth() + 1
                              )}-${pad(parsed.getDate())}`,
                            });
                          }
                        }
                      }}
                      className="w-4/5 outline-none resize-none border p-2 rounded-md border-gray-100"
                    />
                    <div className="relative w-1/5">
                      <input
                        ref={createDateInputRef}
                        type="datetime-local"
                        className="absolute inset-0 opacity-0 cursor-pointer z-10"
                        onChange={(e) => {
                          if (e.target.value) {
                            const d = new Date(e.target.value);
                            setSubGoalDateTemp(d);
                            setManualDateText(formatDateToManual(d));
                            updateEditingSubGoal({
                              deadlineYmd: `${d.getFullYear()}-${(
                                d.getMonth() + 1
                              )
                                .toString()
                                .padStart(2, "0")}-${d
                                .getDate()
                                .toString()
                                .padStart(2, "0")}`,
                            });
                          }
                        }}
                      />
                      <Button
                        type="button"
                        onClick={() => {
                          const el = createDateInputRef.current;
                          if (!el) return;
                          // @ts-ignore
                          if (typeof el.showPicker === "function")
                            el.showPicker();
                          else el.click();
                        }}
                        className="!p-2 w-full rounded-md flex items-center justify-center"
                      >
                        <Calendar size={18} />
                      </Button>
                    </div>
                  </div>
                </div>
              </Popup>
              <div className="flex justify-between items-center mt-3 px-2">
                {isGenerating && (
                  <span className="text-sm text-gray-500">Генерация...</span>
                )}
                <Button
                  type="button"
                  onClick={handleGenerateTasks}
                  disabled={isGenerating}
                >
                  {isGenerating
                    ? "Генерация..."
                    : hasGenerated
                    ? "Сгенерировать ещё раз"
                    : "Сгенерировать задачи"}
                </Button>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </Block>
  );
}
