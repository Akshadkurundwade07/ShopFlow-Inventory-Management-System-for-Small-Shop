import React from 'react';
import { Package, DollarSign, AlertTriangle, XCircle, Grid3X3 } from 'lucide-react';
import { InventoryStats } from '../types/inventory';

interface DashboardProps {
  stats: InventoryStats;
}

export function Dashboard({ stats }: DashboardProps) {
  const cards = [
    {
      title: 'Total Products',
      value: stats.totalProducts,
      icon: Package,
      color: 'bg-blue-500',
      textColor: 'text-blue-600',
      bgColor: 'bg-blue-50',
    },
    {
      title: 'Inventory Value',
      value: `$${stats.totalValue.toFixed(2)}`,
      icon: DollarSign,
      color: 'bg-green-500',
      textColor: 'text-green-600',
      bgColor: 'bg-green-50',
    },
    {
      title: 'Low Stock Alerts',
      value: stats.lowStockItems,
      icon: AlertTriangle,
      color: 'bg-orange-500',
      textColor: 'text-orange-600',
      bgColor: 'bg-orange-50',
    },
    {
      title: 'Out of Stock',
      value: stats.outOfStockItems,
      icon: XCircle,
      color: 'bg-red-500',
      textColor: 'text-red-600',
      bgColor: 'bg-red-50',
    },
    {
      title: 'Categories',
      value: stats.totalCategories,
      icon: Grid3X3,
      color: 'bg-purple-500',
      textColor: 'text-purple-600',
      bgColor: 'bg-purple-50',
    },
  ];

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
        {cards.map((card, index) => (
          <div
            key={index}
            className={`${card.bgColor} rounded-xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow`}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">{card.title}</p>
                <p className={`text-2xl font-bold ${card.textColor} mt-1`}>
                  {card.value}
                </p>
              </div>
              <div className={`${card.color} p-3 rounded-lg text-white`}>
                <card.icon className="w-6 h-6" />
              </div>
            </div>
          </div>
        ))}
      </div>

      {(stats.lowStockItems > 0 || stats.outOfStockItems > 0) && (
        <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded-md">
          <div className="flex">
            <AlertTriangle className="w-5 h-5 text-yellow-400 mr-2 flex-shrink-0" />
            <div>
              <h3 className="text-sm font-medium text-yellow-800">
                Inventory Alerts
              </h3>
              <div className="mt-2 text-sm text-yellow-700">
                <p>
                  {stats.outOfStockItems > 0 && (
                    <>You have {stats.outOfStockItems} items out of stock. </>
                  )}
                  {stats.lowStockItems > 0 && (
                    <>{stats.lowStockItems} items are running low on stock.</>
                  )}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}