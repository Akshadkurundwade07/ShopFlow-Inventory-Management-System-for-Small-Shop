import { User, LoginCredentials, SignUpData } from '../types/auth';

// Mock authentication service for demo purposes
// In a real application, this would connect to your backend API

class AuthService {
  private currentUser: User | null = null;
  private users: Array<User & { password: string }> = [
    {
      id: '1',
      email: 'demo@shop.com',
      name: 'Demo User',
      shopName: 'Demo Shop',
      password: 'demo123',
      createdAt: new Date('2024-01-01'),
    }
  ];

  async getCurrentUser(): Promise<User | null> {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // Check localStorage for persisted user
    const savedUser = localStorage.getItem('currentUser');
    if (savedUser) {
      this.currentUser = JSON.parse(savedUser);
      return this.currentUser;
    }
    
    return null;
  }

  async login(credentials: LoginCredentials): Promise<User> {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 800));
    
    const user = this.users.find(
      u => u.email === credentials.email && u.password === credentials.password
    );
    
    if (!user) {
      throw new Error('Invalid email or password');
    }
    
    const { password, ...userWithoutPassword } = user;
    this.currentUser = userWithoutPassword;
    
    // Persist user in localStorage
    localStorage.setItem('currentUser', JSON.stringify(this.currentUser));
    
    return this.currentUser;
  }

  async signUp(data: SignUpData): Promise<User> {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Check if user already exists
    const existingUser = this.users.find(u => u.email === data.email);
    if (existingUser) {
      throw new Error('User with this email already exists');
    }
    
    // Create new user
    const newUser: User & { password: string } = {
      id: Date.now().toString(),
      email: data.email,
      name: data.name,
      shopName: data.shopName,
      password: data.password,
      createdAt: new Date(),
    };
    
    this.users.push(newUser);
    
    const { password, ...userWithoutPassword } = newUser;
    this.currentUser = userWithoutPassword;
    
    // Persist user in localStorage
    localStorage.setItem('currentUser', JSON.stringify(this.currentUser));
    
    return this.currentUser;
  }

  async logout(): Promise<void> {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 300));
    
    this.currentUser = null;
    localStorage.removeItem('currentUser');
  }
}

export const authService = new AuthService();