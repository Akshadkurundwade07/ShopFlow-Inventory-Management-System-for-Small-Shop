import React from 'react';
import { Package } from 'lucide-react';

export function LoadingSpinner() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="text-center">
        <div className="relative">
          <Package className="w-16 h-16 text-blue-600 mx-auto mb-4 animate-pulse" />
          <div className="absolute inset-0 w-16 h-16 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mx-auto"></div>
        </div>
        <h2 className="text-xl font-semibold text-gray-900 mb-2">Loading ShopFlow</h2>
        <p className="text-gray-600">Setting up your inventory dashboard...</p>
      </div>
    </div>
  );
}