'use client';

import React, { useState, useEffect } from 'react';

// 型定義
interface Order {
  id: number;
  category: string;
  name: string;
  table: string;
  quantity: string;
  time: string;
}

interface CompletedOrder extends Order {
  completedAt: number;
}

interface DeletedOrder extends Order {
  deletedAt: string;
}

interface IconProps {
  className?: string;
}

// アイコンコンポーネント
const Trash2: React.FC<IconProps> = ({ className = '' }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
  </svg>
);

const X: React.FC<IconProps> = ({ className = '' }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
  </svg>
);

const OrderManagement: React.FC = () => {
  const [showDeleteModal, setShowDeleteModal] = useState<boolean>(false);
  const [showOrderModal, setShowOrderModal] = useState<boolean>(false);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedDish, setSelectedDish] = useState<string | null>(null);
  const [tableNumber, setTableNumber] = useState<string>('');
  const [quantity, setQuantity] = useState<string>('1');

  // 料理メニュー
  const menuItems: Record<string, string[]> = {
    '揚げ': [
      '唐揚げ', 'エビフライ', '天ぷら盛り合わせ', 'フライドポテト', 
      'とんかつ', 'チキンカツ', 'アジフライ', 'コロッケ'
    ],
    '焼き': [
      '焼き鳥', 'ハンバーグ', 'ステーキ', '焼き魚', 
      '鉄板焼き', 'お好み焼き', 'もんじゃ焼き', '焼きそば'
    ],
    '一品': [
      '枝豆', '冷奴', 'サラダ', '刺身盛り合わせ', 
      '漬物盛り合わせ', 'チーズ盛り合わせ', 'ナムル', 'キムチ'
    ]
  };

  const [orders, setOrders] = useState<Order[]>([
    { id: 1, category: '揚げ', name: '唐揚げ', table: '1番', quantity: '2個', time: '12:30' },
    { id: 2, category: '焼き', name: '焼き鳥', table: '3番', quantity: '3個', time: '12:35' },
    { id: 3, category: '一品', name: '枝豆', table: '5番', quantity: '1個', time: '12:40' },
  ]);

  const [completedOrders, setCompletedOrders] = useState<CompletedOrder[]>([]);
  const [deletedOrders, setDeletedOrders] = useState<DeletedOrder[]>([]);

  const categories = [
    { id: 1, name: '揚げ', color: '#914C01', bgColor: '#DA7700' },
    { id: 2, name: '焼き', color: '#6D4B30', bgColor: '#B18869' },
    { id: 3, name: '一品', color: '#5C6327', bgColor: '#EEF7AC' }
  ];

  // 1分後に自動削除する処理
  useEffect(() => {
    const interval = setInterval(() => {
      const now = Date.now();
      setCompletedOrders(prevCompleted => {
        const toDelete = prevCompleted.filter(order => {
          const timeDiff = now - order.completedAt;
          return timeDiff >= 1 * 60 * 1000; // 1分
        });

        if (toDelete.length > 0) {
          const deletedTime = new Date();
          const deleteTimeStr = `${deletedTime.getHours()}:${String(deletedTime.getMinutes()).padStart(2, '0')}`;
          
          setDeletedOrders(prev => {
            // 既に存在するIDをチェック
            const existingIds = new Set(prev.map(o => o.id));
            const newDeleted = toDelete
              .filter(order => !existingIds.has(order.id))
              .map(order => ({
                id: order.id,
                category: order.category,
                name: order.name,
                table: order.table,
                quantity: order.quantity,
                time: order.time,
                deletedAt: deleteTimeStr
              }));
            
            return [...prev, ...newDeleted];
          });
        }

        return prevCompleted.filter(order => {
          const timeDiff = now - order.completedAt;
          return timeDiff < 1 * 60 * 1000;
        });
      });
    }, 1000); // 1秒ごとにチェック

    return () => clearInterval(interval);
  }, []);

  const handleCategoryClick = (categoryName: string) => {
    setSelectedCategory(categoryName);
    setShowOrderModal(true);
  };

  const handleDishSelect = (dishName: string) => {
    setSelectedDish(dishName);
  };

  const handleOrderSubmit = () => {
    if (!selectedDish || !tableNumber || !quantity) {
      alert('品名、卓番、個数を入力してください');
      return;
    }

    const now = new Date();
    const timeStr = `${now.getHours()}:${String(now.getMinutes()).padStart(2, '0')}`;

    const newOrder: Order = {
      id: Date.now(),
      category: selectedCategory!,
      name: selectedDish,
      table: `${tableNumber}番`,
      quantity: `${quantity}個`,
      time: timeStr
    };

    setOrders([newOrder, ...orders]); // 上に追加
    setShowOrderModal(false);
    setSelectedDish(null);
    setTableNumber('');
    setQuantity('1');
  };

  const handleDeleteClick = () => {
    setShowDeleteModal(true);
  };

  const handleDeleteConfirm = (orderId: number) => {
    const order = orders.find(o => o.id === orderId);
    if (order) {
      const now = new Date();
      const deleteTimeStr = `${now.getHours()}:${String(now.getMinutes()).padStart(2, '0')}`;
      
      setDeletedOrders([...deletedOrders, { ...order, deletedAt: deleteTimeStr }]);
      setOrders(orders.filter(o => o.id !== orderId));
    }
  };

  const handleRestoreOrder = (orderId: number) => {
    const deletedOrder = deletedOrders.find(o => o.id === orderId);
    if (deletedOrder) {
      const restoredOrder: Order = {
        id: deletedOrder.id,
        category: deletedOrder.category,
        name: deletedOrder.name,
        table: deletedOrder.table,
        quantity: deletedOrder.quantity,
        time: deletedOrder.time
      };
      setOrders([restoredOrder, ...orders]);
      setDeletedOrders(deletedOrders.filter(o => o.id !== orderId));
    }
  };

  const [draggedOrder, setDraggedOrder] = useState<number | null>(null);
  const [draggedCompletedOrder, setDraggedCompletedOrder] = useState<number | null>(null);

  const handleDragStart = (orderId: number) => {
    setDraggedOrder(orderId);
  };

  const handleCompletedDragStart = (orderId: number) => {
    setDraggedCompletedOrder(orderId);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    if (draggedOrder !== null) {
      handleCompleteOrder(draggedOrder);
      setDraggedOrder(null);
    }
  };

  const handleCategoryDrop = (e: React.DragEvent, category: string) => {
    e.preventDefault();
    if (draggedCompletedOrder !== null) {
      const completedOrder = completedOrders.find(o => o.id === draggedCompletedOrder);
      if (completedOrder) {
        const restoredOrder: Order = {
          id: completedOrder.id,
          category: category,
          name: completedOrder.name,
          table: completedOrder.table,
          quantity: completedOrder.quantity,
          time: completedOrder.time
        };
        setOrders([restoredOrder, ...orders]);
        setCompletedOrders(completedOrders.filter(o => o.id !== draggedCompletedOrder));
      }
      setDraggedCompletedOrder(null);
    }
  };

  const handleCompleteOrder = (orderId: number) => {
    const order = orders.find(o => o.id === orderId);
    if (order) {
      const completedOrder: CompletedOrder = {
        ...order,
        completedAt: Date.now()
      };
      setCompletedOrders([...completedOrders, completedOrder]); // 左から順に追加
      setOrders(orders.filter(o => o.id !== orderId));
    }
  };

  if (showDeleteModal) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100 p-4">
        <div className="bg-white rounded-lg shadow-lg" style={{ width: '840px', height: '700px' }}>
          <div className="flex" style={{ height: '80px' }}>
            <div className="flex items-center justify-center text-white font-bold text-2xl" style={{ width: '280px', backgroundColor: '#914C01' }}>
              揚げ
            </div>
            <div className="flex items-center justify-center text-white font-bold text-2xl" style={{ width: '280px', backgroundColor: '#6D4B30' }}>
              焼き
            </div>
            <div className="flex items-center justify-center text-white font-bold text-2xl" style={{ width: '280px', backgroundColor: '#5C6327' }}>
              一品
            </div>
          </div>

          <div className="p-4 font-bold text-xl mb-2">ゴミ箱</div>

          <div className="overflow-y-auto p-4 space-y-3" style={{ height: '460px' }}>
            {deletedOrders.map((order) => (
              <div key={order.id} className="bg-gray-100 border-2 border-gray-300 rounded-lg p-4 shadow-sm">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="font-bold text-xl mb-2">{order.name}</div>
                    <div className="flex items-center gap-3 text-base text-gray-600">
                      <span className="flex items-center gap-1">
                        <input type="radio" className="w-4 h-4" checked readOnly />
                        <span>{order.table}</span>
                      </span>
                      <span>:</span>
                      <span className="flex items-center gap-1">
                        <input type="radio" className="w-4 h-4" checked readOnly />
                        <span>{order.quantity}</span>
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="text-xl font-bold text-red-600">
                      削除時刻: {order.deletedAt}
                    </div>
                    <button
                      onClick={() => handleRestoreOrder(order.id)}
                      className="bg-green-500 hover:bg-green-600 text-white font-bold px-6 py-3 rounded-lg transition-colors"
                    >
                      取消
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="p-4" style={{ height: '100px' }}>
            <button
              onClick={() => setShowDeleteModal(false)}
              className="w-full bg-blue-500 hover:bg-blue-600 text-white font-bold rounded-lg transition-colors text-xl"
              style={{ height: '60px' }}
            >
              戻る
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (showOrderModal) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100 p-4">
        <div className="bg-white rounded-lg shadow-lg" style={{ width: '840px', height: '700px' }}>
          <div className="bg-gradient-to-r from-blue-500 to-cyan-500 text-white p-4 flex justify-between items-center" style={{ height: '80px' }}>
            <h2 className="text-2xl font-bold">{selectedCategory} - 注文入力</h2>
            <button onClick={() => setShowOrderModal(false)} className="hover:bg-white/20 p-2 rounded">
              <X className="w-8 h-8" />
            </button>
          </div>

          <div className="p-6 overflow-y-auto" style={{ height: '620px' }}>
            <div className="mb-6">
              <label className="block font-bold mb-3 text-xl">品名を選択</label>
              <div className="grid grid-cols-4 gap-3">
                {selectedCategory && menuItems[selectedCategory].map((dish) => (
                  <button
                    key={dish}
                    onClick={() => handleDishSelect(dish)}
                    className={`p-4 rounded-lg border-2 transition-all text-lg font-medium ${
                      selectedDish === dish
                        ? 'bg-blue-500 text-white border-blue-600'
                        : 'bg-white border-gray-300 hover:border-blue-400'
                    }`}
                  >
                    {dish}
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-6 mb-8">
              <div>
                <label className="block font-bold mb-3 text-xl">卓番</label>
                <input
                  type="number"
                  value={tableNumber}
                  onChange={(e) => setTableNumber(e.target.value)}
                  placeholder="例: 1"
                  className="w-full p-4 border-2 border-gray-300 rounded-lg focus:border-blue-500 outline-none text-lg"
                />
              </div>

              <div>
                <label className="block font-bold mb-3 text-xl">個数</label>
                <input
                  type="number"
                  value={quantity}
                  onChange={(e) => setQuantity(e.target.value)}
                  min="1"
                  className="w-full p-4 border-2 border-gray-300 rounded-lg focus:border-blue-500 outline-none text-lg"
                />
              </div>
            </div>

            <button
              onClick={handleOrderSubmit}
              className="w-full bg-green-500 hover:bg-green-600 text-white font-bold py-5 rounded-lg transition-colors text-xl"
            >
              注文を追加
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 p-4">
      <div className="bg-white rounded-lg shadow-lg overflow-hidden" style={{ width: '840px', height: '700px' }}>
        <div className="flex" style={{ height: '80px' }}>
          <button
            onClick={() => handleCategoryClick('揚げ')}
            className="flex items-center justify-center text-white font-bold text-2xl hover:opacity-90 transition-opacity"
            style={{ width: '280px', backgroundColor: '#914C01' }}
          >
            揚げ
          </button>
          <button
            onClick={() => handleCategoryClick('焼き')}
            className="flex items-center justify-center text-white font-bold text-2xl hover:opacity-90 transition-opacity"
            style={{ width: '280px', backgroundColor: '#6D4B30' }}
          >
            焼き
          </button>
          <button
            onClick={() => handleCategoryClick('一品')}
            className="flex items-center justify-center text-white font-bold text-2xl hover:opacity-90 transition-opacity"
            style={{ width: '280px', backgroundColor: '#5C6327' }}
          >
            一品
          </button>
        </div>

        <div className="flex" style={{ height: '470px' }}>
          <div 
            className="p-3 space-y-2 overflow-y-auto" 
            style={{ width: '280px', backgroundColor: '#DA7700' }}
            onDragOver={handleDragOver}
            onDrop={(e) => handleCategoryDrop(e, '揚げ')}
          >
            {orders
              .filter(order => order.category === '揚げ')
              .map((order) => (
                <div 
                  key={order.id} 
                  draggable
                  onDragStart={() => handleDragStart(order.id)}
                  className="bg-orange-100 border-2 border-orange-300 rounded-lg p-3 cursor-move hover:bg-orange-200 transition-colors"
                >
                  <div className="font-bold mb-1 text-base">{order.name}</div>
                  <div className="text-sm flex items-center gap-2">
                    <input type="radio" className="w-3 h-3" checked readOnly />
                    <span>{order.table}</span>
                    <span>:</span>
                    <input type="radio" className="w-3 h-3" checked readOnly />
                    <span>{order.quantity}</span>
                  </div>
                </div>
              ))}
          </div>

          <div 
            className="p-3 space-y-2 overflow-y-auto" 
            style={{ width: '280px', backgroundColor: '#B18869' }}
            onDragOver={handleDragOver}
            onDrop={(e) => handleCategoryDrop(e, '焼き')}
          >
            {orders
              .filter(order => order.category === '焼き')
              .map((order) => (
                <div 
                  key={order.id} 
                  draggable
                  onDragStart={() => handleDragStart(order.id)}
                  className="bg-orange-100 border-2 border-orange-300 rounded-lg p-3 cursor-move hover:bg-orange-200 transition-colors"
                >
                  <div className="font-bold mb-1 text-base">{order.name}</div>
                  <div className="text-sm flex items-center gap-2">
                    <input type="radio" className="w-3 h-3" checked readOnly />
                    <span>{order.table}</span>
                    <span>:</span>
                    <input type="radio" className="w-3 h-3" checked readOnly />
                    <span>{order.quantity}</span>
                  </div>
                </div>
              ))}
          </div>

          <div 
            className="p-3 space-y-2 overflow-y-auto" 
            style={{ width: '280px', backgroundColor: '#EEF7AC' }}
            onDragOver={handleDragOver}
            onDrop={(e) => handleCategoryDrop(e, '一品')}
          >
            {orders
              .filter(order => order.category === '一品')
              .map((order) => (
                <div 
                  key={order.id} 
                  draggable
                  onDragStart={() => handleDragStart(order.id)}
                  className="bg-orange-100 border-2 border-orange-300 rounded-lg p-3 cursor-move hover:bg-orange-200 transition-colors"
                >
                  <div className="font-bold mb-1 text-base">{order.name}</div>
                  <div className="text-sm flex items-center gap-2">
                    <input type="radio" className="w-3 h-3" checked readOnly />
                    <span>{order.table}</span>
                    <span>:</span>
                    <input type="radio" className="w-3 h-3" checked readOnly />
                    <span>{order.quantity}</span>
                  </div>
                </div>
              ))}
          </div>
        </div>

        <div className="flex items-center justify-center font-bold text-xl" style={{ height: '40px', backgroundColor: '#FFEDE3' }}>
          済
        </div>

        <div 
          className="p-4 flex items-center justify-between" 
          style={{ height: '110px', backgroundColor: '#FDFFDA' }}
          onDragOver={handleDragOver}
          onDrop={handleDrop}
        >
          <div className="flex-1 flex gap-2 overflow-x-auto" style={{ maxHeight: '100px' }}>
            {completedOrders.map((order) => (
              <div 
                key={order.id} 
                draggable
                onDragStart={() => handleCompletedDragStart(order.id)}
                className="bg-orange-100 border-2 border-orange-300 rounded-lg p-2 flex-shrink-0 cursor-move"
              >
                <div className="font-bold text-sm">{order.name}</div>
                <div className="text-xs flex items-center gap-1">
                  <input type="radio" className="w-2 h-2" checked readOnly />
                  <span>{order.table}</span>
                  <span>:</span>
                  <input type="radio" className="w-2 h-2" checked readOnly />
                  <span>{order.quantity}</span>
                </div>
              </div>
            ))}
          </div>
          <button
            onClick={handleDeleteClick}
            className="p-3 hover:bg-red-100 rounded-lg transition-colors ml-4"
          >
            <Trash2 className="w-8 h-8 text-gray-700" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default OrderManagement;