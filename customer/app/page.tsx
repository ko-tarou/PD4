"use client";
import { useState, useEffect } from "react";

export function Sample1() {
  const tabs = ["おすすめ", "おつまみ", "揚げ物", "飲み物"];
  const [activeTab, setActiveTab] = useState("おすすめ");
  const [cartOpen, setCartOpen] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [cartItems, setCartItems] = useState<string[]>([]);

  // アクセシビリティ設定
  const [volume, setVolume] = useState(50);
  const [fontSize, setFontSize] = useState(16);
  const [ageGroup, setAgeGroup] = useState("一般");

  const addItemToCart = (item: string) => setCartItems((prev) => [...prev, item]);
  const removeItem = (index: number) =>
    setCartItems((prev) => prev.filter((_, i) => i !== index));
  const clearCart = () => setCartItems([]);

  const tabItems: Record<string, string[]> = {
    おすすめ: ["ラーメン", "唐揚げ", "ポテト"],
    おつまみ: ["ラーメン", "キムチ", "餃子"],
    揚げ物: ["唐揚げ", "とんかつ", "エビフライ"],
    飲み物: ["ビール", "コーラ", "ウーロン茶"],
  };

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

      {/* コンテンツ枠 */}
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

      {/* カートモーダル */}
      {cartOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-20">
          <div className="bg-white rounded-lg shadow-lg p-6 w-96 relative">
            <button
              onClick={() => setCartOpen(false)}
              className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
            >
              ✕
            </button>
            <h2 className="text-lg font-bold mb-3">カート</h2>
            {cartItems.length === 0 ? (
              <p className="text-gray-500 text-sm">カートは空です</p>
            ) : (
              <ul className="space-y-2 mb-3">
                {cartItems.map((item, index) => (
                  <li
                    key={index}
                    className="flex justify-between items-center border-b border-gray-200 pb-1"
                  >
                    <span>{item}</span>
                    <button
                      onClick={() => removeItem(index)}
                      className="text-xs text-red-500 hover:text-red-600"
                    >
                      削除
                    </button>
                  </li>
                ))}
              </ul>
            )}
            {cartItems.length > 0 && (
              <button
                onClick={clearCart}
                className="bg-gray-200 text-gray-700 w-full py-1 rounded hover:bg-gray-300 text-sm"
              >
                カートを空にする
              </button>
            )}
          </div>
        </div>
      )}

      {/* アクセシビリティ設定モーダル */}
      {settingsOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-30">
          <div className="bg-white rounded-lg shadow-lg p-6 w-96 relative">
            <button
              onClick={() => setSettingsOpen(false)}
              className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
            >
              ✕
            </button>
            <h2 className="text-lg font-bold mb-4">アクセシビリティ設定</h2>

            {/* 音量設定 */}
            <label className="block mb-4">
              <span className="text-gray-700 text-sm font-medium">音量</span>
              <input
                type="range"
                min="0"
                max="100"
                value={volume}
                onChange={(e) => setVolume(Number(e.target.value))}
                className="w-full mt-2"
              />
              <p className="text-xs text-gray-500 text-right">{volume}%</p>
            </label>

            {/* 文字サイズ設定 */}
            <label className="block mb-4">
              <span className="text-gray-700 text-sm font-medium">文字の大きさ</span>
              <input
                type="range"
                min="12"
                max="28"
                value={fontSize}
                onChange={(e) => setFontSize(Number(e.target.value))}
                className="w-full mt-2"
              />
              <p className="text-xs text-gray-500 text-right">{fontSize}px</p>
            </label>

            {/* 年齢別設定 */}
            <label className="block mb-6">
              <span className="text-gray-700 text-sm font-medium">年齢別おすすめ設定</span>
              <select
                value={ageGroup}
                onChange={(e) => {
                  setAgeGroup(e.target.value);
                  if (e.target.value === "子ども") {
                    setFontSize(20);
                    setVolume(30);
                  } else if (e.target.value === "高齢者") {
                    setFontSize(24);
                    setVolume(70);
                  } else {
                    setFontSize(16);
                    setVolume(50);
                  }
                }}
                className="w-full mt-2 border rounded px-2 py-1"
              >
                <option value="一般">一般</option>
                <option value="子ども">子ども向け</option>
                <option value="高齢者">高齢者向け</option>
              </select>
            </label>

            <button
              onClick={() => setSettingsOpen(false)}
              className="bg-orange-400 text-white w-full py-2 rounded hover:bg-orange-500 transition"
            >
              保存して閉じる
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

        <button
          onClick={handleOrder}
          disabled={isOrdering || cartItems.length === 0}
          className="bg-black text-white px-8 py-2 rounded-md hover:bg-gray-800 transition text-lg disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isOrdering ? "送信中..." : "注文"}
        </button>
      </div>
    </div>
  );
}
export function Sample2() {
  const tabs = ["おすすめ", "おつまみ", "揚げ物", "飲み物"];
  const [activeTab, setActiveTab] = useState("おすすめ");
  const [cartOpen, setCartOpen] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [cartItems, setCartItems] = useState<string[]>([]);

  // アクセシビリティ設定
  const [volume, setVolume] = useState(50);
  const [fontSize, setFontSize] = useState(16);
  const [ageGroup, setAgeGroup] = useState("一般");

  const addItemToCart = (item: string) => setCartItems((prev) => [...prev, item]);
  const removeItem = (index: number) =>
    setCartItems((prev) => prev.filter((_, i) => i !== index));
  const clearCart = () => setCartItems([]);

  const tabItems: Record<string, string[]> = {
    おすすめ: ["ラーメン", "唐揚げ", "ポテト"],
    おつまみ: ["ラーメン", "キムチ", "餃子"],
    揚げ物: ["唐揚げ", "とんかつ", "エビフライ"],
    飲み物: ["ビール", "コーラ", "ウーロン茶"],
  };

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

      {/* コンテンツ枠 */}
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

      {/* カートモーダル */}
      {cartOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-20">
          <div className="bg-white rounded-lg shadow-lg p-6 w-96 relative">
            <button
              onClick={() => setCartOpen(false)}
              className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
            >
              ✕
            </button>
            <h2 className="text-lg font-bold mb-3">カート</h2>
            {cartItems.length === 0 ? (
              <p className="text-gray-500 text-sm">カートは空です</p>
            ) : (
              <ul className="space-y-2 mb-3">
                {cartItems.map((item, index) => (
                  <li
                    key={index}
                    className="flex justify-between items-center border-b border-gray-200 pb-1"
                  >
                    <span>{item}</span>
                    <button
                      onClick={() => removeItem(index)}
                      className="text-xs text-red-500 hover:text-red-600"
                    >
                      削除
                    </button>
                  </li>
                ))}
              </ul>
            )}
            {cartItems.length > 0 && (
              <button
                onClick={clearCart}
                className="bg-gray-200 text-gray-700 w-full py-1 rounded hover:bg-gray-300 text-sm"
              >
                カートを空にする
              </button>
            )}
          </div>
        </div>
      )}

      {/* アクセシビリティ設定モーダル */}
      {settingsOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-30">
          <div className="bg-white rounded-lg shadow-lg p-6 w-96 relative">
            <button
              onClick={() => setSettingsOpen(false)}
              className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
            >
              ✕
            </button>
            <h2 className="text-lg font-bold mb-4">アクセシビリティ設定</h2>

            {/* 音量設定 */}
            <label className="block mb-4">
              <span className="text-gray-700 text-sm font-medium">音量</span>
              <input
                type="range"
                min="0"
                max="100"
                value={volume}
                onChange={(e) => setVolume(Number(e.target.value))}
                className="w-full mt-2"
              />
              <p className="text-xs text-gray-500 text-right">{volume}%</p>
            </label>

            {/* 文字サイズ設定 */}
            <label className="block mb-4">
              <span className="text-gray-700 text-sm font-medium">文字の大きさ</span>
              <input
                type="range"
                min="12"
                max="28"
                value={fontSize}
                onChange={(e) => setFontSize(Number(e.target.value))}
                className="w-full mt-2"
              />
              <p className="text-xs text-gray-500 text-right">{fontSize}px</p>
            </label>

            {/* 年齢別設定 */}
            <label className="block mb-6">
              <span className="text-gray-700 text-sm font-medium">年齢別おすすめ設定</span>
              <select
                value={ageGroup}
                onChange={(e) => {
                  setAgeGroup(e.target.value);
                  if (e.target.value === "子ども") {
                    setFontSize(20);
                    setVolume(30);
                  } else if (e.target.value === "高齢者") {
                    setFontSize(24);
                    setVolume(70);
                  } else {
                    setFontSize(16);
                    setVolume(50);
                  }
                }}
                className="w-full mt-2 border rounded px-2 py-1"
              >
                <option value="一般">一般</option>
                <option value="子ども">子ども向け</option>
                <option value="高齢者">高齢者向け</option>
              </select>
            </label>

            <button
              onClick={() => setSettingsOpen(false)}
              className="bg-orange-400 text-white w-full py-2 rounded hover:bg-orange-500 transition"
            >
              保存して閉じる
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

        <button
          onClick={handleOrder}
          disabled={isOrdering || cartItems.length === 0}
          className="bg-black text-white px-8 py-2 rounded-md hover:bg-gray-800 transition text-lg disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isOrdering ? "送信中..." : "注文"}
        </button>
      </div>
    </div>
  );
}
interface MenuTab {
  id: number;
  name: string;
  order: number;
}

interface MenuItem {
  id: number;
  tabId: number;
  name: string;
  price: number;
  category: string;
}

export default function Sample3() {
  // 年齢選択が完了したかどうか
  const [ageSelected, setAgeSelected] = useState<string | null>(null);
  
  const [tabs, setTabs] = useState<MenuTab[]>([]);
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [tabItems, setTabItems] = useState<Record<string, string[]>>({});
  const [activeTab, setActiveTab] = useState<string>("");
  const [cartOpen, setCartOpen] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [cartItems, setCartItems] = useState<string[]>([]);
  const [isOrdering, setIsOrdering] = useState(false);

  // アクセシビリティ設定
  const [volume, setVolume] = useState(50);
  const [fontSize, setFontSize] = useState(16);
  const [ageGroup, setAgeGroup] = useState("一般");

  const addItemToCart = (item: string) => setCartItems((prev) => [...prev, item]);
  const removeItem = (index: number) =>
    setCartItems((prev) => prev.filter((_, i) => i !== index));
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

  // 年齢選択画面を表示
  if (!ageSelected) {
    const selectAge = (age: string) => {
      setAgeSelected(age);
      // 年齢に応じて設定を調整
      if (age === "12以下") {
        setAgeGroup("子ども");
        setFontSize(20);
        setVolume(30);
      } else if (age === "60以上") {
        setAgeGroup("高齢者");
        setFontSize(24);
        setVolume(70);
      } else {
        setAgeGroup("一般");
        setFontSize(16);
        setVolume(50);
      }
    };

    return (
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '100vh',
        background: '#f0f0f0',
        fontFamily: "'Hiragino Sans', 'Hiragino Kaku Gothic ProN', Meiryo, sans-serif"
      }}>
        <div style={{
          width: '840px',
          height: '700px',
          background: 'white',
          border: '3px solid white',
          borderRadius: '20px',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          padding: '60px',
          position: 'relative'
        }}>
          {/* Corner decorations */}
          <div style={{
            position: 'absolute',
            width: '40px',
            height: '40px',
            border: '4px solid white',
            top: '-4px',
            left: '-4px',
            borderRight: 'none',
            borderBottom: 'none'
          }} />
          <div style={{
            position: 'absolute',
            width: '40px',
            height: '40px',
            border: '4px solid white',
            top: '-4px',
            right: '-4px',
            borderLeft: 'none',
            borderBottom: 'none'
          }} />
          <div style={{
            position: 'absolute',
            width: '40px',
            height: '40px',
            border: '4px solid white',
            bottom: '-4px',
            left: '-4px',
            borderRight: 'none',
            borderTop: 'none'
          }} />
          <div style={{
            position: 'absolute',
            width: '40px',
            height: '40px',
            border: '4px solid white',
            bottom: '-4px',
            right: '-4px',
            borderLeft: 'none',
            borderTop: 'none'
          }} />
          
          <h1 style={{
            fontSize: '42px',
            fontWeight: 'bold',
            color: '#333',
            marginBottom: '30px',
            letterSpacing: '2px'
          }}>
            年齢確認
          </h1>
          
          <p style={{
            fontSize: '20px',
            color: '#666',
            marginBottom: '50px',
            letterSpacing: '1px'
          }}>
            ご注文に進む前に年齢をお選びください
          </p>
          
          <button 
            onClick={() => selectAge('12以下')}
            style={{
              width: '450px',
              height: '80px',
              background: 'linear-gradient(180deg, #ff9d2e 0%, #ff8c00 100%)',
              border: 'none',
              borderRadius: '50px',
              fontSize: '26px',
              fontWeight: 'bold',
              color: 'white',
              cursor: 'pointer',
              margin: '12px 0',
              boxShadow: '0 6px 0 #d97700',
              letterSpacing: '2px',
              transition: 'all 0.1s'
            }}
          >
            12歳以下
          </button>
          
          <button 
            onClick={() => selectAge('12以上')}
            style={{
              width: '450px',
              height: '80px',
              background: 'linear-gradient(180deg, #ff9d2e 0%, #ff8c00 100%)',
              border: 'none',
              borderRadius: '50px',
              fontSize: '26px',
              fontWeight: 'bold',
              color: 'white',
              cursor: 'pointer',
              margin: '12px 0',
              boxShadow: '0 6px 0 #d97700',
              letterSpacing: '2px',
              transition: 'all 0.1s'
            }}
          >
            12歳以上
          </button>
          
          <button 
            onClick={() => selectAge('60以上')}
            style={{
              width: '450px',
              height: '80px',
              background: 'linear-gradient(180deg, #ff9d2e 0%, #ff8c00 100%)',
              border: 'none',
              borderRadius: '50px',
              fontSize: '26px',
              fontWeight: 'bold',
              color: 'white',
              cursor: 'pointer',
              margin: '12px 0',
              boxShadow: '0 6px 0 #d97700',
              letterSpacing: '2px',
              transition: 'all 0.1s'
            }}
          >
            60歳以上
          </button>
        </div>
      </div>
    );
  }

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
              key={tab.id}
              onClick={() => setActiveTab(tab.name)}
              className={`px-6 py-3 rounded-t-md font-medium text-sm transition-all ${
                activeTab === tab.name
                  ? "bg-orange-400 text-white"
                  : "bg-white text-gray-600 hover:bg-gray-200"
              }`}
            >
              {tab.name}
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

      {/* コンテンツ枠 */}
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

      {/* カートモーダル */}
      {cartOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-20">
          <div className="bg-white rounded-lg shadow-lg p-6 w-96 relative">
            <button
              onClick={() => setCartOpen(false)}
              className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
            >
              ✕
            </button>
            <h2 className="text-lg font-bold mb-3">カート</h2>
            {cartItems.length === 0 ? (
              <p className="text-gray-500 text-sm">カートは空です</p>
            ) : (
              <ul className="space-y-2 mb-3">
                {cartItems.map((item, index) => (
                  <li
                    key={index}
                    className="flex justify-between items-center border-b border-gray-200 pb-1"
                  >
                    <span>{item}</span>
                    <button
                      onClick={() => removeItem(index)}
                      className="text-xs text-red-500 hover:text-red-600"
                    >
                      削除
                    </button>
                  </li>
                ))}
              </ul>
            )}
            {cartItems.length > 0 && (
              <button
                onClick={clearCart}
                className="bg-gray-200 text-gray-700 w-full py-1 rounded hover:bg-gray-300 text-sm"
              >
                カートを空にする
              </button>
            )}
          </div>
        </div>
      )}

      {/* アクセシビリティ設定モーダル */}
      {settingsOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-30">
          <div className="bg-white rounded-lg shadow-lg p-6 w-96 relative">
            <button
              onClick={() => setSettingsOpen(false)}
              className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
            >
              ✕
            </button>
            <h2 className="text-lg font-bold mb-4">アクセシビリティ設定</h2>

            {/* 音量設定 */}
            <label className="block mb-4">
              <span className="text-gray-700 text-sm font-medium">音量</span>
              <input
                type="range"
                min="0"
                max="100"
                value={volume}
                onChange={(e) => setVolume(Number(e.target.value))}
                className="w-full mt-2"
              />
              <p className="text-xs text-gray-500 text-right">{volume}%</p>
            </label>

            {/* 文字サイズ設定 */}
            <label className="block mb-4">
              <span className="text-gray-700 text-sm font-medium">文字の大きさ</span>
              <input
                type="range"
                min="12"
                max="28"
                value={fontSize}
                onChange={(e) => setFontSize(Number(e.target.value))}
                className="w-full mt-2"
              />
              <p className="text-xs text-gray-500 text-right">{fontSize}px</p>
            </label>

            {/* 年齢別設定 */}
            <label className="block mb-6">
              <span className="text-gray-700 text-sm font-medium">年齢別おすすめ設定</span>
              <select
                value={ageGroup}
                onChange={(e) => {
                  setAgeGroup(e.target.value);
                  if (e.target.value === "子ども") {
                    setFontSize(20);
                    setVolume(30);
                  } else if (e.target.value === "高齢者") {
                    setFontSize(24);
                    setVolume(70);
                  } else {
                    setFontSize(16);
                    setVolume(50);
                  }
                }}
                className="w-full mt-2 border rounded px-2 py-1"
              >
                <option value="一般">一般</option>
                <option value="子ども">子ども向け</option>
                <option value="高齢者">高齢者向け</option>
              </select>
            </label>

            <button
              onClick={() => setSettingsOpen(false)}
              className="bg-orange-400 text-white w-full py-2 rounded hover:bg-orange-500 transition"
            >
              保存して閉じる
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

        <button
          onClick={handleOrder}
          disabled={isOrdering || cartItems.length === 0}
          className="bg-black text-white px-8 py-2 rounded-md hover:bg-gray-800 transition text-lg disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isOrdering ? "送信中..." : "注文"}
        </button>
      </div>
    </div>
  );
}
