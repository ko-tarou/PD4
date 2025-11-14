"use client";
import { useState, useEffect } from "react";

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

export default function AdminPage() {
  const [tabs, setTabs] = useState<MenuTab[]>([]);
  const [items, setItems] = useState<MenuItem[]>([]);
  const [selectedTabId, setSelectedTabId] = useState<number | null>(null);
  const [showTabModal, setShowTabModal] = useState(false);
  const [showItemModal, setShowItemModal] = useState(false);
  const [editingTab, setEditingTab] = useState<MenuTab | null>(null);
  const [editingItem, setEditingItem] = useState<MenuItem | null>(null);

  // フォーム状態
  const [tabName, setTabName] = useState("");
  const [tabOrder, setTabOrder] = useState(1);
  const [itemName, setItemName] = useState("");
  const [itemPrice, setItemPrice] = useState(0);
  const [itemCategory, setItemCategory] = useState("一品");

  // データ取得
  const fetchTabs = async () => {
    try {
      const response = await fetch("http://localhost:3001/api/menu/tabs");
      if (response.ok) {
        const data = await response.json();
        setTabs(data);
        if (data.length > 0 && !selectedTabId) {
          setSelectedTabId(data[0].id);
        }
      }
    } catch (error) {
      console.error("タブの取得に失敗しました:", error);
    }
  };

  const fetchItems = async () => {
    try {
      const url = selectedTabId
        ? `http://localhost:3001/api/menu/items?tabId=${selectedTabId}`
        : "http://localhost:3001/api/menu/items";
      const response = await fetch(url);
      if (response.ok) {
        const data = await response.json();
        setItems(data);
      }
    } catch (error) {
      console.error("メニューアイテムの取得に失敗しました:", error);
    }
  };

  useEffect(() => {
    fetchTabs();
  }, []);

  useEffect(() => {
    fetchItems();
  }, [selectedTabId]);

  // タブ管理
  const handleAddTab = () => {
    setEditingTab(null);
    setTabName("");
    setTabOrder(tabs.length + 1);
    setShowTabModal(true);
  };

  const handleEditTab = (tab: MenuTab) => {
    setEditingTab(tab);
    setTabName(tab.name);
    setTabOrder(tab.order);
    setShowTabModal(true);
  };

  const handleSaveTab = async () => {
    if (!tabName.trim()) {
      alert("タブ名を入力してください");
      return;
    }

    try {
      if (editingTab) {
        // 更新
        const response = await fetch(
          `http://localhost:3001/api/menu/tabs/${editingTab.id}`,
          {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ name: tabName, order: tabOrder }),
          }
        );
        if (response.ok) {
          fetchTabs();
          setShowTabModal(false);
        }
      } else {
        // 追加
        const response = await fetch("http://localhost:3001/api/menu/tabs", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ name: tabName, order: tabOrder }),
        });
        if (response.ok) {
          fetchTabs();
          setShowTabModal(false);
        }
      }
    } catch (error) {
      console.error("タブの保存に失敗しました:", error);
      alert("タブの保存に失敗しました");
    }
  };

  const handleDeleteTab = async (tabId: number) => {
    if (!confirm("このタブとその中のメニューアイテムを削除しますか？")) return;

    try {
      const response = await fetch(`http://localhost:3001/api/menu/tabs/${tabId}`, {
        method: "DELETE",
      });
      if (response.ok) {
        fetchTabs();
        if (selectedTabId === tabId) {
          setSelectedTabId(null);
        }
      }
    } catch (error) {
      console.error("タブの削除に失敗しました:", error);
      alert("タブの削除に失敗しました");
    }
  };

  // メニューアイテム管理
  const handleAddItem = () => {
    if (!selectedTabId) {
      alert("まずタブを選択してください");
      return;
    }
    setEditingItem(null);
    setItemName("");
    setItemPrice(0);
    setItemCategory("一品");
    setShowItemModal(true);
  };

  const handleEditItem = (item: MenuItem) => {
    setEditingItem(item);
    setItemName(item.name);
    setItemPrice(item.price);
    setItemCategory(item.category);
    setShowItemModal(true);
  };

  const handleSaveItem = async () => {
    if (!itemName.trim() || itemPrice <= 0 || !selectedTabId) {
      alert("メニュー名と価格を正しく入力してください");
      return;
    }

    try {
      if (editingItem) {
        // 更新
        const response = await fetch(
          `http://localhost:3001/api/menu/items/${editingItem.id}`,
          {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              tabId: selectedTabId,
              name: itemName,
              price: itemPrice,
              category: itemCategory,
            }),
          }
        );
        if (response.ok) {
          fetchItems();
          setShowItemModal(false);
        }
      } else {
        // 追加
        const response = await fetch("http://localhost:3001/api/menu/items", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            tabId: selectedTabId,
            name: itemName,
            price: itemPrice,
            category: itemCategory,
          }),
        });
        if (response.ok) {
          fetchItems();
          setShowItemModal(false);
        }
      }
    } catch (error) {
      console.error("メニューアイテムの保存に失敗しました:", error);
      alert("メニューアイテムの保存に失敗しました");
    }
  };

  const handleDeleteItem = async (itemId: number) => {
    if (!confirm("このメニューアイテムを削除しますか？")) return;

    try {
      const response = await fetch(`http://localhost:3001/api/menu/items/${itemId}`, {
        method: "DELETE",
      });
      if (response.ok) {
        fetchItems();
      }
    } catch (error) {
      console.error("メニューアイテムの削除に失敗しました:", error);
      alert("メニューアイテムの削除に失敗しました");
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-bold text-gray-800 mb-6">メニュー管理</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* タブ管理エリア */}
          <div className="lg:col-span-1 bg-white rounded-lg shadow-md p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-bold text-gray-800">タブ管理</h2>
              <button
                onClick={handleAddTab}
                className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg font-medium"
              >
                + 追加
              </button>
            </div>

            <div className="space-y-2">
              {tabs.map((tab) => (
                <div
                  key={tab.id}
                  className={`p-3 rounded-lg border-2 cursor-pointer transition-colors ${
                    selectedTabId === tab.id
                      ? "border-blue-500 bg-blue-50"
                      : "border-gray-200 hover:border-gray-300"
                  }`}
                  onClick={() => setSelectedTabId(tab.id)}
                >
                  <div className="flex justify-between items-center">
                    <div>
                      <div className="font-semibold text-gray-800">{tab.name}</div>
                      <div className="text-sm text-gray-500">順序: {tab.order}</div>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleEditTab(tab);
                        }}
                        className="text-blue-600 hover:text-blue-800 text-sm"
                      >
                        編集
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDeleteTab(tab.id);
                        }}
                        className="text-red-600 hover:text-red-800 text-sm"
                      >
                        削除
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* メニューアイテム管理エリア */}
          <div className="lg:col-span-2 bg-white rounded-lg shadow-md p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-bold text-gray-800">
                {tabs.find((t) => t.id === selectedTabId)?.name || "タブを選択"} のメニュー
              </h2>
              <button
                onClick={handleAddItem}
                disabled={!selectedTabId}
                className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg font-medium disabled:opacity-50 disabled:cursor-not-allowed"
              >
                + メニュー追加
              </button>
            </div>

            {selectedTabId ? (
              <div className="space-y-3">
                {items.length === 0 ? (
                  <div className="text-center py-12 text-gray-500">
                    <p>メニューアイテムがありません</p>
                  </div>
                ) : (
                  items.map((item) => (
                    <div
                      key={item.id}
                      className="border-2 border-gray-200 rounded-lg p-4 hover:border-gray-300 transition-colors"
                    >
                      <div className="flex justify-between items-center">
                        <div className="flex-1">
                          <h3 className="text-xl font-bold text-gray-800">{item.name}</h3>
                          <div className="flex gap-3 mt-2 text-sm text-gray-600">
                            <span className="bg-gray-100 px-2 py-1 rounded">
                              価格: ¥{item.price.toLocaleString()}
                            </span>
                            <span className="bg-gray-100 px-2 py-1 rounded">
                              カテゴリ: {item.category}
                            </span>
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleEditItem(item)}
                            className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg"
                          >
                            編集
                          </button>
                          <button
                            onClick={() => handleDeleteItem(item.id)}
                            className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg"
                          >
                            削除
                          </button>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            ) : (
              <div className="text-center py-12 text-gray-500">
                <p>左側からタブを選択してください</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* タブ編集モーダル */}
      {showTabModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-96">
            <h3 className="text-2xl font-bold mb-4">
              {editingTab ? "タブを編集" : "タブを追加"}
            </h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  タブ名
                </label>
                <input
                  type="text"
                  value={tabName}
                  onChange={(e) => setTabName(e.target.value)}
                  className="w-full border-2 border-gray-300 rounded-lg px-4 py-2 focus:border-blue-500 outline-none"
                  placeholder="例: おすすめ"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  表示順序
                </label>
                <input
                  type="number"
                  value={tabOrder}
                  onChange={(e) => setTabOrder(parseInt(e.target.value) || 1)}
                  className="w-full border-2 border-gray-300 rounded-lg px-4 py-2 focus:border-blue-500 outline-none"
                  min="1"
                />
              </div>
              <div className="flex gap-3">
                <button
                  onClick={handleSaveTab}
                  className="flex-1 bg-blue-500 hover:bg-blue-600 text-white py-2 rounded-lg font-medium"
                >
                  保存
                </button>
                <button
                  onClick={() => setShowTabModal(false)}
                  className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-700 py-2 rounded-lg font-medium"
                >
                  キャンセル
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* メニューアイテム編集モーダル */}
      {showItemModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-96">
            <h3 className="text-2xl font-bold mb-4">
              {editingItem ? "メニューを編集" : "メニューを追加"}
            </h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  メニュー名
                </label>
                <input
                  type="text"
                  value={itemName}
                  onChange={(e) => setItemName(e.target.value)}
                  className="w-full border-2 border-gray-300 rounded-lg px-4 py-2 focus:border-blue-500 outline-none"
                  placeholder="例: 唐揚げ"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  価格
                </label>
                <input
                  type="number"
                  value={itemPrice}
                  onChange={(e) => setItemPrice(parseInt(e.target.value) || 0)}
                  className="w-full border-2 border-gray-300 rounded-lg px-4 py-2 focus:border-blue-500 outline-none"
                  min="0"
                  placeholder="例: 580"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  キッチンカテゴリ
                </label>
                <select
                  value={itemCategory}
                  onChange={(e) => setItemCategory(e.target.value)}
                  className="w-full border-2 border-gray-300 rounded-lg px-4 py-2 focus:border-blue-500 outline-none"
                >
                  <option value="揚げ">揚げ</option>
                  <option value="焼き">焼き</option>
                  <option value="一品">一品</option>
                </select>
              </div>
              <div className="flex gap-3">
                <button
                  onClick={handleSaveItem}
                  className="flex-1 bg-green-500 hover:bg-green-600 text-white py-2 rounded-lg font-medium"
                >
                  保存
                </button>
                <button
                  onClick={() => setShowItemModal(false)}
                  className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-700 py-2 rounded-lg font-medium"
                >
                  キャンセル
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
