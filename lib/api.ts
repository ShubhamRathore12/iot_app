// lib/api.ts for React Native
export const apiRequest = async (url: string, options?: RequestInit) => {
  try {
    // For React Native, use your actual API base URL
    const baseUrl = 'https://grain-backend-1.onrender.com';
    const fullUrl = `${baseUrl}${url}`;
    
    const response = await fetch(fullUrl, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...options?.headers,
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('API request failed:', error);
    throw error;
  }
};