export interface RestaurateurOrder {
  id: number;
  date: Date;
  articles: string;
  status: string;
  amount?: number | null;
} 