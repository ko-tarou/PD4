import express, { Request, Response } from 'express';
import cors from 'cors';

const app = express();
const PORT = 3001;

// Middleware
app.use(cors());
app.use(express.json());

// 注文データをメモリに保存（本番環境ではデータベースを使用）
interface Order {
  id: number;
  category: string;
  name: string;
  table: string;
  quantity: string;
  time: string;
  createdAt: number;
}

let orders: Order[] = [];

// メニュー管理用の型定義
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
  category: string; // kitchen用のカテゴリ（揚げ、焼き、一品）
}

// メニューデータ（初期データ）
let menuTabs: MenuTab[] = [
  { id: 1, name: 'おすすめ', order: 1 },
  { id: 2, name: 'おつまみ', order: 2 },
  { id: 3, name: '揚げ物', order: 3 },
  { id: 4, name: '飲み物', order: 4 },
];

let menuItems: MenuItem[] = [
  // おすすめタブ
  { id: 1, tabId: 1, name: 'ラーメン', price: 680, category: '一品' },
  { id: 2, tabId: 1, name: '唐揚げ', price: 580, category: '揚げ' },
  { id: 3, tabId: 1, name: 'ポテト', price: 380, category: '一品' },
  { id: 25, tabId: 1, name: 'ねぎま', price: 480, category: '一品' },
  { id: 26, tabId: 1, name: '焼き鳥', price: 580, category: '一品' },
  // おつまみタブ
  { id: 4, tabId: 2, name: 'ラーメン', price: 680, category: '一品' },
  { id: 5, tabId: 2, name: 'キムチ', price: 280, category: '一品' },
  { id: 6, tabId: 2, name: '餃子', price: 480, category: '一品' },
  { id: 7, tabId: 2, name: '枝豆', price: 380, category: '一品' },
  { id: 8, tabId: 2, name: '冷奴', price: 280, category: '一品' },
  { id: 9, tabId: 2, name: 'サラダ', price: 480, category: '一品' },
  { id: 10, tabId: 2, name: '刺身盛り合わせ', price: 1280, category: '一品' },
  { id: 11, tabId: 2, name: '漬物盛り合わせ', price: 380, category: '一品' },
  { id: 12, tabId: 2, name: 'チーズ盛り合わせ', price: 580, category: '一品' },
  { id: 13, tabId: 2, name: 'ナムル', price: 380, category: '一品' },
  // 揚げ物タブ
  { id: 14, tabId: 3, name: '唐揚げ', price: 580, category: '揚げ' },
  { id: 15, tabId: 3, name: 'とんかつ', price: 850, category: '揚げ' },
  { id: 16, tabId: 3, name: 'エビフライ', price: 780, category: '揚げ' },
  { id: 17, tabId: 3, name: '天ぷら盛り合わせ', price: 980, category: '揚げ' },
  { id: 18, tabId: 3, name: 'フライドポテト', price: 380, category: '揚げ' },
  { id: 19, tabId: 3, name: 'チキンカツ', price: 680, category: '揚げ' },
  { id: 20, tabId: 3, name: 'アジフライ', price: 680, category: '揚げ' },
  { id: 21, tabId: 3, name: 'コロッケ', price: 480, category: '揚げ' },
  // 飲み物タブ
  { id: 22, tabId: 4, name: 'ビール', price: 480, category: '一品' },
  { id: 23, tabId: 4, name: 'コーラ', price: 200, category: '一品' },
  { id: 24, tabId: 4, name: 'ウーロン茶', price: 200, category: '一品' },
  { id: 27, tabId: 4, name: 'トロピカルジュース', price: 350, category: '一品' },
  { id: 28, tabId: 4, name: 'メロンソーダ', price: 350, category: '一品' },
];

// ========== メニュータブ管理API ==========

// タブ一覧を取得
app.get('/api/menu/tabs', (req: Request, res: Response) => {
  res.json(menuTabs.sort((a, b) => a.order - b.order));
});

// タブを追加
app.post('/api/menu/tabs', (req: Request, res: Response) => {
  const { name, order } = req.body;

  if (!name) {
    return res.status(400).json({ error: 'Tab name is required' });
  }

  const newTab: MenuTab = {
    id: Date.now(),
    name,
    order: order || menuTabs.length + 1,
  };

  menuTabs.push(newTab);
  res.status(201).json(newTab);
});

// タブを更新
app.put('/api/menu/tabs/:id', (req: Request, res: Response) => {
  const id = parseInt(req.params.id);
  const { name, order } = req.body;
  const tab = menuTabs.find((t) => t.id === id);

  if (!tab) {
    return res.status(404).json({ error: 'Tab not found' });
  }

  if (name) tab.name = name;
  if (order !== undefined) tab.order = order;

  res.json(tab);
});

// タブを削除
app.delete('/api/menu/tabs/:id', (req: Request, res: Response) => {
  const id = parseInt(req.params.id);
  const index = menuTabs.findIndex((t) => t.id === id);

  if (index === -1) {
    return res.status(404).json({ error: 'Tab not found' });
  }

  // タブに紐づくメニューアイテムも削除
  menuItems = menuItems.filter((item) => item.tabId !== id);
  menuTabs.splice(index, 1);

  res.status(204).send();
});

// ========== メニューアイテム管理API ==========

// メニューアイテム一覧を取得
app.get('/api/menu/items', (req: Request, res: Response) => {
  const tabId = req.query.tabId ? parseInt(req.query.tabId as string) : undefined;
  const filtered = tabId ? menuItems.filter((item) => item.tabId === tabId) : menuItems;
  res.json(filtered);
});

// メニューアイテムを追加
app.post('/api/menu/items', (req: Request, res: Response) => {
  const { tabId, name, price, category } = req.body;

  if (!tabId || !name || price === undefined || !category) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  const newItem: MenuItem = {
    id: Date.now(),
    tabId,
    name,
    price,
    category,
  };

  menuItems.push(newItem);
  res.status(201).json(newItem);
});

// メニューアイテムを更新
app.put('/api/menu/items/:id', (req: Request, res: Response) => {
  const id = parseInt(req.params.id);
  const { tabId, name, price, category } = req.body;
  const item = menuItems.find((i) => i.id === id);

  if (!item) {
    return res.status(404).json({ error: 'Item not found' });
  }

  if (tabId !== undefined) item.tabId = tabId;
  if (name) item.name = name;
  if (price !== undefined) item.price = price;
  if (category) item.category = category;

  res.json(item);
});

// メニューアイテムを削除
app.delete('/api/menu/items/:id', (req: Request, res: Response) => {
  const id = parseInt(req.params.id);
  const index = menuItems.findIndex((i) => i.id === id);

  if (index === -1) {
    return res.status(404).json({ error: 'Item not found' });
  }

  menuItems.splice(index, 1);
  res.status(204).send();
});

// ========== 注文管理API ==========

// 注文を取得するAPI
app.get('/api/orders', (req: Request, res: Response) => {
  res.json(orders);
});

// 注文を追加するAPI
app.post('/api/orders', (req: Request, res: Response) => {
  const { category, name, table, quantity, time } = req.body;

  if (!category || !name || !table || !quantity || !time) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  const newOrder: Order = {
    id: Date.now(),
    category,
    name,
    table,
    quantity,
    time,
    createdAt: Date.now(),
  };

  orders.push(newOrder);
  res.status(201).json(newOrder);
});

// 注文を削除するAPI
app.delete('/api/orders/:id', (req: Request, res: Response) => {
  const id = parseInt(req.params.id);
  const index = orders.findIndex((order) => order.id === id);

  if (index === -1) {
    return res.status(404).json({ error: 'Order not found' });
  }

  orders.splice(index, 1);
  res.status(204).send();
});

// 注文を完了にするAPI（kitchen用）
app.patch('/api/orders/:id/complete', (req: Request, res: Response) => {
  const id = parseInt(req.params.id);
  const order = orders.find((o) => o.id === id);

  if (!order) {
    return res.status(404).json({ error: 'Order not found' });
  }

  // 注文を削除（完了した注文は削除）
  orders = orders.filter((o) => o.id !== id);
  res.status(200).json({ message: 'Order completed' });
});

app.listen(PORT, () => {
  console.log(`🚀 Backend server running on http://localhost:${PORT}`);
});

