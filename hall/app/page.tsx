import type { DragEvent } from "react";
import { useState } from "react";
import { Trash2 } from "lucide-react";
declare module "lucide-react";

type Item = {
  id: number;
  label: string;
  color: string;
};

type FromType = "pending" | "done";

export default function OrderBoard() {
  const [done, setDone] = useState<Item[]>([]);
  const [pending, setPending] = useState([
    { id: 1, label: '○（卓番）：呼び出し', color: 'bg-red-600' },
    { id: 2, label: '○（卓番）：呼び出し', color: 'bg-red-600' },
    { id: 3, label: '○（卓番）：呼び出し', color: 'bg-red-600' },
    { id: 4, label: '○（卓番）：呼び出し', color: 'bg-red-600' },
    { id: 5, label: '○（卓番）：呼び出し', color: 'bg-red-600' },
    { id: 6, label: '○（卓番）：〇（個数）ドリンク', color: 'bg-blue-600' },
    { id: 7, label: '○（卓番）：〇（個数）おしぼり', color: 'bg-gray-200' },
    { id: 8, label: '○（卓番）：〇（個数）はし', color: 'bg-gray-400' },
    { id: 9, label: '○（卓番）：〇（個数）取り皿', color: 'bg-gray-400' },
    { id: 10, label: '○（卓番）：〇（個数）氷冷', color: 'bg-gray-500' },
    { id: 11, label: '○（卓番）：調味料', color: 'bg-gray-500' },
  ]);

  const onDragStart = (e: DragEvent<HTMLDivElement>, item: Item, from: FromType) => {
    e.dataTransfer.setData('item', JSON.stringify(item));
    e.dataTransfer.setData('from', from);
  };

  const onDrop = (e: DragEvent<HTMLDivElement>, to: FromType) => {
    // drop イベントでは preventDefault しておく
    e.preventDefault();

    const itemStr = e.dataTransfer?.getData("item");
    const from = e.dataTransfer?.getData("from") as FromType | undefined;

    if (!itemStr || !from) return;

    const item: Item = JSON.parse(itemStr);

    if (from === to) return;

    if (from === "pending") {
      setPending((prev) => prev.filter((i) => i.id !== item.id));
      setDone((prev) => [...prev, item]);
    } else {
      setDone((prev) => prev.filter((i) => i.id !== item.id));
      setPending((prev) => [...prev, item]);
    }
  };

  const onDragOver = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault(); // 必須：drop を受け付けるため
  };

  return (
    <div className="grid grid-cols-2 min-h-screen">
      <div
        className="bg-pink-100 p-6 flex flex-col items-center gap-4 relative"
        onDrop={(e) => onDrop(e, "done")}
        onDragOver={onDragOver}
      >
        <h2 className="text-3xl font-bold mb-2">済</h2>

        {done.map((item) => (
          <div
            key={item.id}
            draggable
            onDragStart={(e) => onDragStart(e, item, "done")}
            className={`w-56 text-center p-2 text-white rounded ${item.color}`}
          >
            {item.label}
          </div>
        ))}

        <div className="absolute bottom-4 text-gray-500">
          <Trash2 size={36} />
        </div>
      </div>

      <div
        className="bg-yellow-50 p-6 flex flex-col items-center gap-4"
        onDrop={(e) => onDrop(e, "pending")}
        onDragOver={onDragOver}
      >
        <h2 className="text-3xl font-bold mb-2">未</h2>

        {pending.map((item) => (
          <div
            key={item.id}
            draggable
            onDragStart={(e) => onDragStart(e, item, "pending")}
            className={`w-56 text-center p-2 rounded text-white ${item.color}`}
          >
            {item.label}
          </div>
        ))}
      </div>
    </div>
  );
}