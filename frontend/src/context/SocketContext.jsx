import React, { createContext, useContext, useEffect, useState } from 'react';
import io from 'socket.io-client';

const SocketContext = createContext();

export const useSocket = () => {
  const context = useContext(SocketContext);
  if (!context) {
    throw new Error('useSocket must be used within a SocketProvider');
  }
  return context;
};

export const SocketProvider = ({ children }) => {
  const [socket, setSocket] = useState(null);
  const [onlineUsers, setOnlineUsers] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [unreadNotifications, setUnreadNotifications] = useState(0);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      console.log('Initializing socket with token:', token);
      const newSocket = io('http://localhost:8080', {
        auth: {
          token: token.startsWith('Bearer ') ? token : `Bearer ${token}`
        }
      });

      setSocket(newSocket);

      // Lắng nghe các events
      newSocket.on('connect', () => {
        console.log('Connected to server');
        newSocket.emit('join_conversations');
      });

      newSocket.on('user_online', (userId) => {
        setOnlineUsers(prev => [...prev.filter(id => id !== userId), userId]);
      });

      newSocket.on('user_offline', (userId) => {
        setOnlineUsers(prev => prev.filter(id => id !== userId));
      });

      newSocket.on('new_notification', (notification) => {
        setNotifications(prev => [notification, ...prev]);
        setUnreadNotifications(prev => prev + 1);
        
        // Hiển thị toast notification
        showNotificationToast(notification);
      });

      newSocket.on('disconnect', () => {
        console.log('Disconnected from server');
      });

      newSocket.on('error', (error) => {
        console.error('Socket error:', error);
      });

      newSocket.on('connect_error', (error) => {
        console.error('Socket connection error:', error);
      });

      newSocket.on('new_message', (data) => {
        console.log('Received new message:', data);
      });

      return () => {
        newSocket.close();
      };
    }
  }, []);

  const showNotificationToast = (notification) => {
    // Implement toast notification here
    // You can use libraries like react-toastify
    console.log('New notification:', notification.message);
  };

  const sendMessage = (messageData) => {
    if (socket) {
      console.log('Socket emitting message:', messageData);
      socket.emit('send_message', messageData);
    } else {
      console.error('Socket not initialized');
    }
  };

  const sendNotification = (notificationData) => {
    if (socket) {
      socket.emit('send_notification', notificationData);
    }
  };

  const markNotificationsAsRead = () => {
    setUnreadNotifications(0);
    setNotifications(prev => 
      prev.map(notif => ({ ...notif, isRead: true }))
    );
  };

  const startTyping = (conversationId) => {
    if (socket) {
      socket.emit('typing_start', { conversationId });
    }
  };

  const stopTyping = (conversationId) => {
    if (socket) {
      socket.emit('typing_stop', { conversationId });
    }
  };

  const markAsRead = (conversationId) => {
    if (socket) {
      socket.emit('mark_as_read', { conversationId });
    }
  };

  const value = {
    socket,
    onlineUsers,
    notifications,
    unreadNotifications,
    sendMessage,
    sendNotification,
    markNotificationsAsRead,
    startTyping,
    stopTyping,
    markAsRead
  };

  return (
    <SocketContext.Provider value={value}>
      {children}
    </SocketContext.Provider>
  );
};
