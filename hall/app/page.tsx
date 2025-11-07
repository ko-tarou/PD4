'use client';
import { useState } from 'react';
import { Trash2 } from 'lucide-react';

type Item = {
  id: number;
  label: string;
  color: string;
};

const getColorFromLabel = (label: string): string => {
  const lower = label.toLowerCase();

  if (label.includes('呼び出し')) return 'red';

  const drinkKeywords = [
    'ドリンク', 'お冷', '飲み物', 'コーラ', 'ウーロン茶', '緑茶',
    'お茶', 'コーヒー', 'ビール', '生ビール', 'ハイボール',
    'チューハイ', 'ワイン', '焼酎', '水', 'レモンサワー',
    'beer', 'cola', 'coffee', 'tea', 'highball'
  ];

  if (drinkKeywords.some((word) => label.includes(word) || lower.includes(word))) {
    return 'blue';
  }

  return 'gray';
};

const sortByColor = (items: Item[]) => {
  const colorOrder: Record<string, number> = { red: 1, blue: 2, gray: 3 };
  return [...items].sort((a, b) => colorOrder[a.color] - colorOrder[b.color]);
};

export default function OrderBoard() {
  const [pending, setPending] = useState<Item[]>([
    { id: 1, label: '1番卓：呼び出し', color: getColorFromLabel('1番卓：呼び出し') },
    { id: 2, label: '2番卓：生ビール2つ', color: getColorFromLabel('2番卓：生ビール2つ') },
    { id: 3, label: '3番卓：ウーロン茶1杯', color: getColorFromLabel('3番卓：ウーロン茶1杯') },
    { id: 4, label: '4番卓：取り皿3枚', color: getColorFromLabel('4番卓：取り皿3枚') },
    { id: 5, label: '5番卓：おしぼり2つ', color: getColorFromLabel('5番卓：おしぼり2つ') },
    { id: 6, label: '4番卓：取り皿3枚', color: getColorFromLabel('4番卓：取り皿3枚') },
    { id: 7, label: '5番卓：おしぼり2つ', color: getColorFromLabel('5番卓：おしぼり2つ') },
    { id: 8, label: '4番卓：取り皿3枚', color: getColorFromLabel('4番卓：取り皿3枚') },
    { id: 9, label: '5番卓：おしぼり2つ', color: getColorFromLabel('5番卓：おしぼり2つ') },
    { id: 10, label: '4番卓：取り皿3枚', color: getColorFromLabel('4番卓：取り皿3枚') },
    { id: 11, label: '5番卓：おしぼり2つ', color: getColorFromLabel('5番卓：おしぼり2つ') },
    { id: 12, label: '4番卓：取り皿3枚', color: getColorFromLabel('4番卓：取り皿3枚') },
    { id: 13, label: '5番卓：おしぼり2つ', color: getColorFromLabel('5番卓：おしぼり2つ') },
    { id: 14, label: '4番卓：取り皿3枚', color: getColorFromLabel('4番卓：取り皿3枚') },
    { id: 15, label: '5番卓：おしぼり2つ', color: getColorFromLabel('5番卓：おしぼり2つ') },
  ]);
  const [done, setDone] = useState<Item[]>([]);

  const onDragStart = (e: React.DragEvent, item: Item, from: 'done' | 'pending') => {
    e.dataTransfer.setData('item', JSON.stringify({ item, from }));
  };

  const onDrop = (e: React.DragEvent, to: 'done' | 'pending') => {
    e.preventDefault();
    const data = JSON.parse(e.dataTransfer.getData('item'));
    if (data.from === to) return;

    if (to === 'done') {
      setDone(sortByColor([...done, data.item]));
      setPending(pending.filter((i) => i.id !== data.item.id));
    } else {
      setPending(sortByColor([...pending, data.item]));
      setDone(done.filter((i) => i.id !== data.item.id));
    }
  };

  const clearDone = () => {
    if (done.length === 0) return;
    if (confirm('済エリアの項目をすべて削除しますか？')) {
      setDone([]);
    }
  };

  return (
    <div className="flex justify-center items-center w-screen h-screen bg-gray-300">
      {/* メインコンテナ（固定サイズ） */}
      <div
        className="relative flex overflow-hidden rounded-xl shadow-lg border border-gray-400"
        style={{ width: '840px', height: '700px' }}
      >
        {/* 背景2色分割 */}
        <div className="absolute inset-0 flex z-0">
          <div className="w-2/5" style={{ backgroundColor: '#FFD5D5' }}></div>
          <div className="flex-1" style={{ backgroundColor: '#FFFAE2' }}></div>
        </div>

        {/* コンテンツ */}
        <div className="relative flex w-full h-full z-10">
          {/* 済エリア */}
          <div
            className="w-2/5 p-4 flex flex-col items-center overflow-y-auto"
            onDragOver={(e) => e.preventDefault()}
            onDrop={(e) => onDrop(e, 'done')}
          >
            <h1 className="text-3xl mb-4">済</h1>
            <div className="flex flex-col gap-3 pb-10">
              {sortByColor(done).map((item) => (
                <button
                  key={item.id}
                  draggable
                  onDragStart={(e) => onDragStart(e, item, 'done')}
                  className={`px-3 py-2 rounded border shadow ${
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
            className="flex-1 p-4 flex flex-col items-center overflow-y-auto"
            onDragOver={(e) => e.preventDefault()}
            onDrop={(e) => onDrop(e, 'pending')}
          >
            <h1 className="text-3xl mb-4">未</h1>
            <div className="flex flex-col gap-3 pb-10">
              {sortByColor(pending).map((item) => (
                <button
                  key={item.id}
                  draggable
                  onDragStart={(e) => onDragStart(e, item, 'pending')}
                  className={`px-3 py-2 rounded border shadow ${
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

        {/* ゴミ箱 */}
        <div className="absolute bottom-4 left-[20%] flex justify-center items-center z-20">
          <button
            onClick={clearDone}
            className="bg-white rounded-full shadow-lg p-3 border hover:bg-gray-100 transition"
            title="済エリアを全削除"
          >
            <Trash2 size={40} className="text-gray-700" />
          </button>
        </div>
      </div>
    </div>
  );
}
