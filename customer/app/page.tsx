"use client";
import { useState, useEffect } from "react";

export function Sample1() {
const tabs = ["おすすめ", "おつまみ", "揚げ物", "飲み物"];
  const [activeTab, setActiveTab] = useState("おすすめ");
  const [cartOpen, setCartOpen] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [paymentOpen, setPaymentOpen] = useState(false);
  const [cartItems, setCartItems] = useState<string[]>([]);

  // アクセシビリティ設定
  const [volume, setVolume] = useState(50);
  const [fontSize, setFontSize] = useState(16);
  const [ageGroup, setAgeGroup] = useState("一般");

  const addItemToCart = (item: string) => setCartItems((prev) => [...prev, item]);
  const clearCart = () => setCartItems([]);

  const tabItems: Record<string, string[]> = {
    おすすめ: ["ラーメン", "唐揚げ", "ポテト"],
    おつまみ: ["ラーメン", "キムチ", "餃子"],
    揚げ物: ["唐揚げ", "とんかつ", "エビフライ"],
    飲み物: ["ビール", "コーラ", "ウーロン茶"],
  };

  // ✅ 商品名ごとに数量を集計
  const itemCounts = cartItems.reduce<Record<string, number>>((acc, item) => {
    acc[item] = (acc[item] || 0) + 1;
    return acc;
  }, {});

  return (
    <div
      className="min-h-screen bg-white flex flex-col items-center pt-6 relative pb-24 transition-all"
      style={{ fontSize: `${fontSize}px` }}
    >
      {/* 🔳 黒背景付きタブバー */}
      <div className="w-full bg-black flex flex-col items-center">
        <div className="flex items-center justify-between w-full px-6 py-3 relative">
          <div className="flex space-x-2">
            {tabs.map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-6 py-3 rounded-t-md font-medium text-sm transition-all ${
                  activeTab === tab
                    ? "bg-orange-400 text-white"
                    : "bg-white text-gray-700 hover:bg-gray-200"
                }`}
              >
                {tab}
              </button>
            ))}
          </div>

          <div className="flex items-center space-x-3">
            {/* ✅ お支払いボタン */}
            <button
              onClick={() => setPaymentOpen(true)}
              className="text-black bg-white border border-gray-300 px-4 py-2 rounded-md text-sm font-medium hover:bg-gray-100"
            >
              お支払い
            </button>

            {/* ⚙️ 設定ボタン */}
            <button
              onClick={() => setSettingsOpen(true)}
              className="text-white hover:text-gray-300 text-3xl"
            >
              ⚙️
            </button>
          </div>
        </div>
      </div>

      {/* 商品グリッド */}
      <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4 mt-8 w-full px-6">
        {activeTab && tabItems[activeTab] && tabItems[activeTab].length > 0 ? (
          tabItems[activeTab].map((item) => (
            <div
              key={item}
              className="bg-gray-100 rounded-lg border border-gray-200 flex flex-col justify-center items-center hover:bg-orange-50 transition h-28"
            >
              <p className="text-gray-700 text-sm">{item}</p>
              <button
                onClick={() => addItemToCart(item)}
                className="mt-2 text-xs bg-orange-400 text-white px-2 py-1 rounded hover:bg-orange-500"
              >
                追加
              </button>
            </div>
          ))
        ) : (
          <div className="col-span-full text-center py-12 text-gray-500">
            <p>メニューを読み込み中...</p>
          </div>
        )}
      </div>

      {/* ✅ 注文確認モーダル */}
      {confirmOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-40">
          <div className="bg-white rounded-lg p-8 shadow-lg w-96 text-center relative">
            {/* ✅ モーダル右上に閉じる×ボタン */}
            <button
              onClick={() => setConfirmOpen(false)}
              className="absolute top-3 right-4 text-gray-500 hover:text-gray-700 text-2xl"
            >
              ×
            </button>

            <h2 className="text-lg font-bold mb-6">ご注文内容</h2>

            {Object.keys(itemCounts).length === 0 ? (
              <p className="text-gray-500 mb-6">カートは空です</p>
            ) : (
              <div className="grid grid-cols-2 gap-6 justify-center items-center mb-6">
                {Object.entries(itemCounts).map(([name, count]) => (
                  <div
                    key={name}
                    className="relative flex flex-col items-center justify-center"
                  >
                    {/* ✅ 各商品削除ボタン */}
                    <button
                      onClick={() =>
                        setCartItems((prev) => prev.filter((item) => item !== name))
                      }
                      className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-5 h-5 text-xs hover:bg-red-600"
                    >
                      ×
                    </button>

                    <div className="flex items-center justify-center space-x-2">
                      <div className="w-32 h-16 border border-gray-300 rounded-full flex items-center justify-center text-gray-700 font-medium text-base">
                        {name}
                      </div>
                      <span className="text-gray-700 font-bold text-base">
                        ×{count}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}

            <button
              onClick={() => setConfirmOpen(false)}
              className="bg-black text-white px-6 py-2 rounded hover:bg-gray-800"
            >
              送信
            </button>
          </div>
        </div>
      )}

      {/* ✅ お支払いモーダル */}
      {paymentOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-40">
          <div className="bg-white rounded-lg p-8 shadow-lg w-80 text-center relative">
            <button
              onClick={() => setPaymentOpen(false)}
              className="absolute top-3 right-4 text-gray-500 hover:text-gray-700 text-2xl"
            >
              ×
            </button>
          </div>
        </div>
      )}

      {/* 下部ナビゲーション */}
      <div className="fixed bottom-0 left-0 w-full bg-white border-t border-gray-200 py-3 flex justify-center items-center space-x-16">
        <button className="text-gray-600 hover:text-gray-800 text-3xl">🔔</button>

        <button
          onClick={() => setCartOpen(true)}
          className="relative text-gray-600 hover:text-gray-800 text-6xl"
        >
          🛒
          {cartItems.length > 0 && (
            <span className="absolute -top-3 -right-6 bg-orange-400 text-white font-bold w-8 h-8 flex items-center justify-center rounded-full text-sm">
              {cartItems.length}
            </span>
          )}
        </button>

        <button className="bg-black text-white px-8 py-2 rounded-md hover:bg-gray-800 transition text-lg">
          注文
        </button>
      </div>
    </div>
  );}
export function Sample2() {
   const tabs = ["おすすめ", "おつまみ", "揚げ物", "飲み物"];
  const [activeTab, setActiveTab] = useState("おすすめ");
  const [cartOpen, setCartOpen] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [paymentOpen, setPaymentOpen] = useState(false);
  const [cartItems, setCartItems] = useState<string[]>([]);

  // アクセシビリティ設定
  const [volume, setVolume] = useState(50);
  const [fontSize, setFontSize] = useState(16);
  const [ageGroup, setAgeGroup] = useState("一般");

  const addItemToCart = (item: string) => setCartItems((prev) => [...prev, item]);
  const clearCart = () => setCartItems([]);

  const tabItems: Record<string, string[]> = {
    おすすめ: ["ラーメン", "唐揚げ", "ポテト"],
    おつまみ: ["ラーメン", "キムチ", "餃子"],
    揚げ物: ["唐揚げ", "とんかつ", "エビフライ"],
    飲み物: ["ビール", "コーラ", "ウーロン茶"],
  };

  // ✅ 商品名ごとに数量を集計
  const itemCounts = cartItems.reduce<Record<string, number>>((acc, item) => {
    acc[item] = (acc[item] || 0) + 1;
    return acc;
  }, {});

  return (
    <div
      className="min-h-screen bg-white flex flex-col items-center pt-6 relative pb-24 transition-all"
      style={{ fontSize: `${fontSize}px` }}
    >
      {/* 🔳 黒背景付きタブバー */}
      <div className="w-full bg-black flex flex-col items-center">
        <div className="flex items-center justify-between w-full px-6 py-3 relative">
          <div className="flex space-x-2">
            {tabs.map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-6 py-3 rounded-t-md font-medium text-sm transition-all ${
                  activeTab === tab
                    ? "bg-orange-400 text-white"
                    : "bg-white text-gray-700 hover:bg-gray-200"
                }`}
              >
                {tab}
              </button>
            ))}
          </div>

          <div className="flex items-center space-x-3">
            {/* ✅ お支払いボタン */}
            <button
              onClick={() => setPaymentOpen(true)}
              className="text-black bg-white border border-gray-300 px-4 py-2 rounded-md text-sm font-medium hover:bg-gray-100"
            >
              お支払い
            </button>

            {/* ⚙️ 設定ボタン */}
            <button
              onClick={() => setSettingsOpen(true)}
              className="text-white hover:text-gray-300 text-3xl"
            >
              ⚙️
            </button>
          </div>
        </div>
      </div>

      {/* 商品グリッド */}
      <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4 mt-8 w-full px-6">
        {activeTab && tabItems[activeTab] && tabItems[activeTab].length > 0 ? (
          tabItems[activeTab].map((item) => (
            <div
              key={item}
              className="bg-gray-100 rounded-lg border border-gray-200 flex flex-col justify-center items-center hover:bg-orange-50 transition h-28"
            >
              <p className="text-gray-700 text-sm">{item}</p>
              <button
                onClick={() => addItemToCart(item)}
                className="mt-2 text-xs bg-orange-400 text-white px-2 py-1 rounded hover:bg-orange-500"
              >
                追加
              </button>
            </div>
          ))
        ) : (
          <div className="col-span-full text-center py-12 text-gray-500">
            <p>メニューを読み込み中...</p>
          </div>
        )}
      </div>

      {/* ✅ 注文確認モーダル */}
      {confirmOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-40">
          <div className="bg-white rounded-lg p-8 shadow-lg w-96 text-center relative">
            {/* ✅ モーダル右上に閉じる×ボタン */}
            <button
              onClick={() => setConfirmOpen(false)}
              className="absolute top-3 right-4 text-gray-500 hover:text-gray-700 text-2xl"
            >
              ×
            </button>

            <h2 className="text-lg font-bold mb-6">ご注文内容</h2>

            {Object.keys(itemCounts).length === 0 ? (
              <p className="text-gray-500 mb-6">カートは空です</p>
            ) : (
              <div className="grid grid-cols-2 gap-6 justify-center items-center mb-6">
                {Object.entries(itemCounts).map(([name, count]) => (
                  <div
                    key={name}
                    className="relative flex flex-col items-center justify-center"
                  >
                    {/* ✅ 各商品削除ボタン */}
                    <button
                      onClick={() =>
                        setCartItems((prev) => prev.filter((item) => item !== name))
                      }
                      className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-5 h-5 text-xs hover:bg-red-600"
                    >
                      ×
                    </button>

                    <div className="flex items-center justify-center space-x-2">
                      <div className="w-32 h-16 border border-gray-300 rounded-full flex items-center justify-center text-gray-700 font-medium text-base">
                        {name}
                      </div>
                      <span className="text-gray-700 font-bold text-base">
                        ×{count}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}

            <button
              onClick={() => setConfirmOpen(false)}
              className="bg-black text-white px-6 py-2 rounded hover:bg-gray-800"
            >
              送信
            </button>
          </div>
        </div>
      )}

      {/* ✅ お支払いモーダル */}
      {paymentOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-40">
          <div className="bg-white rounded-lg p-8 shadow-lg w-80 text-center relative">
            <button
              onClick={() => setPaymentOpen(false)}
              className="absolute top-3 right-4 text-gray-500 hover:text-gray-700 text-2xl"
            >
              ×
            </button>
          </div>
        </div>
      )}

      {/* 下部ナビゲーション */}
      <div className="fixed bottom-0 left-0 w-full bg-white border-t border-gray-200 py-3 flex justify-center items-center space-x-16">
        <button className="text-gray-600 hover:text-gray-800 text-3xl">🔔</button>

        <button
          onClick={() => setCartOpen(true)}
          className="relative text-gray-600 hover:text-gray-800 text-6xl"
        >
          🛒
          {cartItems.length > 0 && (
            <span className="absolute -top-3 -right-6 bg-orange-400 text-white font-bold w-8 h-8 flex items-center justify-center rounded-full text-sm">
              {cartItems.length}
            </span>
          )}
        </button>

        <button className="bg-black text-white px-8 py-2 rounded-md hover:bg-gray-800 transition text-lg">
          注文
        </button>
      </div>
    </div>
  );
}
export default function Sample3() {
  const [tabs, setTabs] = useState<MenuTab[]>([]);
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [tabItems, setTabItems] = useState<Record<string, string[]>>({});
  const [activeTab, setActiveTab] = useState<string>("");
  const [cartOpen, setCartOpen] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [paymentOpen, setPaymentOpen] = useState(false);
  const [cartItems, setCartItems] = useState<string[]>([]);
  const [isOrdering, setIsOrdering] = useState(false);

  // アクセシビリティ設定
  const [volume, setVolume] = useState(50);
  const [fontSize, setFontSize] = useState(16);
  const [ageGroup, setAgeGroup] = useState("一般");

  const addItemToCart = (item: string) => setCartItems((prev) => [...prev, item]);
  const clearCart = () => setCartItems([]);

  // バックエンドからメニューを取得
  useEffect(() => {
    const fetchMenu = async () => {
      try {
        // タブを取得
        const tabsResponse = await fetch("http://localhost:3001/api/menu/tabs");
        let tabsData: MenuTab[] = [];
        if (tabsResponse.ok) {
          tabsData = await tabsResponse.json();
          setTabs(tabsData);
        } else {
          console.error("タブの取得に失敗しました:", tabsResponse.status);
          return;
        }

        // メニューアイテムを取得
        const itemsResponse = await fetch("http://localhost:3001/api/menu/items");
        if (itemsResponse.ok) {
          const itemsData = await itemsResponse.json();
          setMenuItems(itemsData);

          // タブごとにメニューアイテムをグループ化
          const grouped: Record<string, string[]> = {};
          tabsData.forEach((tab: MenuTab) => {
            grouped[tab.name] = itemsData
              .filter((item: MenuItem) => item.tabId === tab.id)
              .map((item: MenuItem) => item.name);
          });
          setTabItems(grouped);
          
          // グループ化後にactiveTabを設定（初回のみ）
          if (tabsData.length > 0 && activeTab === "") {
            setActiveTab(tabsData[0].name);
          }
        } else {
          console.error("メニューアイテムの取得に失敗しました:", itemsResponse.status);
        }
      } catch (error) {
        console.error("メニューの取得に失敗しました:", error);
      }
    };

    fetchMenu();
    // 定期的に更新（5秒ごと）
    const interval = setInterval(fetchMenu, 5000);
    return () => clearInterval(interval);
  }, []);

  // 注文を送信する関数
  const handleOrder = async () => {
    if (cartItems.length === 0) {
      alert("カートが空です");
      return;
    }

    setIsOrdering(true);
    try {
      const now = new Date();
      const timeStr = `${now.getHours()}:${String(now.getMinutes()).padStart(2, '0')}`;

      // カート内の各アイテムを注文として送信
      const orderPromises = cartItems.map(async (item) => {
        // メニューアイテムからカテゴリを取得
        const menuItem = menuItems.find((mi) => mi.name === item);
        const category = menuItem ? menuItem.category : "一品"; // デフォルト

        const response = await fetch("http://localhost:3001/api/orders", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            category,
            name: item,
            table: "1", // 仮の卓番、後で実装
            quantity: "1",
            time: timeStr,
          }),
        }).catch((fetchError) => {
          console.error("ネットワークエラー:", fetchError);
          throw new Error("バックエンドサーバーに接続できません。サーバーが起動しているか確認してください。");
        });

        if (!response.ok) {
          const errorText = await response.text().catch(() => "不明なエラー");
          throw new Error(`注文の送信に失敗しました: ${errorText}`);
        }

        return response.json();
      });

      await Promise.all(orderPromises);
      alert("注文が送信されました！");
      clearCart();
      setCartOpen(false);
    } catch (error) {
      console.error("注文エラー:", error);
      alert("注文の送信に失敗しました。もう一度お試しください。");
    } finally {
      setIsOrdering(false);
    }
  };

  // ✅ 商品名ごとに数量を集計
  const itemCounts = cartItems.reduce<Record<string, number>>((acc, item) => {
    acc[item] = (acc[item] || 0) + 1;
    return acc;
  }, {});

  return (
    <div
      className="min-h-screen bg-white flex flex-col items-center pt-6 relative pb-24 transition-all"
      style={{ fontSize: `${fontSize}px` }}
    >
      {/* タブメニュー */}
      <div className="flex items-center justify-between bg-gray-100 px-6 py-3 shadow-sm w-full">
        <div className="flex space-x-2">
          {tabs.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-6 py-3 rounded-t-md font-medium text-sm transition-all ${
                activeTab === tab
                  ? "bg-orange-400 text-white"
                  : "bg-white text-gray-600 hover:bg-gray-200"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
        <button
          onClick={() => setSettingsOpen(true)}
          className="text-gray-600 hover:text-gray-800 text-3xl"
        >
          ⚙️
        </button>
      </div>

      {/* 商品グリッド */}
      <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4 mt-8 w-full px-6">
        {activeTab && tabItems[activeTab] && tabItems[activeTab].length > 0 ? (
          tabItems[activeTab].map((item) => (
            <div
              key={item}
              className="bg-gray-100 rounded-lg border border-gray-200 flex flex-col justify-center items-center hover:bg-orange-50 transition h-28"
            >
              <p className="text-gray-700 text-sm">{item}</p>
              <button
                onClick={() => addItemToCart(item)}
                className="mt-2 text-xs bg-orange-400 text-white px-2 py-1 rounded hover:bg-orange-500"
              >
                追加
              </button>
            </div>
          ))
        ) : (
          <div className="col-span-full text-center py-12 text-gray-500">
            <p>メニューを読み込み中...</p>
          </div>
        )}
      </div>

      {/* ✅ 注文確認モーダル */}
      {confirmOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-40">
          <div className="bg-white rounded-lg p-8 shadow-lg w-96 text-center relative">
            {/* ✅ モーダル右上に閉じる×ボタン */}
            <button
              onClick={() => setConfirmOpen(false)}
              className="absolute top-3 right-4 text-gray-500 hover:text-gray-700 text-2xl"
            >
              ×
            </button>

            <h2 className="text-lg font-bold mb-6">ご注文内容</h2>

            {Object.keys(itemCounts).length === 0 ? (
              <p className="text-gray-500 mb-6">カートは空です</p>
            ) : (
              <div className="grid grid-cols-2 gap-6 justify-center items-center mb-6">
                {Object.entries(itemCounts).map(([name, count]) => (
                  <div
                    key={name}
                    className="relative flex flex-col items-center justify-center"
                  >
                    {/* ✅ 各商品削除ボタン */}
                    <button
                      onClick={() =>
                        setCartItems((prev) => prev.filter((item) => item !== name))
                      }
                      className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-5 h-5 text-xs hover:bg-red-600"
                    >
                      ×
                    </button>

                    <div className="flex items-center justify-center space-x-2">
                      <div className="w-32 h-16 border border-gray-300 rounded-full flex items-center justify-center text-gray-700 font-medium text-base">
                        {name}
                      </div>
                      <span className="text-gray-700 font-bold text-base">
                        ×{count}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}

            <button
              onClick={() => setConfirmOpen(false)}
              className="bg-black text-white px-6 py-2 rounded hover:bg-gray-800"
            >
              送信
            </button>
          </div>
        </div>
      )}

      {/* ✅ お支払いモーダル */}
      {paymentOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-40">
          <div className="bg-white rounded-lg p-8 shadow-lg w-80 text-center relative">
            <button
              onClick={() => setPaymentOpen(false)}
              className="absolute top-3 right-4 text-gray-500 hover:text-gray-700 text-2xl"
            >
              ×
            </button>
          </div>
        </div>
      )}

      {/* 下部ナビゲーション */}
      <div className="fixed bottom-0 left-0 w-full bg-white border-t border-gray-200 py-3 flex justify-center items-center space-x-16">
        <button className="text-gray-600 hover:text-gray-800 text-3xl">🔔</button>

        <button
          onClick={() => setCartOpen(true)}
          className="relative text-gray-600 hover:text-gray-800 text-6xl"
        >
          🛒
          {cartItems.length > 0 && (
            <span className="absolute -top-3 -right-6 bg-orange-400 text-white font-bold w-8 h-8 flex items-center justify-center rounded-full text-sm">
              {cartItems.length}
            </span>
          )}
        </button>

        <button className="bg-black text-white px-8 py-2 rounded-md hover:bg-gray-800 transition text-lg">
          注文
        </button>
      </div>
    </div>
  );
}
