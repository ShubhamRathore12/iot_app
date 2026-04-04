import AsyncStorage from '@react-native-async-storage/async-storage';

// API service for handling authentication and other API calls
const BASE_URL = 'http://localhost:3000'; 
const COOKIES_KEY = 'api_cookies';

interface LoginCredentials {
  username: string;
  password: string;
}

interface LoginResponse {
  token?: string;
  refreshToken?: string;
  user: {
    id: string | number;
    username: string;
    email: string;
    role?: string;
    firstName?: string;
    lastName?: string;
    name?: string;
    accountType?: string;
    phoneNumber?: string;
    company?: string;
    monitorAccess?: string;
    created_at?: string;
    location?: string | null;
  };
}

export interface DeviceStatus {
  deviceId: string;
  machineStatus: 'active' | 'inactive' | 'maintenance';
  internetStatus: boolean;
  coolingStatus: boolean;
  lastUpdated: string;
}

class ApiService {
  private baseUrl: string;
  private cookies: string = '';

  constructor() {
    this.baseUrl = BASE_URL;
  }

  // Set base URL dynamically if needed
  setBaseUrl(url: string) {
    this.baseUrl = url;
  }

  // Store cookies from Set-Cookie response headers
  private async extractAndStoreCookies(response: Response) {
    const setCookie = response.headers.get('set-cookie');
    if (setCookie) {
      // Parse cookie names and values (strip attributes like Path, HttpOnly, etc.)
      const cookieParts = setCookie.split(',').map((c) => {
        const nameValue = c.trim().split(';')[0];
        return nameValue;
      }).filter(Boolean);
      this.cookies = cookieParts.join('; ');
      console.log('Cookies stored:', this.cookies);
      // Persist to AsyncStorage for app restart
      try { await AsyncStorage.setItem(COOKIES_KEY, this.cookies); } catch (e) { /* ignore */ }
    }
  }

  // Restore cookies from storage (call on app startup)
  async restoreCookies() {
    try {
      const stored = await AsyncStorage.getItem(COOKIES_KEY);
      if (stored) this.cookies = stored;
    } catch (e) { /* ignore */ }
  }

  // Clear cookies on logout
  async clearCookies() {
    this.cookies = '';
    try { await AsyncStorage.removeItem(COOKIES_KEY); } catch (e) { /* ignore */ }
  }

  // Helper method to create headers
  private getHeaders(token?: string, { includeCookies = true }: { includeCookies?: boolean } = {}) {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    };

    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    // Attach cookies to every request (except login which sets them)
    if (includeCookies && this.cookies) {
      headers['Cookie'] = this.cookies;
    }

    return headers;
  }

  // Login API call
  async login(credentials: LoginCredentials): Promise<LoginResponse> {
    console.log('API Service: Starting login request...', credentials);
    try {
      const response = await fetch(`${this.baseUrl}/api/login`, {
        method: 'POST',
        headers: this.getHeaders(undefined, { includeCookies: false }),
        body: JSON.stringify({
          username: credentials.username, // Using email field in credentials
          password: credentials.password,
        }),
      });
      console.log('API Service: Login response received, status:', response.status);

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
      }

      // Capture cookies from login response
      await this.extractAndStoreCookies(response);

      const data: LoginResponse = await response.json();
      console.log('API Service: Login response data:', data);
      return data;
    } catch (error) {
      console.error('Login API error:', error);
      throw error;
    }
  }

  // Logout API call
  async logout(token: string): Promise<void> {
    try {
      const response = await fetch(`${this.baseUrl}/api/logout`, {
        method: 'POST',
        headers: this.getHeaders(token),
      });

      if (!response.ok) {
        console.warn('Logout API call failed:', response.status);
      }
    } catch (error) {
      console.error('Logout API error:', error);
    } finally {
      this.clearCookies();
    }
  }

  // Refresh token API call
  async refreshToken(refreshToken: string): Promise<{ token: string; refreshToken: string }> {
    try {
      const response = await fetch(`${this.baseUrl}/api/refresh`, {
        method: 'POST',
        headers: this.getHeaders(),
        body: JSON.stringify({ refreshToken }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Token refresh error:', error);
      throw error;
    }
  }

  // Generic GET request
  async get<T>(endpoint: string, token?: string): Promise<T> {
    try {
      const response = await fetch(`${this.baseUrl}${endpoint}`, {
        method: 'GET',
        headers: this.getHeaders(token),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data: T = await response.json();
      return data;
    } catch (error) {
      console.error('API GET error:', error);
      throw error;
    }
  }

  // Generic POST request
  async post<T>(endpoint: string, data: any, token?: string): Promise<T> {
    try {
      const response = await fetch(`${this.baseUrl}${endpoint}`, {
        method: 'POST',
        headers: this.getHeaders(token),
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result: T = await response.json();
      return result;
    } catch (error) {
      console.error('API POST error:', error);
      throw error;
    }
  }

  // Generic PUT request
  async put<T>(endpoint: string, data: any, token?: string): Promise<T> {
    try {
      const response = await fetch(`${this.baseUrl}${endpoint}`, {
        method: 'PUT',
        headers: this.getHeaders(token),
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result: T = await response.json();
      return result;
    } catch (error) {
      console.error('API PUT error:', error);
      throw error;
    }
  }

  // Generic DELETE request
  async delete(endpoint: string, token?: string): Promise<void> {
    try {
      const response = await fetch(`${this.baseUrl}${endpoint}`, {
        method: 'DELETE',
        headers: this.getHeaders(token),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
    } catch (error) {
      console.error('API DELETE error:', error);
      throw error;
    }
  }

  // Get public device status
  async getDeviceStatus(): Promise<DeviceStatus[]> {
    try {
      const response = await fetch(`${this.baseUrl}/api/status-public`, {
        method: 'GET',
        headers: this.getHeaders(),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data: DeviceStatus[] = await response.json();
      return data;
    } catch (error) {
      console.error('Device status API error:', error);
      throw error;
    }
  }

  // Get device reports
  async getDeviceReports(deviceName: string): Promise<any[]> {
    try {
      const response = await fetch(`${this.baseUrl}/api/reports?deviceName=${encodeURIComponent(deviceName)}`, {
        method: 'GET',
        headers: this.getHeaders(),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data: any[] = await response.json();
      return data;
    } catch (error) {
      console.error('Device reports API error:', error);
      throw error;
    }
  }
}

// Export a singleton instance
export const apiService = new ApiService();

export type { LoginCredentials, LoginResponse };

