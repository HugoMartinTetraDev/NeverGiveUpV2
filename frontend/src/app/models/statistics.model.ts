export interface MonthlyStats {
  revenue: number;
  orderCount: number;
  averageTicket: number;
}

export interface RevenueDataPoint {
  month: string;
  revenue: number;
  orders: number;
}

export interface Statistics {
  currentMonth: MonthlyStats;
  revenueAnalysis: RevenueDataPoint[];
} 