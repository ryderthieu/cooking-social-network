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
      console.log('Initializing socket with token...');
      const newSocket = io('http://localhost:8080', {
        auth: {
          token: token.startsWith('Bearer ') ? token : `Bearer ${token}`
        },
        // transports: ['websocket'], // Optional: force websocket if polling is an issue
      });

      setSocket(newSocket);

      newSocket.on('connect', () => {
        console.log('Socket connected:', newSocket.id);
        newSocket.emit('join_conversations'); // Client tells server to join its conversation rooms
      });

      // Nhận danh sách người dùng online ban đầu từ server
      newSocket.on('initial_online_users', (initialUsers) => {
        console.log('Received initial_online_users:', initialUsers);
        setOnlineUsers(initialUsers);
      });

      newSocket.on('user_online', (userId) => {
        console.log('Socket event: user_online - userId:', userId);
        setOnlineUsers(prev => {
          if (!prev.includes(userId)) {
            return [...prev, userId];
          }
          return prev;
        });
      });
      
      newSocket.on('user_offline', (userId) => {
        console.log('Socket event: user_offline - userId:', userId);
        setOnlineUsers(prev => prev.filter(id => id !== userId));
      });

      newSocket.on('new_notification', (notification) => {
        setNotifications(prev => [notification, ...prev].slice(0, 20)); // Keep last 20 notifications
        setUnreadNotifications(prev => prev + 1);
        showNotificationToast(notification);
      });

      newSocket.on('notifications_marked_as_read', () => {
        setNotifications(prev => prev.map(notif => ({ ...notif, isRead: true })));
        setUnreadNotifications(0);
      });

      newSocket.on('notification_marked_as_read', ({ notificationId }) => {
        setNotifications(prev => prev.map(notif => 
          notif._id === notificationId ? { ...notif, isRead: true } : notif
        ));
        setUnreadNotifications(prev => Math.max(0, prev - 1));
      });

      // Generic error listeners
      newSocket.on('disconnect', (reason) => {
        console.log('Socket disconnected:', reason);
      });

      newSocket.on('error', (error) => {
        console.error('Socket general error:', error);
      });

      newSocket.on('connect_error', (error) => {
        console.error('Socket connection error:', error.message);
        // Potentially handle token expiry or auth issues here
        if (error.message === 'Authentication error') {
            // Handle logout or token refresh
            console.log("Authentication failed, need to re-login or refresh token.");
        }
      });

      // No need to listen for 'new_message' here if MessagePage handles it directly
      // newSocket.on('new_message', (data) => {\n      //   console.log('SocketContext received new_message:', data);\n      // });\n

      return () => {
        console.log('Closing socket connection for:', newSocket.id);
        newSocket.off('connect');
        newSocket.off('initial_online_users');
        newSocket.off('user_online');
        newSocket.off('user_offline');
        newSocket.off('new_notification');
        newSocket.off('notifications_marked_as_read');
        newSocket.off('notification_marked_as_read');
        newSocket.off('disconnect');
        newSocket.off('error');
        newSocket.off('connect_error');
        // newSocket.off('new_message');
        newSocket.close();
        setSocket(null); // Clear socket state on cleanup
      };
    } else {
        // No token, so clear socket if it exists from a previous session
        if(socket) {
            socket.close();
            setSocket(null);
        }
        setOnlineUsers([]); // Clear online users if no token
    }
  }, []); // Run only once on mount and unmount

  const showNotificationToast = (notification) => {
    console.log('Toast:: New notification:', notification.message);
    // Replace with actual toast library call, e.g., toast.info(notification.message)
  };

  const sendMessage = (messageData) => {
    if (socket) {
      socket.emit('send_message', messageData);
    } else {
      console.error('Socket not initialized to send message');
    }
  };

  const sendNotification = (notificationData) => {
    if (socket) {
      socket.emit('send_notification', notificationData);
    }
  };

  const markNotificationsAsRead = () => {
    if (socket) {
      socket.emit('mark_notifications_as_read');
      setUnreadNotifications(0);
      setNotifications(prev => 
        prev.map(notif => ({ ...notif, isRead: true }))
      );
    }
  };

  const markNotificationAsRead = (notificationId) => {
    if (socket) {
      socket.emit('mark_notification_as_read', { notificationId });
      setNotifications(prev => prev.map(notif => 
        notif._id === notificationId ? { ...notif, isRead: true } : notif
      ));
      setUnreadNotifications(prev => Math.max(0, prev - 1));
    }
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

  const markAsRead = (conversationId) => { // This might be for marking messages in a conversation as read
    if (socket) {
      socket.emit('mark_as_read', { conversationId });
      // You might want UI feedback or state update here if needed
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
    markNotificationAsRead,
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
