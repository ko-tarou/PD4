'use client';
import { useState, useRef } from 'react';
import { Trash2 } from 'lucide-react';

type Item = {
  id: number;
  label: string;
  color: string;
  x: number;
  y: number;
};

export default function OrderBoard() {
  const [done, setDone] = useState<Item[]>([
    { id: 1, label: '呼び出し', color: 'red', x: 50, y: 50 },
    { id: 2, label: 'はし', color: 'gray', x: 50, y: 120 },
    { id: 3, label: '取り皿', color: 'gray', x: 50, y: 190 },
    { id: 4, label: '水', color: 'blue', x: 50, y: 260 },
    { id: 5, label: '皿', color: 'gray', x: 50, y: 330 },
    { id: 6, label: '醤油', color: 'gray', x: 50, y: 400 },
  ]);

  const [pending, setPending] = useState<Item[]>([
    { id: 7, label: '呼び出し', color: 'red', x: 400, y: 50 },
    { id: 8, label: 'ドリンク', color: 'blue', x: 400, y: 120 },
    { id: 9, label: 'おしぼり', color: 'gray', x: 400, y: 190 },
  ]);

  // ゴミ箱の位置とサイズ
  const trashRef = useRef<HTMLDivElement>(null);

  // ドラッグ用関数
  const onMouseDown = (e: React.MouseEvent, id: number, from: 'done' | 'pending') => {
    e.preventDefault();
    const startX = e.clientX;
    const startY = e.clientY;

    const itemList = from === 'done' ? done : pending;
    const item = itemList.find((i) => i.id === id);
    if (!item) return;

    const onMouseMove = (e: MouseEvent) => {
      const dx = e.clientX - startX;
      const dy = e.clientY - startY;
      const newItem = { ...item, x: item.x + dx, y: item.y + dy };

      if (from === 'done') {
        setDone((prev) => prev.map((i) => (i.id === id ? newItem : i)));
      } else {
        setPending((prev) => prev.map((i) => (i.id === id ? newItem : i)));
      }
    };

    const onMouseUp = (e: MouseEvent) => {
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseup', onMouseUp);

      // ゴミ箱削除判定
      if (trashRef.current) {
        const trashRect = trashRef.current.getBoundingClientRect();
        if (
          e.clientX >= trashRect.left &&
          e.clientX <= trashRect.right &&
          e.clientY >= trashRect.top &&
          e.clientY <= trashRect.bottom
        ) {
          // 削除
          if (from === 'done') {
            setDone((prev) => prev.filter((i) => i.id !== id));
          } else {
            setPending((prev) => prev.filter((i) => i.id !== id));
          }
        }
      }
    };

    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseup', onMouseUp);
  };

  return (
    <>
      {/* 背景固定 */}
      <div className="fixed inset-0 flex z-0">
        <div className="w-2/5" style={{ backgroundColor: '#FFD5D5' }}></div>
        <div className="flex-1" style={{ backgroundColor: '#FFFAE2' }}></div>
      </div>

      {/* タイトル固定 */}
      <div className="fixed top-6 left-6 w-2/5 z-10">
        <h1 className="text-4xl font-bold mb-6">済</h1>
      </div>
      <div className="fixed top-6 left-[45%] z-10">
        <h1 className="text-4xl font-bold mb-6">未</h1>
      </div>

      {/* メインエリア（スクロール可能） */}
      <div className="relative h-screen flex overflow-y-auto z-10">
        {/* 済エリア */}
        <div className="w-2/5 relative p-6 flex flex-col items-center">
          {done.map((item) => (
            <button
              key={item.id}
              style={{ left: item.x, top: item.y }}
              className={`absolute px-4 py-2 rounded border shadow ${
                item.color === 'red'
                  ? 'bg-red-500 text-white'
                  : item.color === 'blue'
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-200'
              }`}
              onMouseDown={(e) => onMouseDown(e, item.id, 'done')}
            >
              {item.label}
            </button>
          ))}
        </div>

        {/* 未エリア */}
        <div className="flex-1 relative p-6 flex flex-col items-center">
          {pending.map((item) => (
            <button
              key={item.id}
              style={{ left: item.x, top: item.y }}
              className={`absolute px-4 py-2 rounded border shadow ${
                item.color === 'red'
                  ? 'bg-red-500 text-white'
                  : item.color === 'blue'
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-200'
              }`}
              onMouseDown={(e) => onMouseDown(e, item.id, 'pending')}
            >
              {item.label}
            </button>
          ))}
        </div>
      </div>

      {/* 🗑 ゴミ箱（常に固定表示） */}
      <div
        ref={trashRef}
        className="fixed bottom-6 left-[20%] flex justify-center items-center z-20"
      >
        <div className="bg-white rounded-full shadow-lg p-4 border">
          <Trash2 size={56} className="text-gray-700" />
        </div>
      </div>
    </>
  );
}
