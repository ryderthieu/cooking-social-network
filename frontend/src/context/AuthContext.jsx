import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  login as loginUser,
  register as registerUser,
  getUserInfo,
  editProfile,
  forgotPassword,
  resetPassword,
  confirmOtp,
} from '../services/userService';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkAuth();
  }, []);

  const fetchUserData = async () => {
    try {
      const response = await getUserInfo();
      setUser(response.data);
      return response.data;
    } catch (error) {
      console.error('Error fetching user data:', error);
      throw error;
    }
  };

  const checkAuth = async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      setLoading(false);
      return;
    }
    try {
      await fetchUserData();
    } catch {
      localStorage.removeItem('token');
    } finally {
      setLoading(false);
    }
  };

  const login = async (email, password) => {
    try {
      const response = await loginUser({ email, password });
      const data = response.data;
      localStorage.setItem('token', data.token);
      await fetchUserData();
      return { success: true };
    } catch (error) {
      console.error('Login failed:', error);
      return { success: false, error: 'Đăng nhập thất bại' };
    }
  };

  const register = async (userData) => {
    try {
      const response = await registerUser(userData);
      return { success: true, data: response.data };
    } catch (error) {
      console.error('Registration failed:', error);
      throw new Error ({
        success: false,
        error: error?.response?.data?.message || 'Đăng ký thất bại',
      });
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
  };

  const updateProfile = async (updateData) => {
    try {
      const response = await editProfile(updateData);
      await fetchUserData();
      return { success: true, data: response.data };
    } catch (error) {
      console.error('Profile update failed:', error);
      return {
        success: false,
        error: error?.response?.data?.message || 'Cập nhật thất bại',
      };
    }
  };

  const handleForgotPassword = async (email) => {
    try {
      await forgotPassword({ email });
      return { success: true };
    } catch (error) {
      return {
        success: false,
        error: error?.response?.data?.message || 'Gửi email thất bại',
      };
    }
  };

  const handleResetPassword = async (email, newPassword) => {
    try {
      await resetPassword({ email, newPassword });
      return { success: true };
    } catch (error) {
      return {
        success: false,
        error: error?.response?.data?.message || 'Đặt lại mật khẩu thất bại',
      };
    }
  };

  const handleConfirmOtp = async (email, otp) => {
    try {
      await confirmOtp({ email, otp });
      return { success: true };
    } catch (error) {
      return {
        success: false,
        error: error?.response?.data?.message || 'Xác thực OTP thất bại',
      };
    }
  };

  const value = {
    user,
    loading,
    login,
    register,
    logout,
    updateProfile,
    handleForgotPassword,
    handleResetPassword,
    handleConfirmOtp,
  };

  if (loading) {
    return <div className="flex items-center justify-center h-screen">Đang tải...</div>;
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
