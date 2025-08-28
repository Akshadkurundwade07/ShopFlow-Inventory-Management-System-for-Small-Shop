import { useState, useEffect } from 'react';
import { Product, Category, InventoryStats } from '../types/inventory';
import { useAuth } from './useAuth';
import { inventoryService } from '../services/inventoryService';

export function useInventory() {
  const { user } = useAuth();
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!user) return;
    
    const loadData = async () => {
      setIsLoading(true);
      try {
        const [productsData, categoriesData] = await Promise.all([
          inventoryService.getProducts(user.id),
          inventoryService.getCategories(user.id)
        ]);
        setProducts(productsData);
        setCategories(categoriesData);
      } catch (error) {
        console.error('Failed to load inventory data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, [user]);

  const addProduct = async (product: Omit<Product, 'id' | 'createdAt' | 'updatedAt'>) => {
    if (!user) return;
    
    try {
      const newProduct = await inventoryService.addProduct(user.id, product);
      setProducts(prev => [...prev, newProduct]);
    } catch (error) {
      console.error('Failed to add product:', error);
      throw error;
    }
  };

  const updateProduct = async (id: string, updates: Partial<Product>) => {
    if (!user) return;
    
    try {
      const updatedProduct = await inventoryService.updateProduct(user.id, id, updates);
      setProducts(prev => prev.map(product => 
        product.id === id ? updatedProduct : product
      ));
    } catch (error) {
      console.error('Failed to update product:', error);
      throw error;
    }
  };

  const deleteProduct = async (id: string) => {
    if (!user) return;
    
    try {
      await inventoryService.deleteProduct(user.id, id);
      setProducts(prev => prev.filter(product => product.id !== id));
    } catch (error) {
      console.error('Failed to delete product:', error);
      throw error;
    }
  };

  const addCategory = async (category: Omit<Category, 'id'>) => {
    if (!user) return;
    
    try {
      const newCategory = await inventoryService.addCategory(user.id, category);
      setCategories(prev => [...prev, newCategory]);
    } catch (error) {
      console.error('Failed to add category:', error);
      throw error;
    }
  };

  const getStats = (): InventoryStats => {
    const totalProducts = products.length;
    const totalValue = products.reduce((sum, product) => sum + (product.price * product.stock), 0);
    const lowStockItems = products.filter(product => product.stock <= product.minStock && product.stock > 0).length;
    const outOfStockItems = products.filter(product => product.stock === 0).length;
    const totalCategories = categories.length;

    return {
      totalProducts,
      totalValue,
      lowStockItems,
      outOfStockItems,
      totalCategories,
    };
  };

  return {
    products,
    categories,
    isLoading,
    addProduct,
    updateProduct,
    deleteProduct,
    addCategory,
    getStats,
  };
}