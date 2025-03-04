import axios from 'axios';
import { SwingAnalysisResult } from './AnalysisService';

// Define the base URL for API calls
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://api.swingai.example.com';

// Create an axios instance with default config
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add request interceptor to include auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('auth_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

class ApiService {
  // Authentication endpoints
  async login(email: string, password: string): Promise<{ token: string; user: any }> {
    try {
      const response = await api.post('/auth/login', { email, password });
      return response.data;
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  }

  async register(userData: { email: string; password: string; name: string }): Promise<{ token: string; user: any }> {
    try {
      const response = await api.post('/auth/register', userData);
      return response.data;
    } catch (error) {
      console.error('Registration error:', error);
      throw error;
    }
  }

  async logout(): Promise<void> {
    try {
      await api.post('/auth/logout');
      localStorage.removeItem('auth_token');
    } catch (error) {
      console.error('Logout error:', error);
      throw error;
    }
  }

  // Swing analysis endpoints
  async analyzeSwingRemote(videoFile: File, view: string): Promise<SwingAnalysisResult> {
    try {
      // Create form data to send the video file
      const formData = new FormData();
      formData.append('video', videoFile);
      formData.append('view', view);

      const response = await api.post('/analysis/swing', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        timeout: 60000, // 60 seconds timeout for video processing
      });

      return response.data;
    } catch (error) {
      console.error('Swing analysis error:', error);
      throw error;
    }
  }

  async getSwingAnalyses(): Promise<SwingAnalysisResult[]> {
    try {
      const response = await api.get('/analysis/history');
      return response.data;
    } catch (error) {
      console.error('Error fetching swing analyses:', error);
      throw error;
    }
  }

  async getSwingAnalysisById(id: string): Promise<SwingAnalysisResult> {
    try {
      const response = await api.get(`/analysis/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching swing analysis ${id}:`, error);
      throw error;
    }
  }

  async deleteSwingAnalysis(id: string): Promise<void> {
    try {
      await api.delete(`/analysis/${id}`);
    } catch (error) {
      console.error(`Error deleting swing analysis ${id}:`, error);
      throw error;
    }
  }

  // Pro golfer data endpoints
  async getProGolferData(proId: string): Promise<any> {
    try {
      const response = await api.get(`/pros/${proId}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching pro golfer data for ${proId}:`, error);
      throw error;
    }
  }

  async compareWithPro(analysisId: string, proId: string): Promise<any> {
    try {
      const response = await api.get(`/analysis/${analysisId}/compare/${proId}`);
      return response.data;
    } catch (error) {
      console.error(`Error comparing swing with pro ${proId}:`, error);
      throw error;
    }
  }

  // User profile endpoints
  async getUserProfile(): Promise<any> {
    try {
      const response = await api.get('/user/profile');
      return response.data;
    } catch (error) {
      console.error('Error fetching user profile:', error);
      throw error;
    }
  }

  async updateUserProfile(profileData: any): Promise<any> {
    try {
      const response = await api.put('/user/profile', profileData);
      return response.data;
    } catch (error) {
      console.error('Error updating user profile:', error);
      throw error;
    }
  }

  // Subscription endpoints
  async getSubscriptionPlans(): Promise<any[]> {
    try {
      const response = await api.get('/subscriptions/plans');
      return response.data;
    } catch (error) {
      console.error('Error fetching subscription plans:', error);
      throw error;
    }
  }

  async getCurrentSubscription(): Promise<any> {
    try {
      const response = await api.get('/subscriptions/current');
      return response.data;
    } catch (error) {
      console.error('Error fetching current subscription:', error);
      throw error;
    }
  }

  // Feedback endpoints
  async submitFeedback(feedback: { rating: number; comments: string }): Promise<void> {
    try {
      await api.post('/feedback', feedback);
    } catch (error) {
      console.error('Error submitting feedback:', error);
      throw error;
    }
  }
}

export default new ApiService();