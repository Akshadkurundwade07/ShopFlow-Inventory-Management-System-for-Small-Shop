import { useState, useEffect, useMemo } from 'react';
import { useInventory } from './useInventory';
import { 
  SalesData, 
  CategoryAnalytics, 
  ProductPerformance, 
  InventoryTrends,
  StockMovement,
  AlertsData 
} from '../types/analytics';
import { subDays, format, startOfDay } from 'date-fns';

export function useAnalytics() {
  const { products, categories } = useInventory();
  const [dateRange, setDateRange] = useState<'7d' | '30d' | '90d' | '1y'>('30d');

  // Generate mock sales data based on products
  const generateSalesData = (days: number): SalesData[] => {
    const data: SalesData[] = [];
    const today = new Date();
    
    for (let i = days - 1; i >= 0; i--) {
      const date = subDays(today, i);
      const dateStr = format(date, 'yyyy-MM-dd');
      
      // Simulate sales based on product data
      const dailyRevenue = products.reduce((sum, product) => {
        const dailySales = Math.random() * (product.stock > 0 ? Math.min(product.stock, 5) : 0);
        return sum + (dailySales * product.price);
      }, 0);
      
      const dailyProfit = products.reduce((sum, product) => {
        const dailySales = Math.random() * (product.stock > 0 ? Math.min(product.stock, 5) : 0);
        return sum + (dailySales * (product.price - product.cost));
      }, 0);
      
      const itemsSold = Math.floor(Math.random() * 20) + 5;
      
      data.push({
        date: dateStr,
        revenue: Math.round(dailyRevenue * 100) / 100,
        profit: Math.round(dailyProfit * 100) / 100,
        itemsSold,
      });
    }
    
    return data;
  };

  const salesData = useMemo(() => {
    const days = dateRange === '7d' ? 7 : dateRange === '30d' ? 30 : dateRange === '90d' ? 90 : 365;
    return generateSalesData(days);
  }, [products, dateRange]);

  const categoryAnalytics = useMemo((): CategoryAnalytics[] => {
    return categories.map(category => {
      const categoryProducts = products.filter(p => p.category === category.name);
      const totalValue = categoryProducts.reduce((sum, p) => sum + (p.price * p.stock), 0);
      const averagePrice = categoryProducts.length > 0 
        ? categoryProducts.reduce((sum, p) => sum + p.price, 0) / categoryProducts.length 
        : 0;
      const lowStockCount = categoryProducts.filter(p => p.stock <= p.minStock && p.stock > 0).length;
      
      return {
        category: category.name,
        totalProducts: categoryProducts.length,
        totalValue: Math.round(totalValue * 100) / 100,
        averagePrice: Math.round(averagePrice * 100) / 100,
        lowStockCount,
        color: category.color,
      };
    });
  }, [products, categories]);

  const productPerformance = useMemo((): ProductPerformance[] => {
    return products.map(product => {
      const revenue = Math.random() * product.price * Math.min(product.stock, 10);
      const profit = revenue * ((product.price - product.cost) / product.price);
      const profitMargin = product.price > 0 ? ((product.price - product.cost) / product.price) * 100 : 0;
      const turnoverRate = Math.random() * 5; // Mock turnover rate
      
      return {
        id: product.id,
        name: product.name,
        category: product.category,
        revenue: Math.round(revenue * 100) / 100,
        profit: Math.round(profit * 100) / 100,
        profitMargin: Math.round(profitMargin * 100) / 100,
        turnoverRate: Math.round(turnoverRate * 100) / 100,
        stock: product.stock,
      };
    }).sort((a, b) => b.revenue - a.revenue);
  }, [products]);

  const inventoryTrends = useMemo((): InventoryTrends => {
    const totalValue = products.reduce((sum, p) => sum + (p.price * p.stock), 0);
    const totalProducts = products.length;
    const averageStockLevel = products.length > 0 
      ? products.reduce((sum, p) => sum + p.stock, 0) / products.length 
      : 0;
    
    // Mock percentage changes (in a real app, this would compare with historical data)
    const totalValueChange = (Math.random() - 0.5) * 20; // -10% to +10%
    const totalProductsChange = Math.floor((Math.random() - 0.5) * 10); // -5 to +5
    const stockLevelChange = (Math.random() - 0.5) * 30; // -15% to +15%
    
    return {
      totalValue: Math.round(totalValue * 100) / 100,
      totalValueChange: Math.round(totalValueChange * 100) / 100,
      totalProducts,
      totalProductsChange,
      averageStockLevel: Math.round(averageStockLevel * 100) / 100,
      stockLevelChange: Math.round(stockLevelChange * 100) / 100,
      categoriesCount: categories.length,
    };
  }, [products, categories]);

  const stockMovement = useMemo((): StockMovement[] => {
    const data: StockMovement[] = [];
    const days = 30;
    const today = new Date();
    
    for (let i = days - 1; i >= 0; i--) {
      const date = subDays(today, i);
      const dateStr = format(date, 'yyyy-MM-dd');
      
      const stockIn = Math.floor(Math.random() * 50) + 10;
      const stockOut = Math.floor(Math.random() * 40) + 5;
      const netChange = stockIn - stockOut;
      
      data.push({
        date: dateStr,
        stockIn,
        stockOut,
        netChange,
      });
    }
    
    return data;
  }, []);

  const alertsData = useMemo((): AlertsData => {
    const lowStockAlerts = products
      .filter(p => p.stock <= p.minStock && p.stock > 0)
      .map(p => ({
        id: p.id,
        name: p.name,
        currentStock: p.stock,
        minStock: p.minStock,
        category: p.category,
      }));

    const outOfStockAlerts = products
      .filter(p => p.stock === 0)
      .map(p => ({
        id: p.id,
        name: p.name,
        category: p.category,
        lastUpdated: p.updatedAt,
      }));

    const overstockAlerts = products
      .filter(p => p.stock > p.minStock * 5) // Consider overstock if 5x minimum
      .map(p => ({
        id: p.id,
        name: p.name,
        currentStock: p.stock,
        averageUsage: Math.floor(Math.random() * 10) + 1, // Mock average usage
        category: p.category,
      }));

    return {
      lowStockAlerts,
      outOfStockAlerts,
      overstockAlerts,
    };
  }, [products]);

  return {
    salesData,
    categoryAnalytics,
    productPerformance,
    inventoryTrends,
    stockMovement,
    alertsData,
    dateRange,
    setDateRange,
  };
}