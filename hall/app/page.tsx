'use client';
import { useState } from 'react';
import { Trash2 } from 'lucide-react';

type Item = {
  id: number;
  label: string;
  color: string;
};

export default function OrderBoard() {
  const [done, setDone] = useState<Item[]>([
    { id: 1, label: '〇（卓番）：呼び出し', color: 'red' },
    { id: 2, label: '〇（卓番）：呼び出し', color: 'red' },
    { id: 3, label: '〇（卓番）：〇（個数）お冷', color: 'blue' },
    { id: 4, label: '〇（卓番）：〇（個数）はし', color: 'gray' },
    { id: 5, label: '〇（卓番）：〇（個数）取り皿', color: 'gray' },
    { id: 6, label: '〇（卓番）：〇（個数）取り皿', color: 'gray' },
    { id: 7, label: '〇（卓番）：〇（個数）調味料', color: 'gray' },
    { id: 8, label: '〇（卓番）：〇（個数）おしぼり', color: 'gray' },
    { id: 9, label: '〇（卓番）：〇（個数）おしぼり', color: 'gray' },
  ]);
  const [pending, setPending] = useState<Item[]>([
    { id: 10, label: '〇（卓番）：呼び出し', color: 'red' },
    { id: 11, label: '〇（卓番）：〇（個数）ドリンク', color: 'blue' },
    { id: 12, label: '〇（卓番）：〇（個数）おしぼり', color: 'gray' },
    { id: 13, label: '〇（卓番）：〇（個数）取り皿', color: 'gray' },
    { id: 14, label: '〇（卓番）：〇（個数）取り皿', color: 'gray' },
  ]);

  const onDragStart = (e: React.DragEvent, item: Item, from: 'done' | 'pending') => {
    e.dataTransfer.setData('item', JSON.stringify({ item, from }));
  };

  const onDrop = (e: React.DragEvent, to: 'done' | 'pending') => {
    e.preventDefault();
    const data = JSON.parse(e.dataTransfer.getData('item'));
    if (data.from === to) return;

    if (to === 'done') {
      setDone([...done, data.item]);
      setPending(pending.filter((i) => i.id !== data.item.id));
    } else {
      setPending([...pending, data.item]);
      setDone(done.filter((i) => i.id !== data.item.id));
    }
  };

  return (
    <>
      {/* 背景固定 */}
      <div className="fixed inset-0 flex z-0">
        <div className="w-2/5" style={{ backgroundColor: '#FFD5D5' }}></div>
        <div className="flex-1" style={{ backgroundColor: '#FFFAE2' }}></div>
      </div>

      {/* メインエリア（スクロール可能） */}
      <div className="relative h-screen flex overflow-y-auto z-10">
        {/* 済エリア */}
        <div
          className="w-2/5 p-6 flex flex-col items-center overflow-y-auto"
          onDragOver={(e) => e.preventDefault()}
          onDrop={(e) => onDrop(e, 'done')}
        >
          <h1 className="text-4xl mb-6">済</h1>

          <div className="flex flex-col gap-4 pb-20">
            {done.map((item) => (
              <button
                key={item.id}
                draggable
                onDragStart={(e) => onDragStart(e, item, 'done')}
                className={`px-4 py-2 rounded border shadow ${
                  item.color === 'red'
                    ? 'bg-red-500 text-white'
                    : item.color === 'blue'
                    ? 'bg-blue-500 text-white'
                    : 'bg-gray-200'
                }`}
              >
                {item.label}
              </button>
            ))}
          </div>
        </div>

        {/* 未エリア */}
        <div
          className="flex-1 p-6 flex flex-col items-center overflow-y-auto"
          onDragOver={(e) => e.preventDefault()}
          onDrop={(e) => onDrop(e, 'pending')}
        >
          <h1 className="text-4xl mb-6">未</h1>
          <div className="flex flex-col gap-4 pb-20">
            {pending.map((item) => (
              <button
                key={item.id}
                draggable
                onDragStart={(e) => onDragStart(e, item, 'pending')}
                className={`px-4 py-2 rounded border shadow ${
                  item.color === 'red'
                    ? 'bg-red-500 text-white'
                    : item.color === 'blue'
                    ? 'bg-blue-500 text-white'
                    : 'bg-gray-200'
                }`}
              >
                {item.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* 🗑 ゴミ箱（常に固定表示） */}
      <div className="fixed bottom-6 left-[20%] flex justify-center items-center z-20">
        <div className="bg-white rounded-full shadow-lg p-4 border">
          <Trash2 size={56} className="text-gray-700" />
        </div>
      </div>
    </>
  );
}
