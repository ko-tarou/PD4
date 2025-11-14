'use client';
import { useState, useEffect } from 'react';
import { Trash2 } from 'lucide-react';

type Item = {
  id: number;
  label: string;
  color: string;
};

interface Order {
  id: number;
  category: string;
  name: string;
  table: string;
  quantity: string;
  time: string;
}

interface MenuItem {
  id: number;
  tabId: number;
  name: string;
  price: number;
  category: string;
}

// 注文から色を自動判定する関数
const getColorFromOrder = (order: Order, menuItems: MenuItem[]): string => {
  if (order.name.includes('呼び出し')) return 'red';

  if (!menuItems || menuItems.length === 0) {
    const drinkKeywords = [
      'ドリンク', 'お冷', '飲み物', 'コーラ', 'ウーロン茶', '緑茶',
      'お茶', 'コーヒー', 'ビール', '生ビール', 'ハイボール',
      'チューハイ', 'ワイン', '焼酎', '水', 'レモンサワー'
    ];
    const orderNameLower = order.name.toLowerCase();
    if (drinkKeywords.some(keyword => orderNameLower.includes(keyword.toLowerCase()))) {
      return 'blue';
    }
    return 'gray';
  }

  const menuItem = menuItems.find(item => item.name === order.name);

  if (menuItem && menuItem.tabId === 4) {
    return 'blue';
  }

  const drinkKeywords = [
    'ドリンク', 'お冷', '飲み物', 'コーラ', 'ウーロン茶', '緑茶',
    'お茶', 'コーヒー', 'ビール', '生ビール', 'ハイボール',
    'チューハイ', 'ワイン', '焼酎', '水', 'レモンサワー'
  ];

  const orderNameLower = order.name.toLowerCase();
  if (drinkKeywords.some(keyword => orderNameLower.includes(keyword.toLowerCase()))) {
    return 'blue';
  }

  return 'gray';
};

const sortByColor = (items: Item[]) => {
  const colorOrder: Record<string, number> = { red: 1, blue: 2, gray: 3 };
  return [...items].sort((a, b) => colorOrder[a.color] - colorOrder[b.color]);
};

export default function OrderBoard() {
  const [pending, setPending] = useState<Item[]>([]);
  const [done, setDone] = useState<Item[]>([]);
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [doneOrderIds, setDoneOrderIds] = useState<Set<number>>(new Set());

  // メニューアイテム取得
  useEffect(() => {
    const fetchMenuItems = async () => {
      try {
        const response = await fetch('http://localhost:3001/api/menu/items');
        if (response.ok) {
          const data = await response.json();
          setMenuItems(data);
        }
      } catch (error) {
        console.error('メニューアイテムの取得に失敗しました:', error);
      }
    };

    fetchMenuItems();
  }, []);

  // 注文取得
  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await fetch('http://localhost:3001/api/orders');
        if (response.ok) {
          const orders: Order[] = await response.json();

          const items: Item[] = orders
            .filter(order => !doneOrderIds.has(order.id))
            .map(order => {
              const tableMatch = order.table.match(/(\d+)/);
              const tableNum = tableMatch ? tableMatch[1] : order.table;

              const quantityMatch = order.quantity.match(/(\d+)/);
              const quantity = quantityMatch ? quantityMatch[1] : '1';

              let label = '';
              if (order.name.includes('呼び出し')) {
                label = `${tableNum}番卓：呼び出し`;
              } else {
                const unit =
                  menuItems &&
                  menuItems.length > 0 &&
                  menuItems.find(mi => mi.name === order.name && mi.tabId === 4)
                    ? '杯'
                    : '個';
                label = `${tableNum}番卓：${order.name}${quantity}${unit}`;
              }

              return {
                id: order.id,
                label,
                color: getColorFromOrder(order, menuItems || []),
              };
            });

          setPending(items);
        }
      } catch (error) {
        console.error('注文の取得に失敗しました:', error);
      }
    };

    fetchOrders();
    const interval = setInterval(fetchOrders, 2000);
    return () => clearInterval(interval);
  }, [menuItems.length, doneOrderIds.size]);

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
      setDoneOrderIds(prev => new Set([...prev, data.item.id]));
    } else {
      setPending(sortByColor([...pending, data.item]));
      setDone(done.filter((i) => i.id !== data.item.id));
      setDoneOrderIds(prev => {
        const newSet = new Set(prev);
        newSet.delete(data.item.id);
        return newSet;
      });
    }
  };

  // 🔥 追加： ゴミ箱にドロップされたら削除
  const onDropToTrash = (e: React.DragEvent) => {
    e.preventDefault();
    const data = JSON.parse(e.dataTransfer.getData('item'));

    // "済" からのみ削除
    if (data.from !== "done") return;

    const id = data.item.id;

    setDone(done.filter((i) => i.id !== id));

    setDoneOrderIds(prev => {
      const newSet = new Set(prev);
      newSet.delete(id);
      return newSet;
    });
  };

  return (
    <div className="flex justify-center items-center w-screen h-screen bg-gray-300">
      <div
        className="relative flex overflow-hidden rounded-xl shadow-lg border border-gray-400"
        style={{ width: '840px', height: '700px' }}
      >
        {/* 背景2色 */}
        <div className="absolute inset-0 flex z-0">
          <div className="w-2/5" style={{ backgroundColor: '#FFD5D5' }}></div>
          <div className="flex-1" style={{ backgroundColor: '#FFFAE2' }}></div>
        </div>

        {/* タイトル（absolute） */}
        <h1 className="absolute left-6 top-6 text-4xl z-20">済</h1>
        <h1 className="absolute right-6 top-6 text-4xl z-20">未</h1>

        {/* メインエリア */}
        <div className="relative flex w-full h-full z-10 pt-20">
          {/* 済エリア */}
          <div
            className="w-2/5 p-6 flex flex-col overflow-y-auto relative"
            onDragOver={(e) => e.preventDefault()}
            onDrop={(e) => onDrop(e, 'done')}
          >
            <div className="flex flex-col gap-4 pb-20">
              {sortByColor(done).map((item, index) => (
                <button
                  key={`done-${item.id}-${index}`}
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

            {/* 🔥 追加： ごみ箱（済エリア右下固定） */}
            <div
              className="absolute bottom-4 right-4 p-3 bg-white rounded-full shadow-lg border cursor-pointer"
              onDragOver={(e) => e.preventDefault()}
              onDrop={onDropToTrash}
            >
              <Trash2 size={32} className="text-gray-600" />
            </div>
          </div>

          {/* 未エリア */}
          <div
            className="flex-1 p-6 flex flex-col overflow-y-auto"
            onDragOver={(e) => e.preventDefault()}
            onDrop={(e) => onDrop(e, 'pending')}
          >
            <div className="flex flex-col gap-4 pb-20">
              {sortByColor(pending).map((item, index) => (
                <button
                  key={`pending-${item.id}-${index}`}
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
      </div>
    </div>
  );
}
