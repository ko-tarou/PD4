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

