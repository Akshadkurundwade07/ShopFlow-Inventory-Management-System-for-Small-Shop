import React, { useState } from 'react';
import { useAuth } from './hooks/useAuth';
import { AuthForm } from './components/AuthForm';
import { LoadingSpinner } from './components/LoadingSpinner';
import { Header } from './components/Header';
import { Sidebar } from './components/Sidebar';
import { Dashboard } from './components/Dashboard';
import { Analytics } from './components/Analytics';
import { ProductList } from './components/ProductList';
import { ProductForm } from './components/ProductForm';
import { CategoryList } from './components/CategoryList';
import { Settings } from './components/Settings';
import { useInventory } from './hooks/useInventory';
import { Product } from './types/inventory';
import { LoginCredentials, SignUpData } from './types/auth';

function App() {
  const { 
    user, 
    isAuthenticated, 
    isLoading, 
    login, 
    signUp, 
    logout,
  } = useAuth();
  const [authMode, setAuthMode] = useState<'login' | 'signup'>('login');
  const [authLoading, setAuthLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [isAddingProduct, setIsAddingProduct] = useState(false);
  
  const {
    products,
    categories,
    addProduct,
    updateProduct,
    deleteProduct,
    addCategory,
    getStats,
  } = useInventory();

  const signUpWithGoogle = async () => {
    // Mock Google OAuth for demo
    const mockUser = {
      name: 'Google User',
      email: 'user@gmail.com',
      shopName: 'My Shop',
      password: 'google-oauth'
    };
    await signUp(mockUser);
  };

  const updateProfile = async (data: { name: string; shopName: string }) => {
    // Mock profile update
    console.log('Profile updated:', data);
  };

  const changePassword = async (currentPassword: string, newPassword: string) => {
    // Mock password change
    console.log('Password changed');
  };

  const deleteAccount = async () => {
    await logout();
  };

  const exportData = () => {
    const data = { user, products, categories };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `inventory-data-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleAuth = async (data: LoginCredentials | SignUpData) => {
    setAuthLoading(true);
    try {
      if (authMode === 'login') {
        await login(data as LoginCredentials);
      } else {
        await signUp(data as SignUpData);
      }
    } catch (error) {
      throw error;
    } finally {
      setAuthLoading(false);
    }
  };

  const handleLogout = async () => {
    if (window.confirm('Are you sure you want to sign out?')) {
      await logout();
      setActiveTab('dashboard');
      setEditingProduct(null);
      setIsAddingProduct(false);
    }
  };

  if (isLoading) {
    return <LoadingSpinner />;
  }

  if (!isAuthenticated) {
    return (
      <AuthForm
        mode={authMode}
        onSubmit={handleAuth}
        onGoogleSignUp={authMode === 'signup' ? signUpWithGoogle : undefined}
        onToggleMode={() => setAuthMode(authMode === 'login' ? 'signup' : 'login')}
        isLoading={authLoading}
      />
    );
  }

  const handleSaveProduct = (productData: Omit<Product, 'id' | 'createdAt' | 'updatedAt'>) => {
    if (editingProduct) {
      updateProduct(editingProduct.id, productData);
      setEditingProduct(null);
    } else {
      addProduct(productData);
      setIsAddingProduct(false);
    }
  };

  const handleCancelProduct = () => {
    setEditingProduct(null);
    setIsAddingProduct(false);
  };

  const handleDeleteProduct = (id: string) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      deleteProduct(id);
    }
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <Dashboard stats={getStats()} />;
      case 'analytics':
        return <Analytics />;
      case 'products':
        return (
          <ProductList
            products={products}
            categories={categories}
            onEditProduct={setEditingProduct}
            onDeleteProduct={handleDeleteProduct}
            onAddProduct={() => setIsAddingProduct(true)}
          />
        );
      case 'categories':
        return <CategoryList categories={categories} onAddCategory={addCategory} />;
      case 'settings':
        return (
          <Settings
            user={user!}
            onUpdateProfile={updateProfile}
            onChangePassword={changePassword}
            onDeleteAccount={deleteAccount}
            onExportData={exportData}
          />
        );
      default:
        return <Dashboard stats={getStats()} />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header user={user!} onLogout={handleLogout} />
      
      <div className="flex">
        <Sidebar activeTab={activeTab} onTabChange={setActiveTab} />
        
        <div className="flex-1 p-8">
          {renderContent()}
        </div>
      </div>

      {(editingProduct || isAddingProduct) && (
        <ProductForm
          product={editingProduct || undefined}
          categories={categories}
          onSave={handleSaveProduct}
          onCancel={handleCancelProduct}
        />
      )}
    </div>
  );
}

export default App;