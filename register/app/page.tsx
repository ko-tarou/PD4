"use client";
import { useState, useEffect } from "react";

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

export default function RegisterPage() {
  const [selectedTable, setSelectedTable] = useState<string>("1");
  const [orders, setOrders] = useState<Order[]>([]);
  const [allOrders, setAllOrders] = useState<Order[]>([]);
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showReceipt, setShowReceipt] = useState(false);

  // バックエンドからメニューアイテムを取得
  const fetchMenuItems = async () => {
    try {
      const response = await fetch("http://localhost:3001/api/menu/items");
      if (response.ok) {
        const data = await response.json();
        setMenuItems(data);
      }
    } catch (error) {
      console.error("メニューアイテムの取得に失敗しました:", error);
    }
  };

  // バックエンドから全注文を取得
  const fetchOrders = async () => {
    try {
      const response = await fetch("http://localhost:3001/api/orders");
      if (response.ok) {
        const data = await response.json();
        setAllOrders(data);
        // 選択された卓番の注文をフィルタリング（重複を除去）
        const tableOrders = data
          .filter(
            (order: Order) => order.table === `${selectedTable}番` || order.table === selectedTable
          )
          .filter((order: Order, index: number, self: Order[]) => 
            index === self.findIndex((o: Order) => o.id === order.id)
          ); // 同じIDの重複を除去
        setOrders(tableOrders);
      }
    } catch (error) {
      console.error("注文の取得に失敗しました:", error);
    }
  };

  // 初回ロード時にメニューアイテムを取得
  useEffect(() => {
    fetchMenuItems();
  }, []);

  // 卓番が変更されたら注文を再取得
  useEffect(() => {
    fetchOrders();
    const interval = setInterval(fetchOrders, 2000); // 2秒ごとに更新
    return () => clearInterval(interval);
  }, [selectedTable]);

  // 注文の数量を数値に変換
  const getQuantity = (quantityStr: string): number => {
    const match = quantityStr.match(/(\d+)/);
    return match ? parseInt(match[1], 10) : 1;
  };

  // 注文の価格を計算
  const getOrderPrice = (order: Order): number => {
    if (!menuItems || menuItems.length === 0) {
      return 500 * getQuantity(order.quantity); // メニューが読み込まれるまでのデフォルト価格
    }
    const menuItem = menuItems.find((item) => item.name === order.name);
    const basePrice = menuItem ? menuItem.price : 500; // デフォルト価格
    const quantity = getQuantity(order.quantity);
    return basePrice * quantity;
  };

  // 合計金額を計算
  const totalAmount = orders.reduce((sum, order) => sum + getOrderPrice(order), 0);

  // 支払い処理
  const handlePayment = async () => {
    if (orders.length === 0) {
      alert("注文がありません");
      return;
    }

    setIsLoading(true);
    try {
      // 注文を完了として削除
      const deletePromises = orders.map((order) =>
        fetch(`http://localhost:3001/api/orders/${order.id}/complete`, {
          method: "PATCH",
        })
      );

      await Promise.all(deletePromises);
      setShowReceipt(true);
      setOrders([]);
      setTimeout(() => {
        setShowReceipt(false);
        fetchOrders();
      }, 3000);
    } catch (error) {
      console.error("支払い処理エラー:", error);
      alert("支払い処理に失敗しました");
    } finally {
      setIsLoading(false);
    }
  };

  // 個別注文を削除
  const handleDeleteOrder = async (orderId: number) => {
    if (!confirm("この注文を削除しますか？")) return;

    try {
      const response = await fetch(`http://localhost:3001/api/orders/${orderId}`, {
        method: "DELETE",
      });

      if (response.ok) {
        fetchOrders();
      }
    } catch (error) {
      console.error("注文削除エラー:", error);
      alert("注文の削除に失敗しました");
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-6xl mx-auto">
        {/* ヘッダー */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h1 className="text-3xl font-bold text-gray-800 mb-4">レジ</h1>
          
          {/* 卓番選択 */}
          <div className="flex items-center gap-4">
            <label className="text-lg font-semibold text-gray-700">卓番:</label>
            <div className="flex gap-2 flex-wrap">
              {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((tableNum) => (
                <button
                  key={tableNum}
                  onClick={() => setSelectedTable(tableNum.toString())}
                  className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                    selectedTable === tableNum.toString()
                      ? "bg-orange-500 text-white"
                      : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                  }`}
                >
                  {tableNum}番
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* 注文一覧 */}
          <div className="lg:col-span-2 bg-white rounded-lg shadow-md p-6">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">
              {selectedTable}番の注文
            </h2>

            {orders.length === 0 ? (
              <div className="text-center py-12 text-gray-500">
                <p className="text-lg">注文がありません</p>
              </div>
            ) : (
              <div className="space-y-3">
                {orders.map((order, index) => {
                  const price = getOrderPrice(order);
                  const quantity = getQuantity(order.quantity);
                  return (
                    <div
                      key={`${order.id}-${index}-${order.table}`}
                      className="border-2 border-gray-200 rounded-lg p-4 hover:border-orange-300 transition-colors"
                    >
                      <div className="flex justify-between items-start mb-2">
                        <div className="flex-1">
                          <h3 className="text-xl font-bold text-gray-800">
                            {order.name}
                          </h3>
                          <div className="text-sm text-gray-600 mt-1">
                            <span className="inline-block bg-gray-100 px-2 py-1 rounded mr-2">
                              {order.category}
                            </span>
                            <span>数量: {quantity}個</span>
                            <span className="ml-4">時間: {order.time}</span>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-2xl font-bold text-orange-600">
                            ¥{price.toLocaleString()}
                          </div>
                          <div className="text-sm text-gray-500">
                            {(() => {
                              const menuItem = menuItems && menuItems.length > 0 ? menuItems.find((item) => item.name === order.name) : null;
                              const unitPrice = menuItem ? menuItem.price : 500;
                              return `¥${unitPrice.toLocaleString()} × ${quantity}`;
                            })()}
                          </div>
                        </div>
                      </div>
                      <button
                        onClick={() => handleDeleteOrder(order.id)}
                        className="mt-2 text-sm text-red-600 hover:text-red-800 font-medium"
                      >
                        削除
                      </button>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* 合計・支払いエリア */}
          <div className="bg-white rounded-lg shadow-md p-6 sticky top-6">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">合計</h2>
            
            <div className="space-y-4 mb-6">
              <div className="flex justify-between text-lg">
                <span className="text-gray-600">小計</span>
                <span className="font-semibold">¥{totalAmount.toLocaleString()}</span>
              </div>
              <div className="border-t border-gray-200 pt-2">
                <div className="flex justify-between text-2xl font-bold">
                  <span>合計</span>
                  <span className="text-orange-600">¥{totalAmount.toLocaleString()}</span>
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <button
                onClick={handlePayment}
                disabled={isLoading || orders.length === 0}
                className="w-full bg-green-500 hover:bg-green-600 text-white font-bold py-4 rounded-lg text-xl transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? "処理中..." : "支払い完了"}
              </button>
              
              <button
                onClick={fetchOrders}
                className="w-full bg-gray-200 hover:bg-gray-300 text-gray-700 font-bold py-3 rounded-lg transition-colors"
              >
                更新
              </button>
            </div>

            {/* レシート表示 */}
            {showReceipt && (
              <div className="mt-6 p-4 bg-green-50 border-2 border-green-500 rounded-lg">
                <p className="text-green-800 font-bold text-center">
                  ✓ 支払いが完了しました
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
