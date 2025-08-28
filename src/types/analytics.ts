export interface SalesData {
  date: string;
  revenue: number;
  profit: number;
  itemsSold: number;
}

export interface CategoryAnalytics {
  category: string;
  totalProducts: number;
  totalValue: number;
  averagePrice: number;
  lowStockCount: number;
  color: string;
}

export interface ProductPerformance {
  id: string;
  name: string;
  category: string;
  revenue: number;
  profit: number;
  profitMargin: number;
  turnoverRate: number;
  stock: number;
}

export interface InventoryTrends {
  totalValue: number;
  totalValueChange: number;
  totalProducts: number;
  totalProductsChange: number;
  averageStockLevel: number;
  stockLevelChange: number;
  categoriesCount: number;
}

export interface StockMovement {
  date: string;
  stockIn: number;
  stockOut: number;
  netChange: number;
}

export interface AlertsData {
  lowStockAlerts: Array<{
    id: string;
    name: string;
    currentStock: number;
    minStock: number;
    category: string;
  }>;
  outOfStockAlerts: Array<{
    id: string;
    name: string;
    category: string;
    lastUpdated: Date;
  }>;
  overstockAlerts: Array<{
    id: string;
    name: string;
    currentStock: number;
    averageUsage: number;
    category: string;
  }>;
}