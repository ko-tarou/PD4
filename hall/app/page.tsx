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
  // 呼び出し（赤）
  if (order.name.includes('呼び出し')) return 'red';

  // メニューアイテムが読み込まれていない場合はキーワード判定のみ
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

  // バックエンドのメニューアイテムから飲み物を判定
  const menuItem = menuItems.find(item => item.name === order.name);
  
  // 飲み物タブ（tabId: 4）のアイテムは青
  if (menuItem && menuItem.tabId === 4) {
    return 'blue';
  }

  // 飲み物キーワードを含む場合も青
  const drinkKeywords = [
    'ドリンク', 'お冷', '飲み物', 'コーラ', 'ウーロン茶', '緑茶',
    'お茶', 'コーヒー', 'ビール', '生ビール', 'ハイボール',
    'チューハイ', 'ワイン', '焼酎', '水', 'レモンサワー'
  ];
  
  const orderNameLower = order.name.toLowerCase();
  if (drinkKeywords.some(keyword => orderNameLower.includes(keyword.toLowerCase()))) {
    return 'blue';
  }

  // それ以外（グレー）
  return 'gray';
};

// 色の優先順位でソート（赤 → 青 → グレー）
const sortByColor = (items: Item[]) => {
  const colorOrder: Record<string, number> = { red: 1, blue: 2, gray: 3 };
  return [...items].sort((a, b) => colorOrder[a.color] - colorOrder[b.color]);
};

export default function OrderBoard() {
  const [pending, setPending] = useState<Item[]>([]);
  const [done, setDone] = useState<Item[]>([]);
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [doneOrderIds, setDoneOrderIds] = useState<Set<number>>(new Set());

  // バックエンドからメニューアイテムを取得
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

  // バックエンドから注文を取得してhall用のアイテムに変換
  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await fetch('http://localhost:3001/api/orders');
        if (response.ok) {
          const orders: Order[] = await response.json();
          
          // 注文をhall用のアイテムに変換（doneに移動した注文は除外）
          const items: Item[] = orders
            .filter((order) => !doneOrderIds.has(order.id)) // doneに移動した注文を除外
            .map((order) => {
              // テーブル番号を抽出（"1番" または "1" から "1" を取得）
              const tableMatch = order.table.match(/(\d+)/);
              const tableNum = tableMatch ? tableMatch[1] : order.table;
              
              // 数量を抽出
              const quantityMatch = order.quantity.match(/(\d+)/);
              const quantity = quantityMatch ? quantityMatch[1] : '1';
              
              // ラベルを生成
              let label = '';
              if (order.name.includes('呼び出し')) {
                label = `${tableNum}番卓：呼び出し`;
              } else {
                // メニューアイテム名を使用
                const unit = (menuItems && menuItems.length > 0 && menuItems.find(mi => mi.name === order.name && mi.tabId === 4))
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

    // 初回実行（menuItemsが空でも実行）
    fetchOrders();
    const interval = setInterval(fetchOrders, 2000); // 2秒ごとに更新
    return () => clearInterval(interval);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [menuItems.length, doneOrderIds.size]); // menuItemsの長さとdoneOrderIdsが変わったとき再実行

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
      // doneに移動した注文IDを記録
      setDoneOrderIds((prev) => new Set([...prev, data.item.id]));
    } else {
      setPending(sortByColor([...pending, data.item]));
      setDone(done.filter((i) => i.id !== data.item.id));
      // pendingに戻した注文IDを記録から削除
      setDoneOrderIds((prev) => {
        const newSet = new Set(prev);
        newSet.delete(data.item.id);
        return newSet;
      });
    }
  };

  const clearDone = () => {
    if (done.length === 0) return;
    if (confirm('済エリアの項目をすべて削除しますか？')) {
      setDone([]);
      setDoneOrderIds(new Set()); // doneOrderIdsもクリア
    }
  };

  return (
    <>
      {/* 背景固定 */}
      <div className="fixed inset-0 flex z-0">
        <div className="w-2/5" style={{ backgroundColor: '#FFD5D5' }}></div>
        <div className="flex-1" style={{ backgroundColor: '#FFFAE2' }}></div>
      </div>

      {/* メインエリア */}
      <div className="relative h-screen flex overflow-y-auto z-10">
        {/* 済エリア */}
        <div
          className="w-2/5 p-6 flex flex-col items-center overflow-y-auto"
          onDragOver={(e) => e.preventDefault()}
          onDrop={(e) => onDrop(e, 'done')}
        >
          <h1 className="text-4xl mb-6">済</h1>
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
        </div>

        {/* 未エリア */}
        <div
          className="flex-1 p-6 flex flex-col items-center overflow-y-auto"
          onDragOver={(e) => e.preventDefault()}
          onDrop={(e) => onDrop(e, 'pending')}
        >
          <h1 className="text-4xl mb-6">未</h1>
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

      {/* ゴミ箱 */}
      <div className="fixed bottom-6 left-[20%] flex justify-center items-center z-20">
        <button
          onClick={clearDone}
          className="bg-white rounded-full shadow-lg p-4 border hover:bg-gray-100 transition"
          title="済エリアを全削除"
        >
          <Trash2 size={56} className="text-gray-700" />
        </button>
      </div>
    </>
  );
}
