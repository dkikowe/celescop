import { useState } from "react";

type Toast = { id: number; text: string };

export function ToastHost() {
  const [toasts] = useState<Toast[]>([]);

  if (!toasts.length) return null;

  return (
    <div className="fixed top-4 inset-x-0 z-[1000] flex flex-col items-center gap-2 px-4 pointer-events-none">
      {toasts.map((t) => (
        <div
          key={t.id}
          className="pointer-events-auto bg-white shadow-lg rounded-lg px-4 py-3 border border-gray-200 text-gray-900 w-full max-w-md"
        >
          <div className="font-semibold text-blue-600 mb-1">Целескоп ИИ</div>
          <div>{t.text}</div>
        </div>
      ))}
    </div>
  );
}
