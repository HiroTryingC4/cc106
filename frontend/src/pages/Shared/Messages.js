import React, { useState, useEffect } from 'react';
import DashboardLayout from '../../components/DashboardLayout';
import AdminLayout from '../../components/AdminLayout';
import Button from '../../components/Button';
import Modal from '../../components/Modal';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../components/Toast';

const Messages = () => {
  const { user } = useAuth();
  const { addToast } = useToast();
  const [conversations, setConversations] = useState([]);
  const [selectedConversation, setSelectedConversation] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [showNewMessageModal, setShowNewMessageModal] = useState(false);
  const [availableUsers, setAvailableUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState('');
  const [newConversationMessage, setNewConversationMessage] = useState('');
  const [activeTab, setActiveTab] = useState('guests'); // 'guests' or 'hosts'

  useEffect(() => {
    fetchConversations();
    const interval = setInterval(fetchConversations, 10000);
    return () => clearInterval(interval);
  }, []);

  const fetchConversations = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:5000/api/messages/conversations', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await response.json();
      if (data.success) {
        setConversations(data.conversations);
      }
    } catch (error) {
      console.error('Error fetching conversations:', error);
      addToast('Error loading conversations', 'error');
    } finally {
      setLoading(false);
    }
  };

  const loadMessages = async (conversation) => {
    setSelectedConversation(conversation);
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:5000/api/messages/conversation/${conversation.withUser.id}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await response.json();
      if (data.success) {
        setMessages(data.messages);
        fetchConversations();
      }
    } catch (error) {
      console.error('Error loading messages:', error);
      addToast('Error loading messages', 'error');
    }
  };

  const sendMessage = async () => {
    if (!newMessage.trim() || !selectedConversation) return;
    
    setSending(true);
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:5000/api/messages/send', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          to: selectedConversation.withUser.id,
          toRole: selectedConversation.withUser.role,
          message: newMessage
        })
      });
      
      const data = await response.json();
      if (data.success) {
        const newMsg = {
          ...data.data,
          senderName: `${user.firstName} ${user.lastName}`
        };
        setMessages([...messages, newMsg]);
        setNewMessage('');
        fetchConversations();
      } else {
        addToast(data.message || 'Error sending message', 'error');
      }
    } catch (error) {
      console.error('Error sending message:', error);
      addToast('Error sending message', 'error');
    } finally {
      setSending(false);
    }
  };

  const fetchAvailableUsers = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:5000/api/messages/users', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await response.json();
      if (data.success) {
        // For admin, filter users based on active tab
        if (user.role === 'admin') {
          const targetRole = activeTab === 'guests' ? 'guest' : 'host';
          setAvailableUsers(data.users.filter(u => u.role === targetRole));
        } else {
          setAvailableUsers(data.users);
        }
      }
    } catch (error) {
      console.error('Error fetching users:', error);
      addToast('Error loading users', 'error');
    }
  };

  const startNewConversation = async () => {
    if (!selectedUser || !newConversationMessage.trim()) {
      addToast('Please select a user and enter a message', 'error');
      return;
    }
    
    try {
      const token = localStorage.getItem('token');
      const selectedUserData = availableUsers.find(u => u.id === selectedUser);
      
      const response = await fetch('http://localhost:5000/api/messages/send', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          to: selectedUser,
          toRole: selectedUserData.role,
          message: newConversationMessage
        })
      });
      
      const data = await response.json();
      if (data.success) {
        addToast('Message sent successfully', 'success');
        setShowNewMessageModal(false);
        setSelectedUser('');
        setNewConversationMessage('');
        fetchConversations();
        
        const newConv = {
          id: selectedUser,
          withUser: {
            id: selectedUser,
            name: selectedUserData.name,
            role: selectedUserData.role
          }
        };
        loadMessages(newConv);
      } else {
        addToast(data.message || 'Error sending message', 'error');
      }
    } catch (error) {
      console.error('Error starting conversation:', error);
      addToast('Error starting conversation', 'error');
    }
  };

  const handleNewMessageClick = () => {
    fetchAvailableUsers();
    setShowNewMessageModal(true);
  };

  const Layout = user.role === 'admin' ? AdminLayout : DashboardLayout;

  // Filter conversations based on active tab for admin
  const filteredConversations = user.role === 'admin' 
    ? conversations.filter(conv => conv.withUser.role === activeTab.slice(0, -1)) // 'guests' -> 'guest', 'hosts' -> 'host'
    : conversations;

  if (loading) {
    return (
      <Layout>
        <div className="flex justify-center items-center h-64">
          <div className="text-xl">Loading...</div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Messages</h1>
        <p className="text-gray-600 mt-1">Communicate with {user.role === 'guest' ? 'hosts' : user.role === 'host' ? 'guests' : 'users'}</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Conversations Card */}
        <div className="lg:col-span-1 bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="p-4 border-b border-gray-200 flex justify-between items-center">
            <h2 className="text-lg font-semibold text-gray-900">Conversations</h2>
            <button
              onClick={handleNewMessageClick}
              className="px-4 py-1.5 bg-[#4E7B22] text-white text-sm rounded-md hover:bg-[#3d6119] transition font-medium"
            >
              New
            </button>
          </div>

          {/* Tabs for Admin */}
          {user.role === 'admin' && (
            <div className="flex border-b border-gray-200">
              <button
                onClick={() => {
                  setActiveTab('guests');
                  setSelectedConversation(null);
                  setMessages([]);
                }}
                className={`flex-1 px-4 py-3 text-sm font-medium transition ${
                  activeTab === 'guests'
                    ? 'text-[#4E7B22] border-b-2 border-[#4E7B22] bg-green-50'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                }`}
              >
                Guests
              </button>
              <button
                onClick={() => {
                  setActiveTab('hosts');
                  setSelectedConversation(null);
                  setMessages([]);
                }}
                className={`flex-1 px-4 py-3 text-sm font-medium transition ${
                  activeTab === 'hosts'
                    ? 'text-[#4E7B22] border-b-2 border-[#4E7B22] bg-green-50'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                }`}
              >
                Hosts
              </button>
            </div>
          )}
          
          <div className="overflow-y-auto" style={{ maxHeight: '500px' }}>
            {filteredConversations.length === 0 ? (
              <div className="p-8 text-center">
                <p className="text-sm text-gray-400">No conversations yet</p>
              </div>
            ) : (
              filteredConversations.map(conv => (
                <div
                  key={conv.id}
                  onClick={() => loadMessages(conv)}
                  className={`p-4 cursor-pointer transition border-b border-gray-100 ${
                    selectedConversation?.id === conv.id
                      ? 'bg-blue-50'
                      : 'hover:bg-gray-50'
                  }`}
                >
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <div className="font-semibold text-sm text-gray-900">{conv.withUser.name}</div>
                      <span className="text-xs text-gray-500 capitalize">{conv.withUser.role}</span>
                    </div>
                    {conv.unread > 0 && (
                      <span className="bg-blue-500 text-white text-xs rounded-full px-2 py-0.5 font-medium">
                        {conv.unread}
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-gray-600 truncate">{conv.lastMessage}</p>
                  <p className="text-xs text-gray-400 mt-1">
                    {new Date(conv.timestamp).toLocaleDateString()}
                  </p>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Messages Card */}
        <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          {!selectedConversation ? (
            <div className="flex items-center justify-center h-full" style={{ minHeight: '500px' }}>
              <div className="text-center">
                <p className="text-gray-400 mb-4">Select a conversation to view messages</p>
                <button
                  onClick={handleNewMessageClick}
                  className="px-6 py-2.5 bg-[#4E7B22] text-white rounded-md hover:bg-[#3d6119] transition font-medium"
                >
                  Start New Conversation
                </button>
              </div>
            </div>
          ) : (
            <div className="flex flex-col" style={{ height: '500px' }}>
              <div className="p-4 border-b border-gray-200">
                <h2 className="text-lg font-semibold text-gray-900">{selectedConversation.withUser.name}</h2>
                <p className="text-sm text-gray-600 capitalize">{selectedConversation.withUser.role}</p>
              </div>

              <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-gray-50">
                {messages.map(msg => (
                  <div
                    key={msg.id}
                    className={`flex ${msg.from === user.id ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`max-w-xs px-4 py-2 rounded-lg ${
                        msg.from === user.id
                          ? 'bg-blue-500 text-white'
                          : 'bg-white text-gray-900 border border-gray-200'
                      }`}
                    >
                      <p className="text-sm whitespace-pre-wrap">{msg.message}</p>
                      <p className={`text-xs mt-1 ${msg.from === user.id ? 'text-blue-100' : 'text-gray-500'}`}>
                        {new Date(msg.createdAt).toLocaleTimeString()}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="p-4 border-t border-gray-200">
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    placeholder="Type your message..."
                    onKeyPress={(e) => e.key === 'Enter' && !sending && sendMessage()}
                    disabled={sending}
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                  <button
                    onClick={sendMessage}
                    disabled={sending}
                    className="px-6 py-2 bg-[#4E7B22] text-white rounded-lg hover:bg-[#3d6119] disabled:opacity-50 disabled:cursor-not-allowed font-medium transition"
                  >
                    {sending ? 'Sending...' : 'Send'}
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      <Modal
        isOpen={showNewMessageModal}
        onClose={() => {
          setShowNewMessageModal(false);
          setSelectedUser('');
          setNewConversationMessage('');
        }}
        title={`Start New Conversation${user.role === 'admin' ? ` with ${activeTab === 'guests' ? 'Guest' : 'Host'}` : ''}`}
      >
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Select {user.role === 'admin' ? (activeTab === 'guests' ? 'Guest' : 'Host') : 'User'}
            </label>
            <select
              value={selectedUser}
              onChange={(e) => setSelectedUser(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#4E7B22]"
            >
              <option value="">Choose a {user.role === 'admin' ? (activeTab === 'guests' ? 'guest' : 'host') : 'user'}...</option>
              {availableUsers.map(u => (
                <option key={u.id} value={u.id}>
                  {u.name} - {u.email}
                </option>
              ))}
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Message
            </label>
            <textarea
              value={newConversationMessage}
              onChange={(e) => setNewConversationMessage(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#4E7B22]"
              rows="4"
              placeholder="Type your message..."
            />
          </div>
          
          <div className="flex gap-3">
            <button
              onClick={startNewConversation}
              className="flex-1 px-4 py-2 bg-[#4E7B22] text-white rounded-lg hover:bg-[#3d6119] transition font-medium"
            >
              Send Message
            </button>
            <button
              onClick={() => {
                setShowNewMessageModal(false);
                setSelectedUser('');
                setNewConversationMessage('');
              }}
              className="flex-1 px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition font-medium"
            >
              Cancel
            </button>
          </div>
        </div>
      </Modal>
    </Layout>
  );
};

export default Messages;
