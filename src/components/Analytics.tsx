import React, { useState } from 'react';
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Area,
  AreaChart,
} from 'recharts';
import {
  TrendingUp,
  TrendingDown,
  DollarSign,
  Package,
  AlertTriangle,
  BarChart3,
  PieChart as PieChartIcon,
  Calendar,
  Filter,
  Download,
  RefreshCw,
} from 'lucide-react';
import { useAnalytics } from '../hooks/useAnalytics';
import { format } from 'date-fns';

export function Analytics() {
  const {
    salesData,
    categoryAnalytics,
    productPerformance,
    inventoryTrends,
    stockMovement,
    alertsData,
    dateRange,
    setDateRange,
  } = useAnalytics();

  const [activeTab, setActiveTab] = useState<'overview' | 'sales' | 'inventory' | 'performance'>('overview');

  const formatCurrency = (value: number) => `$${value.toFixed(2)}`;
  const formatPercentage = (value: number) => `${value > 0 ? '+' : ''}${value.toFixed(1)}%`;

  const renderTrendIcon = (change: number) => {
    if (change > 0) {
      return <TrendingUp className="w-4 h-4 text-green-600" />;
    } else if (change < 0) {
      return <TrendingDown className="w-4 h-4 text-red-600" />;
    }
    return <div className="w-4 h-4" />;
  };

  const tabs = [
    { id: 'overview', label: 'Overview', icon: BarChart3 },
    { id: 'sales', label: 'Sales Analytics', icon: DollarSign },
    { id: 'inventory', label: 'Inventory Trends', icon: Package },
    { id: 'performance', label: 'Product Performance', icon: TrendingUp },
  ];

  const renderOverviewTab = () => (
    <div className="space-y-6">
      {/* Key Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Revenue</p>
              <p className="text-2xl font-bold text-gray-900">
                {formatCurrency(salesData.reduce((sum, d) => sum + d.revenue, 0))}
              </p>
              <div className="flex items-center gap-1 mt-1">
                {renderTrendIcon(inventoryTrends.totalValueChange)}
                <span className={`text-sm ${inventoryTrends.totalValueChange > 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {formatPercentage(inventoryTrends.totalValueChange)}
                </span>
              </div>
            </div>
            <div className="bg-blue-100 p-3 rounded-lg">
              <DollarSign className="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Products</p>
              <p className="text-2xl font-bold text-gray-900">{inventoryTrends.totalProducts}</p>
              <div className="flex items-center gap-1 mt-1">
                {renderTrendIcon(inventoryTrends.totalProductsChange)}
                <span className={`text-sm ${inventoryTrends.totalProductsChange > 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {inventoryTrends.totalProductsChange > 0 ? '+' : ''}{inventoryTrends.totalProductsChange}
                </span>
              </div>
            </div>
            <div className="bg-green-100 p-3 rounded-lg">
              <Package className="w-6 h-6 text-green-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Avg Stock Level</p>
              <p className="text-2xl font-bold text-gray-900">{inventoryTrends.averageStockLevel}</p>
              <div className="flex items-center gap-1 mt-1">
                {renderTrendIcon(inventoryTrends.stockLevelChange)}
                <span className={`text-sm ${inventoryTrends.stockLevelChange > 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {formatPercentage(inventoryTrends.stockLevelChange)}
                </span>
              </div>
            </div>
            <div className="bg-orange-100 p-3 rounded-lg">
              <BarChart3 className="w-6 h-6 text-orange-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Active Alerts</p>
              <p className="text-2xl font-bold text-gray-900">
                {alertsData.lowStockAlerts.length + alertsData.outOfStockAlerts.length}
              </p>
              <div className="flex items-center gap-1 mt-1">
                <AlertTriangle className="w-4 h-4 text-red-600" />
                <span className="text-sm text-red-600">Needs attention</span>
              </div>
            </div>
            <div className="bg-red-100 p-3 rounded-lg">
              <AlertTriangle className="w-6 h-6 text-red-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Revenue Trend */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Revenue Trend</h3>
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={salesData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" tickFormatter={(date) => format(new Date(date), 'MMM dd')} />
              <YAxis tickFormatter={formatCurrency} />
              <Tooltip formatter={(value) => [formatCurrency(value as number), 'Revenue']} />
              <Area type="monotone" dataKey="revenue" stroke="#3B82F6" fill="#3B82F6" fillOpacity={0.1} />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Category Distribution */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Category Distribution</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={categoryAnalytics}
                cx="50%"
                cy="50%"
                outerRadius={100}
                dataKey="totalProducts"
                label={({ category, totalProducts }) => `${category}: ${totalProducts}`}
              >
                {categoryAnalytics.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Alerts Section */}
      {(alertsData.lowStockAlerts.length > 0 || alertsData.outOfStockAlerts.length > 0) && (
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Inventory Alerts</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {alertsData.outOfStockAlerts.length > 0 && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <h4 className="font-medium text-red-900 mb-2">Out of Stock ({alertsData.outOfStockAlerts.length})</h4>
                <div className="space-y-2">
                  {alertsData.outOfStockAlerts.slice(0, 3).map((alert) => (
                    <div key={alert.id} className="text-sm text-red-700">
                      <span className="font-medium">{alert.name}</span> - {alert.category}
                    </div>
                  ))}
                  {alertsData.outOfStockAlerts.length > 3 && (
                    <div className="text-sm text-red-600">+{alertsData.outOfStockAlerts.length - 3} more</div>
                  )}
                </div>
              </div>
            )}

            {alertsData.lowStockAlerts.length > 0 && (
              <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
                <h4 className="font-medium text-orange-900 mb-2">Low Stock ({alertsData.lowStockAlerts.length})</h4>
                <div className="space-y-2">
                  {alertsData.lowStockAlerts.slice(0, 3).map((alert) => (
                    <div key={alert.id} className="text-sm text-orange-700">
                      <span className="font-medium">{alert.name}</span> - {alert.currentStock} left
                    </div>
                  ))}
                  {alertsData.lowStockAlerts.length > 3 && (
                    <div className="text-sm text-orange-600">+{alertsData.lowStockAlerts.length - 3} more</div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );

  const renderSalesTab = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Revenue vs Profit */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Revenue vs Profit</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={salesData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" tickFormatter={(date) => format(new Date(date), 'MMM dd')} />
              <YAxis tickFormatter={formatCurrency} />
              <Tooltip formatter={(value) => [formatCurrency(value as number)]} />
              <Legend />
              <Bar dataKey="revenue" fill="#3B82F6" name="Revenue" />
              <Bar dataKey="profit" fill="#10B981" name="Profit" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Items Sold Trend */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Items Sold</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={salesData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" tickFormatter={(date) => format(new Date(date), 'MMM dd')} />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="itemsSold" stroke="#F59E0B" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Category Performance */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Category Performance</h3>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-3 px-4 font-medium text-gray-700">Category</th>
                <th className="text-left py-3 px-4 font-medium text-gray-700">Products</th>
                <th className="text-left py-3 px-4 font-medium text-gray-700">Total Value</th>
                <th className="text-left py-3 px-4 font-medium text-gray-700">Avg Price</th>
                <th className="text-left py-3 px-4 font-medium text-gray-700">Low Stock</th>
              </tr>
            </thead>
            <tbody>
              {categoryAnalytics.map((category) => (
                <tr key={category.category} className="border-b border-gray-100">
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full" style={{ backgroundColor: category.color }} />
                      {category.category}
                    </div>
                  </td>
                  <td className="py-3 px-4">{category.totalProducts}</td>
                  <td className="py-3 px-4 font-medium">{formatCurrency(category.totalValue)}</td>
                  <td className="py-3 px-4">{formatCurrency(category.averagePrice)}</td>
                  <td className="py-3 px-4">
                    {category.lowStockCount > 0 ? (
                      <span className="text-orange-600 font-medium">{category.lowStockCount}</span>
                    ) : (
                      <span className="text-green-600">0</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );

  const renderInventoryTab = () => (
    <div className="space-y-6">
      {/* Stock Movement */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Stock Movement (Last 30 Days)</h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={stockMovement}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" tickFormatter={(date) => format(new Date(date), 'MMM dd')} />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="stockIn" fill="#10B981" name="Stock In" />
            <Bar dataKey="stockOut" fill="#EF4444" name="Stock Out" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Inventory Alerts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Out of Stock */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <h3 className="text-lg font-semibold text-red-900 mb-4">Out of Stock</h3>
          <div className="space-y-3">
            {alertsData.outOfStockAlerts.length === 0 ? (
              <p className="text-gray-500 text-sm">No out of stock items</p>
            ) : (
              alertsData.outOfStockAlerts.map((alert) => (
                <div key={alert.id} className="p-3 bg-red-50 rounded-lg">
                  <h4 className="font-medium text-red-900">{alert.name}</h4>
                  <p className="text-sm text-red-700">{alert.category}</p>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Low Stock */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <h3 className="text-lg font-semibold text-orange-900 mb-4">Low Stock</h3>
          <div className="space-y-3">
            {alertsData.lowStockAlerts.length === 0 ? (
              <p className="text-gray-500 text-sm">No low stock items</p>
            ) : (
              alertsData.lowStockAlerts.map((alert) => (
                <div key={alert.id} className="p-3 bg-orange-50 rounded-lg">
                  <h4 className="font-medium text-orange-900">{alert.name}</h4>
                  <p className="text-sm text-orange-700">
                    {alert.currentStock} / {alert.minStock} minimum
                  </p>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Overstock */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <h3 className="text-lg font-semibold text-blue-900 mb-4">Overstock</h3>
          <div className="space-y-3">
            {alertsData.overstockAlerts.length === 0 ? (
              <p className="text-gray-500 text-sm">No overstock items</p>
            ) : (
              alertsData.overstockAlerts.map((alert) => (
                <div key={alert.id} className="p-3 bg-blue-50 rounded-lg">
                  <h4 className="font-medium text-blue-900">{alert.name}</h4>
                  <p className="text-sm text-blue-700">
                    {alert.currentStock} units (avg usage: {alert.averageUsage})
                  </p>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );

  const renderPerformanceTab = () => (
    <div className="space-y-6">
      {/* Top Performing Products */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Product Performance</h3>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-3 px-4 font-medium text-gray-700">Product</th>
                <th className="text-left py-3 px-4 font-medium text-gray-700">Category</th>
                <th className="text-left py-3 px-4 font-medium text-gray-700">Revenue</th>
                <th className="text-left py-3 px-4 font-medium text-gray-700">Profit</th>
                <th className="text-left py-3 px-4 font-medium text-gray-700">Margin</th>
                <th className="text-left py-3 px-4 font-medium text-gray-700">Stock</th>
              </tr>
            </thead>
            <tbody>
              {productPerformance.slice(0, 10).map((product) => (
                <tr key={product.id} className="border-b border-gray-100">
                  <td className="py-3 px-4 font-medium">{product.name}</td>
                  <td className="py-3 px-4">{product.category}</td>
                  <td className="py-3 px-4 font-medium text-green-600">
                    {formatCurrency(product.revenue)}
                  </td>
                  <td className="py-3 px-4 font-medium text-blue-600">
                    {formatCurrency(product.profit)}
                  </td>
                  <td className="py-3 px-4">
                    <span className={`font-medium ${product.profitMargin > 30 ? 'text-green-600' : product.profitMargin > 15 ? 'text-orange-600' : 'text-red-600'}`}>
                      {product.profitMargin.toFixed(1)}%
                    </span>
                  </td>
                  <td className="py-3 px-4">{product.stock}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
        <h1 className="text-3xl font-bold text-gray-900">Analytics Dashboard</h1>
        
        <div className="flex items-center gap-3">
          <select
            value={dateRange}
            onChange={(e) => setDateRange(e.target.value as any)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="7d">Last 7 days</option>
            <option value="30d">Last 30 days</option>
            <option value="90d">Last 90 days</option>
            <option value="1y">Last year</option>
          </select>
          
          <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors">
            <Download className="w-4 h-4" />
            Export
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200">
        <nav className="flex space-x-8">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`py-4 px-1 border-b-2 font-medium text-sm flex items-center gap-2 transition-colors ${
                activeTab === tab.id
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <tab.icon className="w-4 h-4" />
              {tab.label}
            </button>
          ))}
        </nav>
      </div>

      {/* Tab Content */}
      {activeTab === 'overview' && renderOverviewTab()}
      {activeTab === 'sales' && renderSalesTab()}
      {activeTab === 'inventory' && renderInventoryTab()}
      {activeTab === 'performance' && renderPerformanceTab()}
    </div>
  );
}