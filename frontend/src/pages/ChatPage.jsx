import React, { useState, useEffect, useRef } from 'react';
import { useSocket } from '../context/SocketContext';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const ChatPage = () => {
  const navigate = useNavigate();
  const { socket, sendMessage, startTyping, stopTyping } = useSocket();
  const { user, loading } = useAuth();
  const [conversations, setConversations] = useState([]);
  const [currentConversation, setCurrentConversation] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [typingUsers, setTypingUsers] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    if (!loading && !user) {
      navigate('/login');
      return;
    }

    if (user && socket) {
      fetchConversations();
    }
  }, [user, loading, socket]);

  useEffect(() => {
    if (socket) {
      socket.on('new_message', ({ message, conversationId }) => {
        console.log('Received message in ChatPage:', { message, conversationId });
        if (currentConversation?._id === conversationId) {
          console.log('Adding message to current conversation');
          setMessages(prev => [...prev, message]);
        }
      });

      socket.on('user_typing', ({ userId, userName, conversationId }) => {
        if (currentConversation?._id === conversationId) {
          setTypingUsers(prev => ({
            ...prev,
            [userId]: userName
          }));
        }
      });

      socket.on('user_stop_typing', ({ userId, conversationId }) => {
        if (currentConversation?._id === conversationId) {
          setTypingUsers(prev => {
            const newTyping = { ...prev };
            delete newTyping[userId];
            return newTyping;
          });
        }
      });

      socket.on('error', (error) => {
        console.error('Socket error in ChatPage:', error);
      });

      return () => {
        if (socket) {
          socket.off('new_message');
          socket.off('user_typing');
          socket.off('user_stop_typing');
          socket.off('error');
        }
      };
    }
  }, [socket, currentConversation]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const fetchConversations = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await fetch('http://localhost:8080/api/conversations', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      
      if (!response.ok) {
        throw new Error('Failed to fetch conversations');
      }
      
      const result = await response.json();
      if (result.success) {
        const conversationsData = result.data.conversations || [];
        setConversations(conversationsData);
      } else {
        console.error('API error:', result.message);
        setError(result.message || 'Không thể tải cuộc trò chuyện');
        setConversations([]);
      }
    } catch (error) {
      console.error('Error fetching conversations:', error);
      setError('Không thể tải cuộc trò chuyện');
      setConversations([]);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchMessages = async (conversationId) => {
    try {
      setIsLoading(true);
      setError(null);
      
      const response = await fetch(`http://localhost:8080/api/messages/conversations/${conversationId}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      
      if (!response.ok) {
        throw new Error('Failed to fetch messages');
      }
      
      const result = await response.json();
      console.log('Messages response:', result);
      
      if (result.success) {
        const messagesData = result.data.messages || [];
        console.log('Messages data:', messagesData);
        setMessages(messagesData);
      } else {
        console.error('API error:', result.message);
        setError(result.message || 'Không thể tải tin nhắn');
        setMessages([]);
      }
    } catch (error) {
      console.error('Error fetching messages:', error);
      setError('Không thể tải tin nhắn');
      setMessages([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (newMessage.trim() && currentConversation) {
      console.log('Sending message:', {
        conversationId: currentConversation._id,
        type: 'text',
        text: newMessage
      });
      sendMessage({
        conversationId: currentConversation._id,
        type: 'text',
        text: newMessage
      });
      setNewMessage('');
    }
  };

  const handleTyping = (e) => {
    setNewMessage(e.target.value);
    if (currentConversation) {
      if (e.target.value) {
        startTyping(currentConversation._id);
      } else {
        stopTyping(currentConversation._id);
      }
    }
  };

  const selectConversation = (conversation) => {
    setCurrentConversation(conversation);
    fetchMessages(conversation._id);
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  if (loading || !user) {
    return (
      <div className="flex h-[calc(100vh-64px)] items-center justify-center">
        <div className="text-gray-500">Đang tải...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex h-[calc(100vh-64px)] items-center justify-center">
        <div className="text-red-500">{error}</div>
      </div>
    );
  }

  return (
    <div className="flex h-[calc(100vh-64px)] bg-gray-50">
      {/* Sidebar */}
      <div className="w-[300px] bg-white border-r border-gray-200">
        <div className="h-full overflow-y-auto">
          {isLoading ? (
            <div className="flex items-center justify-center h-full">
              <div className="text-gray-500">Đang tải cuộc trò chuyện...</div>
            </div>
          ) : conversations.length === 0 ? (
            <div className="flex items-center justify-center h-full">
              <div className="text-gray-500">Chưa có cuộc trò chuyện nào</div>
            </div>
          ) : (
            conversations.map(conversation => (
              <div
                key={conversation._id}
                onClick={() => selectConversation(conversation)}
                className={`flex items-center p-4 cursor-pointer hover:bg-gray-100 ${
                  currentConversation?._id === conversation._id ? 'bg-gray-100' : ''
                }`}
              >
                <img
                  src={(conversation.members && conversation.members.length > 0 && conversation.members[0]?.avatar) || '/default-avatar.png'}
                  alt="Avatar"
                  className="w-10 h-10 rounded-full mr-3"
                />
                <div>
                  <div className="font-medium">
                    {conversation.members && conversation.members.length > 0
                      ? conversation.members
                          .filter(member => member._id !== user._id)
                          .map(member => `${member.firstName} ${member.lastName}`)
                          .join(', ')
                      : 'Không có thành viên'}
                  </div>
                  <div className="text-sm text-gray-500 truncate">
                    {conversation.lastMessage?.text || 'Bắt đầu cuộc trò chuyện'}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Chat Area */}
      <div className="flex-1 flex flex-col">
        {currentConversation ? (
          <>
            {/* Chat Header */}
            <div className="p-4 bg-white border-b border-gray-200">
              <div className="text-lg font-semibold">
                {currentConversation.members && currentConversation.members.length > 0
                  ? currentConversation.members
                      .filter(member => member._id !== user._id)
                      .map(member => `${member.firstName} ${member.lastName}`)
                      .join(', ')
                  : 'Không có thành viên'}
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {isLoading ? (
                <div className="flex items-center justify-center h-full">
                  <div className="text-gray-500">Đang tải tin nhắn...</div>
                </div>
              ) : messages.length === 0 ? (
                <div className="flex items-center justify-center h-full">
                  <div className="text-gray-500">Chưa có tin nhắn nào</div>
                </div>
              ) : (
                <>
                  {console.log('Rendering messages:', messages)}
                  {messages.map(message => (
                    <div
                      key={message._id}
                      className={`flex ${message.sender._id === user._id ? 'justify-end' : 'justify-start'}`}
                    >
                      <div
                        className={`max-w-[60%] px-4 py-2 rounded-2xl shadow-sm ${
                          message.sender._id === user._id
                            ? 'bg-blue-500 text-white'
                            : 'bg-white text-gray-900'
                        }`}
                      >
                        {message.text}
                      </div>
                    </div>
                  ))}
                  {Object.values(typingUsers).length > 0 && (
                    <div className="text-sm text-gray-500 italic">
                      {Object.values(typingUsers).join(', ')} đang nhập...
                    </div>
                  )}
                  <div ref={messagesEndRef} />
                </>
              )}
            </div>

            {/* Input Area */}
            <form onSubmit={handleSendMessage} className="p-4 bg-white border-t border-gray-200">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={newMessage}
                  onChange={handleTyping}
                  placeholder="Nhập tin nhắn..."
                  className="flex-1 px-4 py-2 border border-gray-200 rounded-full focus:outline-none focus:border-blue-500"
                  disabled={isLoading}
                />
                <button
                  type="submit"
                  className={`px-6 py-2 bg-blue-500 text-white font-medium rounded-full transition-colors ${
                    isLoading ? 'opacity-50 cursor-not-allowed' : 'hover:bg-blue-600'
                  }`}
                  disabled={isLoading}
                >
                  Gửi
                </button>
              </div>
            </form>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center text-gray-500 text-lg">
            Chọn một cuộc trò chuyện để bắt đầu
          </div>
        )}
      </div>
    </div>
  );
};

export default ChatPage; 