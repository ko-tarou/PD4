'use client';
import { useState, useEffect, useRef } from 'react';
import { Trash2 } from 'lucide-react';

type Item = {
  id: number;
  label: string;
  color: string;
  x: number;
  y: number;
};

export default function OrderBoard() {
  const [done, setDone] = useState<Item[]>([]);
  const [pending, setPending] = useState<Item[]>([]);
  const itemWidth = 120; // ボタン幅の目安
  const itemHeight = 40; // ボタン高さの目安

  useEffect(() => {
    const screenWidth = window.innerWidth;
    const screenHeight = window.innerHeight;

    // 済エリア: 幅 2/5
    const doneAreaWidth = (2 / 5) * screenWidth;
    const doneX = doneAreaWidth / 2 - itemWidth / 2; // タイトル中央に揃える
    const doneYStart = 100;

    // 未エリア: 幅 3/5
    const pendingAreaWidth = (3 / 5) * screenWidth;
    const pendingX = (2 / 5) * screenWidth + pendingAreaWidth / 2 - itemWidth / 2;
    const pendingYStart = 100;

    setDone([
      { id: 1, label: '呼び出し', color: 'red', x: doneX, y: doneYStart },
      { id: 2, label: 'はし', color: 'gray', x: doneX, y: doneYStart + 60 },
      { id: 3, label: '取り皿', color: 'gray', x: doneX, y: doneYStart + 120 },
    ]);

    setPending([
      { id: 4, label: '呼び出し', color: 'red', x: pendingX, y: pendingYStart },
      { id: 5, label: 'ドリンク', color: 'blue', x: pendingX, y: pendingYStart + 60 },
      { id: 6, label: 'おしぼり', color: 'gray', x: pendingX, y: pendingYStart + 120 },
    ]);
  }, []);

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

    const onMouseUp = () => {
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseup', onMouseUp);
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

      {/* メインエリア */}
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

      {/* ゴミ箱 */}
      <div className="fixed bottom-6 left-[20%] flex justify-center items-center z-20">
        <div className="bg-white rounded-full shadow-lg p-4 border">
          <Trash2 size={56} className="text-gray-700" />
        </div>
      </div>
    </>
  );
}
