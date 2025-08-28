import { Product, Category } from '../types/inventory';

// Mock inventory service for demo purposes
// In a real application, this would connect to your backend API

class InventoryService {
  private products: Map<string, Product[]> = new Map();
  private categories: Map<string, Category[]> = new Map();

  // Initialize with default categories for new users
  private getDefaultCategories(): Category[] {
    return [
      {
        id: '1',
        name: 'Electronics',
        description: 'Electronic devices and accessories',
        color: '#3B82F6',
      },
      {
        id: '2',
        name: 'Clothing',
        description: 'Apparel and fashion items',
        color: '#10B981',
      },
      {
        id: '3',
        name: 'Food & Beverages',
        description: 'Food items and drinks',
        color: '#F59E0B',
      },
      {
        id: '4',
        name: 'Books',
        description: 'Books and educational materials',
        color: '#8B5CF6',
      },
      {
        id: '5',
        name: 'Home & Garden',
        description: 'Home improvement and garden supplies',
        color: '#06B6D4',
      },
    ];
  }

  // Initialize with sample products for demo
  private getSampleProducts(): Product[] {
    return [
      {
        id: '1',
        name: 'Wireless Headphones',
        description: 'High-quality Bluetooth headphones with noise cancellation',
        category: 'Electronics',
        price: 99.99,
        cost: 60.00,
        stock: 25,
        minStock: 5,
        sku: 'WH001',
        createdAt: new Date('2024-01-15'),
        updatedAt: new Date('2024-01-15'),
      },
      {
        id: '2',
        name: 'Cotton T-Shirt',
        description: 'Comfortable 100% cotton t-shirt in various colors',
        category: 'Clothing',
        price: 19.99,
        cost: 8.00,
        stock: 50,
        minStock: 10,
        sku: 'TS001',
        createdAt: new Date('2024-01-16'),
        updatedAt: new Date('2024-01-16'),
      },
      {
        id: '3',
        name: 'Coffee Beans',
        description: 'Premium arabica coffee beans, medium roast',
        category: 'Food & Beverages',
        price: 12.99,
        cost: 6.50,
        stock: 3,
        minStock: 5,
        sku: 'CB001',
        createdAt: new Date('2024-01-17'),
        updatedAt: new Date('2024-01-17'),
      },
      {
        id: '4',
        name: 'Programming Book',
        description: 'Learn JavaScript programming from basics to advanced',
        category: 'Books',
        price: 39.99,
        cost: 20.00,
        stock: 0,
        minStock: 3,
        sku: 'PB001',
        createdAt: new Date('2024-01-18'),
        updatedAt: new Date('2024-01-18'),
      },
      {
        id: '5',
        name: 'Garden Hose',
        description: '50ft expandable garden hose with spray nozzle',
        category: 'Home & Garden',
        price: 29.99,
        cost: 15.00,
        stock: 15,
        minStock: 5,
        sku: 'GH001',
        createdAt: new Date('2024-01-19'),
        updatedAt: new Date('2024-01-19'),
      },
    ];
  }

  async getProducts(userId: string): Promise<Product[]> {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 300));
    
    if (!this.products.has(userId)) {
      // Initialize with sample data for new users
      this.products.set(userId, this.getSampleProducts());
    }
    
    return this.products.get(userId) || [];
  }

  async getCategories(userId: string): Promise<Category[]> {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 200));
    
    if (!this.categories.has(userId)) {
      // Initialize with default categories for new users
      this.categories.set(userId, this.getDefaultCategories());
    }
    
    return this.categories.get(userId) || [];
  }

  async addProduct(userId: string, productData: Omit<Product, 'id' | 'createdAt' | 'updatedAt'>): Promise<Product> {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 400));
    
    const products = this.products.get(userId) || [];
    
    // Check if SKU already exists
    const existingSku = products.find(p => p.sku === productData.sku);
    if (existingSku) {
      throw new Error('A product with this SKU already exists');
    }
    
    const newProduct: Product = {
      ...productData,
      id: Date.now().toString(),
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    
    const updatedProducts = [...products, newProduct];
    this.products.set(userId, updatedProducts);
    
    return newProduct;
  }

  async updateProduct(userId: string, productId: string, updates: Partial<Product>): Promise<Product> {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 400));
    
    const products = this.products.get(userId) || [];
    const productIndex = products.findIndex(p => p.id === productId);
    
    if (productIndex === -1) {
      throw new Error('Product not found');
    }
    
    // Check if SKU already exists (excluding current product)
    if (updates.sku) {
      const existingSku = products.find(p => p.sku === updates.sku && p.id !== productId);
      if (existingSku) {
        throw new Error('A product with this SKU already exists');
      }
    }
    
    const updatedProduct: Product = {
      ...products[productIndex],
      ...updates,
      updatedAt: new Date(),
    };
    
    const updatedProducts = [...products];
    updatedProducts[productIndex] = updatedProduct;
    this.products.set(userId, updatedProducts);
    
    return updatedProduct;
  }

  async deleteProduct(userId: string, productId: string): Promise<void> {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 300));
    
    const products = this.products.get(userId) || [];
    const updatedProducts = products.filter(p => p.id !== productId);
    this.products.set(userId, updatedProducts);
  }

  async addCategory(userId: string, categoryData: Omit<Category, 'id'>): Promise<Category> {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 300));
    
    const categories = this.categories.get(userId) || [];
    
    // Check if category name already exists
    const existingCategory = categories.find(c => c.name.toLowerCase() === categoryData.name.toLowerCase());
    if (existingCategory) {
      throw new Error('A category with this name already exists');
    }
    
    const newCategory: Category = {
      ...categoryData,
      id: Date.now().toString(),
    };
    
    const updatedCategories = [...categories, newCategory];
    this.categories.set(userId, updatedCategories);
    
    return newCategory;
  }
}

export const inventoryService = new InventoryService();