import React, { useState, useEffect } from 'react';
import DashboardLayout from '../../components/DashboardLayout';
import Card from '../../components/Card';
import Button from '../../components/Button';
import Input from '../../components/Input';
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

  useEffect(() => {
    fetchConversations();
    // Poll for new messages every 10 seconds
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
        // Refresh conversations to update unread count
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
        // Add message to local state
        const newMsg = {
          ...data.data,
          senderName: `${user.firstName} ${user.lastName}`
        };
        setMessages([...messages, newMsg]);
        setNewMessage('');
        fetchConversations(); // Refresh conversations list
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
        setAvailableUsers(data.users);
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
        
        // Open the new conversation
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

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex justify-center items-center h-64">
          <div className="text-xl">Loading...</div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Messages</h1>
        <p className="text-gray-600 mt-2">Communicate with {user.role === 'guest' ? 'hosts' : user.role === 'host' ? 'guests' : 'users'}</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Conversations List */}
        <Card className="lg:col-span-1">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold">Conversations</h2>
            <Button size="sm" onClick={handleNewMessageClick}>
              New
            </Button>
          </div>
          
          <div className="space-y-2 max-h-[500px] overflow-y-auto">
            {conversations.length === 0 ? (
              <p className="text-sm text-gray-500 text-center py-8">No conversations yet</p>
            ) : (
              conversations.map(conv => (
                <div
                  key={conv.id}
                  onClick={() => loadMessages(conv)}
                  className={`p-3 rounded-lg cursor-pointer transition ${
                    selectedConversation?.id === conv.id
                      ? 'bg-blue-50 border-2 border-blue-500'
                      : 'hover:bg-gray-50 border-2 border-transparent'
                  }`}
                >
                  <div className="flex justify-between items-start mb-1">
                    <div>
                      <span className="font-semibold text-sm">{conv.withUser.name}</span>
                      <span className="text-xs text-gray-500 ml-2 capitalize">({conv.withUser.role})</span>
                    </div>
                    {conv.unread > 0 && (
                      <span className="bg-blue-500 text-white text-xs rounded-full px-2 py-1">
                        {conv.unread}
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-gray-600 truncate">{conv.lastMessage}</p>
                  <p className="text-xs text-gray-400 mt-1">
                    {new Date(conv.timestamp).toLocaleString()}
                  </p>
                </div>
              ))
            )}
          </div>
        </Card>

        {/* Messages Area */}
        <Card className="lg:col-span-2">
          {!selectedConversation ? (
            <div className="flex items-center justify-center h-96">
              <div className="text-center">
                <p className="text-gray-500 mb-4">Select a conversation to view messages</p>
                <Button onClick={handleNewMessageClick}>Start New Conversation</Button>
              </div>
            </div>
          ) : (
            <div className="flex flex-col h-[500px]">
              <div className="border-b pb-3 mb-4">
                <h2 className="text-lg font-semibold">{selectedConversation.withUser.name}</h2>
                <p className="text-sm text-gray-600 capitalize">{selectedConversation.withUser.role}</p>
              </div>

              <div className="flex-1 overflow-y-auto space-y-3 mb-4 px-2">
                {messages.map(msg => (
                  <div
                    key={msg.id}
                    className={`flex ${msg.from === user.id ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`max-w-xs px-4 py-2 rounded-lg ${
                        msg.from === user.id
                          ? 'bg-blue-500 text-white'
                          : 'bg-gray-200 text-gray-900'
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

              <div className="flex gap-2">
                <Input
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  placeholder="Type your message..."
                  onKeyPress={(e) => e.key === 'Enter' && !sending && sendMessage()}
                  disabled={sending}
                />
                <Button onClick={sendMessage} disabled={sending}>
                  {sending ? 'Sending...' : 'Send'}
                </Button>
              </div>
            </div>
          )}
        </Card>
      </div>

      <Modal
        isOpen={showNewMessageModal}
        onClose={() => {
          setShowNewMessageModal(false);
          setSelectedUser('');
          setNewConversationMessage('');
        }}
        title="Start New Conversation"
      >
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Select User
            </label>
            <select
              value={selectedUser}
              onChange={(e) => setSelectedUser(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Choose a user...</option>
              {availableUsers.map(u => (
                <option key={u.id} value={u.id}>
                  {u.name} ({u.role}) - {u.email}
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
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              rows="4"
              placeholder="Type your message..."
            />
          </div>
          
          <div className="flex gap-3">
            <Button onClick={startNewConversation} className="flex-1">
              Send Message
            </Button>
            <Button
              variant="secondary"
              onClick={() => {
                setShowNewMessageModal(false);
                setSelectedUser('');
                setNewConversationMessage('');
              }}
              className="flex-1"
            >
              Cancel
            </Button>
          </div>
        </div>
      </Modal>
    </DashboardLayout>
  );
};

export default Messages;
