import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useAuth } from '../context/AuthContext';

const PropertyChatbot = ({ unitId, hostId, unitName, onClose, isOpen: externalIsOpen = false }) => {
  const { user } = useAuth();
  const [isOpen, setIsOpen] = useState(externalIsOpen);
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [hostInfo, setHostInfo] = useState(null);
  const messagesEndRef = useRef(null);

  // Update internal state when external prop changes
  useEffect(() => {
    setIsOpen(externalIsOpen);
  }, [externalIsOpen]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const fetchHostInfo = useCallback(async () => {
    try {
      const response = await fetch(`http://localhost:5000/api/users/${hostId}`);
      const data = await response.json();
      if (data.success) {
        setHostInfo(data.user);
      }
    } catch (error) {
      console.error('Error fetching host info:', error);
    }
  }, [hostId]);

  const loadConversation = useCallback(async () => {
    if (!user) return;
    
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(
        `http://localhost:5000/api/messages/property/${unitId}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      const data = await response.json();
      
      if (data.success && data.messages.length > 0) {
        setMessages(data.messages.map(msg => ({
          type: msg.senderId === user.id ? 'user' : 'host',
          text: msg.message,
          timestamp: new Date(msg.createdAt),
          senderName: msg.senderName
        })));
      } else {
        // Welcome message with host-specific greeting and suggestions
        const welcomeMessage = {
          type: 'host',
          text: `Hi! I'm ${hostInfo?.firstName || 'the host'} of ${unitName}. Feel free to ask me any questions about the property!`,
          timestamp: new Date(),
          senderName: hostInfo?.firstName || 'Host',
          suggestions: [
            'What are the check-in/check-out times?',
            'Is parking available?',
            'What amenities are included?'
          ]
        };
        setMessages([welcomeMessage]);
      }
    } catch (error) {
      console.error('Error loading conversation:', error);
    }
  }, [user, unitId, unitName, hostInfo]);

  useEffect(() => {
    if (isOpen && user) {
      loadConversation();
      fetchHostInfo();
    }
  }, [isOpen, user, unitId, loadConversation, fetchHostInfo]);

  const handleSendMessage = async () => {
    if (!inputMessage.trim()) return;
    
    if (!user) {
      alert('Please login to chat with the host');
      return;
    }

    const userMessage = {
      type: 'user',
      text: inputMessage,
      timestamp: new Date(),
      senderName: user.name
    };

    setMessages(prev => [...prev, userMessage]);
    const currentMessage = inputMessage;
    setInputMessage('');
    setIsTyping(true);

    try {
      // First, try to get an automated response from the chatbot
      const chatbotResponse = await fetch('http://localhost:5000/api/chatbot/message', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          message: currentMessage,
          hostId: hostId,
          unitId: unitId
        })
      });

      const chatbotData = await chatbotResponse.json();

      if (chatbotData.success && chatbotData.response) {
        // Show automated response with suggestions
        setTimeout(() => {
          const botMessage = {
            type: 'host',
            text: chatbotData.response,
            timestamp: new Date(),
            senderName: hostInfo?.firstName || 'Host Assistant',
            suggestions: chatbotData.suggestions || []
          };
          setMessages(prev => [...prev, botMessage]);
          setIsTyping(false);
        }, 1000);
      } else {
        // Fallback to manual host response
        setTimeout(() => {
          const hostMessage = {
            type: 'host',
            text: 'Thank you for your message! I\'ll get back to you shortly.',
            timestamp: new Date(),
            senderName: hostInfo?.firstName || 'Host'
          };
          setMessages(prev => [...prev, hostMessage]);
          setIsTyping(false);
        }, 1000);
      }

      // Also send the message to the host for manual follow-up if needed
      const token = localStorage.getItem('token');
      await fetch('http://localhost:5000/api/messages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          receiverId: hostId,
          message: currentMessage,
          unitId: unitId
        })
      });

    } catch (error) {
      console.error('Error sending message:', error);
      setIsTyping(false);
      
      // Show fallback message
      setTimeout(() => {
        const hostMessage = {
          type: 'host',
          text: 'Thank you for your message! I\'ll get back to you shortly.',
          timestamp: new Date(),
          senderName: hostInfo?.firstName || 'Host'
        };
        setMessages(prev => [...prev, hostMessage]);
      }, 500);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleClose = () => {
    setIsOpen(false);
    // Notify that property chatbot is closed
    window.dispatchEvent(new CustomEvent('propertyChatbotClosed'));
    if (onClose) {
      onClose();
    }
  };

  // Notify when property chatbot opens
  useEffect(() => {
    if (isOpen) {
      window.dispatchEvent(new CustomEvent('propertyChatbotOpened'));
    }
  }, [isOpen]);

  const quickQuestions = [
    'Is the property available for my dates?',
    'What are the check-in/check-out times?',
    'Are pets allowed?',
    'Is there parking available?',
    'What amenities are included?'
  ];

  const handleQuickQuestion = (question) => {
    setInputMessage(question);
  };

  return (
    <>
      {/* Chat Button - Property Specific */}
      {!isOpen && !onClose && (
        <button
          onClick={() => setIsOpen(true)}
          className="fixed bottom-24 right-6 bg-green-600 text-white rounded-full p-4 shadow-lg hover:bg-green-700 transition-all z-40 flex items-center gap-2"
          title="Chat with host"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8h2a2 2 0 012 2v6a2 2 0 01-2 2h-2v4l-4-4H9a1.994 1.994 0 01-1.414-.586m0 0L11 14h4a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2v4l.586-.586z" />
          </svg>
          <span className="font-medium">Ask Host</span>
        </button>
      )}

      {/* Chat Window */}
      {isOpen && (
        <>
          {/* Backdrop */}
          <div 
            className="fixed inset-0 bg-black bg-opacity-25 z-40"
            onClick={handleClose}
          />
          
          {/* Modal */}
          <div className="fixed bottom-6 right-6 w-96 max-w-[calc(100vw-3rem)] h-[600px] max-h-[calc(100vh-3rem)] bg-white rounded-2xl shadow-2xl flex flex-col z-50 border border-gray-200"
               onClick={(e) => e.stopPropagation()}>
            {/* Header */}
            <div className="bg-gradient-to-r from-green-600 to-green-700 text-white p-4 rounded-t-2xl flex justify-between items-center">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                  </svg>
                </div>
                <div>
                  <h3 className="font-semibold">{hostInfo?.name || 'Property Host'}</h3>
                  <p className="text-xs text-green-100">{unitName}</p>
                </div>
              </div>
              <button
                onClick={handleClose}
                className="text-white hover:bg-white/20 rounded-full p-1 transition-colors"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
              {!user && (
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 text-sm text-yellow-800">
                  Please <button onClick={() => window.location.href = '/login'} className="underline font-semibold">login</button> to chat with the host
                </div>
              )}

              {messages.map((msg, index) => (
                <div key={index}>
                  <div className={`flex ${msg.type === 'user' ? 'justify-end' : 'justify-start'}`}>
                    <div
                      className={`max-w-[80%] rounded-2xl px-4 py-2 ${
                        msg.type === 'user'
                          ? 'bg-green-600 text-white rounded-br-none'
                          : 'bg-white text-gray-800 rounded-bl-none shadow-sm border border-gray-200'
                      }`}
                    >
                      {msg.type === 'host' && (
                        <p className="text-xs font-semibold mb-1 text-green-600">{msg.senderName}</p>
                      )}
                      <p className="text-sm">{msg.text}</p>
                      <p className={`text-xs mt-1 ${msg.type === 'user' ? 'text-green-100' : 'text-gray-400'}`}>
                        {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </p>
                    </div>
                  </div>
                  
                  {/* Show suggestions for AI responses */}
                  {msg.type === 'host' && msg.suggestions && msg.suggestions.length > 0 && (
                    <div className="flex flex-wrap gap-2 mt-2 ml-2">
                      {msg.suggestions.map((suggestion, idx) => (
                        <button
                          key={idx}
                          onClick={() => handleQuickQuestion(suggestion)}
                          className="text-xs bg-green-50 border border-green-200 text-green-700 px-3 py-2 rounded-full hover:bg-green-100 transition-colors shadow-sm"
                        >
                          {suggestion}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              ))}

              {isTyping && (
                <div className="flex justify-start">
                  <div className="bg-white rounded-2xl rounded-bl-none px-4 py-3 shadow-sm border border-gray-200">
                    <div className="flex gap-1">
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                    </div>
                  </div>
                </div>
              )}

              {/* Quick Questions - Only show initially if no recent AI suggestions */}
              {messages.length <= 1 && user && (
                <div className="space-y-2">
                  <p className="text-xs text-gray-500 text-center font-medium">Quick questions:</p>
                  {quickQuestions.map((question, idx) => (
                    <button
                      key={idx}
                      onClick={() => handleQuickQuestion(question)}
                      className="w-full text-left text-xs bg-white border border-gray-200 text-gray-700 px-3 py-3 rounded-lg hover:bg-green-50 hover:border-green-200 transition-colors shadow-sm"
                    >
                      {question}
                    </button>
                  ))}
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <div className="p-4 border-t border-gray-200 bg-white rounded-b-2xl">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder={user ? "Type your message..." : "Login to chat..."}
                  disabled={!user}
                  className="flex-1 px-4 py-3 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-green-500 text-sm disabled:bg-gray-100 disabled:text-gray-500"
                />
                <button
                  onClick={handleSendMessage}
                  disabled={!inputMessage.trim() || !user}
                  className="bg-green-600 text-white rounded-full p-3 hover:bg-green-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors min-w-[48px] flex items-center justify-center"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </>
      )}
    </>
  );
};

export default PropertyChatbot;