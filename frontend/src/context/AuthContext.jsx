import React, { createContext, useContext, useState, useEffect } from 'react';

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

  const fetchUserData = async (token) => {
    try {
        console.log(token);
      const response = await fetch('http://localhost:8080/api/users/get-info', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        throw new Error('Failed to fetch user data');
      }

      const userData = await response.json();
      return userData;
    } catch (error) {
      console.error('Error fetching user data:', error);
      throw error;
    }
  };

  const checkAuth = async () => {
    try {
      const token = localStorage.getItem('token');
      
      if (!token) {
        setLoading(false);
        return;
      }

      try {
        const userData = await fetchUserData(token);
        setUser(userData);
      } catch (error) {
        console.error('Error checking auth:', error);
        localStorage.removeItem('token');
      }
    } catch (error) {
      console.error('Auth check failed:', error);
      localStorage.removeItem('token');
    } finally {
      setLoading(false);
    }
  };

  const login = async (email, password) => {
    try {
      const response = await fetch('http://localhost:8080/api/users/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email, password })
      });

      const data = await response.json();

      if (response.ok && data.token) {
        localStorage.setItem('token', data.token);
        
        try {
          const userData = await fetchUserData(data.token);
          setUser(userData);
          return { success: true };
        } catch (error) {
          console.error('Error fetching user data after login:', error);
          localStorage.removeItem('token');
          return { success: false, error: 'Không thể lấy thông tin người dùng' };
        }
      } else {
        return { success: false, error: data.message || 'Đăng nhập thất bại' };
      }
    } catch (error) {
      console.error('Login failed:', error);
      return { success: false, error: 'Đăng nhập thất bại' };
    }
  };

  const register = async (userData) => {
    try {
      const response = await fetch('http://localhost:8080/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(userData)
      });

      const data = await response.json();

      if (response.ok) {
        return { success: true };
      } else {
        return { success: false, error: data.message };
      }
    } catch (error) {
      console.error('Registration failed:', error);
      return { success: false, error: 'Đăng ký thất bại' };
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
  };

  const updateProfile = async (updateData) => {
    try {
      const token = localStorage.getItem('token');
      const decoded = jwt_decode(token);
      
      const response = await fetch(`http://localhost:8080/api/users/${decoded.id}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(updateData)
      });

      const data = await response.json();

      if (response.ok) {
        // Fetch lại thông tin user sau khi cập nhật
        const updatedUserData = await fetchUserData(decoded.id, token);
        setUser(updatedUserData);
        return { success: true };
      } else {
        return { success: false, error: data.message };
      }
    } catch (error) {
      console.error('Profile update failed:', error);
      return { success: false, error: 'Cập nhật thông tin thất bại' };
    }
  };

  const value = {
    user,
    loading,
    login,
    register,
    logout,
    updateProfile
  };

  if (loading) {
    return <div className="flex items-center justify-center h-screen">Đang tải...</div>;
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};