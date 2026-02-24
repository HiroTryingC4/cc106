import React, { useState, useEffect } from 'react';
import DashboardLayout from '../../components/DashboardLayout';
import Card from '../../components/Card';
import Button from '../../components/Button';
import Input from '../../components/Input';
import Modal from '../../components/Modal';
import { useToast } from '../../components/Toast';

const ChatbotManage = () => {
  const { addToast } = useToast();
  const [config, setConfig] = useState(null);
  const [conversations, setConversations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingFaq, setEditingFaq] = useState(null);
  const [faqForm, setFaqForm] = useState({
    question: '',
    answer: '',
    keywords: ''
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const token = localStorage.getItem('token');
      
      const [configRes, conversationsRes] = await Promise.all([
        fetch('http://localhost:5000/api/host/chatbot/config', {
          headers: { 'Authorization': `Bearer ${token}` }
        }),
        fetch('http://localhost:5000/api/host/chatbot/conversations', {
          headers: { 'Authorization': `Bearer ${token}` }
        })
      ]);

      const [configData, conversationsData] = await Promise.all([
        configRes.json(),
        conversationsRes.json()
      ]);

      if (configData.success) setConfig(configData.config);
      if (conversationsData.success) setConversations(conversationsData.conversations);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveFaq = () => {
    if (!faqForm.question || !faqForm.answer) {
      addToast('Please fill in all fields', 'error');
      return;
    }

    const keywords = faqForm.keywords.split(',').map(k => k.trim());
    const newFaq = {
      id: editingFaq ? editingFaq.id : String(config.faqs.length + 1),
      question: faqForm.question,
      answer: faqForm.answer,
      keywords
    };

    let updatedFaqs;
    if (editingFaq) {
      updatedFaqs = config.faqs.map(f => f.id === editingFaq.id ? newFaq : f);
    } else {
      updatedFaqs = [...config.faqs, newFaq];
    }

    handleUpdateResponses(updatedFaqs);
  };

  const handleUpdateResponses = async (faqs) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:5000/api/host/chatbot/responses', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ faqs })
      });

      const data = await response.json();
      
      if (data.success) {
        addToast('Responses updated successfully', 'success');
        setConfig({ ...config, faqs });
        setShowModal(false);
        setEditingFaq(null);
        setFaqForm({ question: '', answer: '', keywords: '' });
      } else {
        addToast(data.message || 'Failed to update responses', 'error');
      }
    } catch (error) {
      addToast('Error updating responses', 'error');
    }
  };

  const handleEditFaq = (faq) => {
    setEditingFaq(faq);
    setFaqForm({
      question: faq.question,
      answer: faq.answer,
      keywords: faq.keywords.join(', ')
    });
    setShowModal(true);
  };

  const handleDeleteFaq = (faqId) => {
    if (!window.confirm('Are you sure you want to delete this FAQ?')) return;
    
    const updatedFaqs = config.faqs.filter(f => f.id !== faqId);
    handleUpdateResponses(updatedFaqs);
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
      <div className="mb-6 flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Chatbot Management</h1>
          <p className="text-gray-600 mt-2">Manage chatbot responses and view conversations</p>
        </div>
        <Button onClick={() => {
          setEditingFaq(null);
          setFaqForm({ question: '', answer: '', keywords: '' });
          setShowModal(true);
        }}>
          Add New FAQ
        </Button>
      </div>

      {/* FAQs */}
      <Card className="mb-8">
        <h2 className="text-xl font-semibold mb-4">FAQ Responses</h2>
        <div className="space-y-3">
          {config?.faqs.map(faq => (
            <div key={faq.id} className="border border-gray-200 rounded-lg p-4">
              <div className="flex justify-between items-start mb-2">
                <h3 className="font-semibold text-gray-900">{faq.question}</h3>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleEditFaq(faq)}
                    className="text-blue-600 hover:text-blue-800 text-sm"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDeleteFaq(faq.id)}
                    className="text-red-600 hover:text-red-800 text-sm"
                  >
                    Delete
                  </button>
                </div>
              </div>
              <p className="text-gray-600 text-sm mb-2">{faq.answer}</p>
              <div className="flex flex-wrap gap-1">
                {faq.keywords.map((keyword, idx) => (
                  <span key={idx} className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
                    {keyword}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* Conversations */}
      <Card>
        <h2 className="text-xl font-semibold mb-4">Recent Conversations</h2>
        {conversations.length === 0 ? (
          <p className="text-gray-500 text-center py-8">No conversations yet</p>
        ) : (
          <div className="space-y-4">
            {conversations.slice(0, 10).map(conv => (
              <div key={conv.id} className="border border-gray-200 rounded-lg p-4">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-medium text-gray-700">User ID: {conv.userId}</span>
                  <span className="text-xs text-gray-500">
                    {new Date(conv.createdAt).toLocaleString()}
                  </span>
                </div>
                <div className="text-sm text-gray-600">
                  {conv.messages.length} messages
                </div>
              </div>
            ))}
          </div>
        )}
      </Card>

      {/* FAQ Modal */}
      <Modal
        isOpen={showModal}
        onClose={() => {
          setShowModal(false);
          setEditingFaq(null);
        }}
        title={editingFaq ? 'Edit FAQ' : 'Add New FAQ'}
      >
        <div className="space-y-4">
          <Input
            label="Question"
            value={faqForm.question}
            onChange={(e) => setFaqForm({ ...faqForm, question: e.target.value })}
            placeholder="e.g., How do I book a unit?"
            required
          />
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Answer</label>
            <textarea
              value={faqForm.answer}
              onChange={(e) => setFaqForm({ ...faqForm, answer: e.target.value })}
              rows="4"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Enter the answer..."
              required
            />
          </div>
          
          <Input
            label="Keywords (comma-separated)"
            value={faqForm.keywords}
            onChange={(e) => setFaqForm({ ...faqForm, keywords: e.target.value })}
            placeholder="e.g., book, booking, reserve"
            required
          />
          
          <div className="flex gap-3 justify-end pt-4">
            <Button
              variant="secondary"
              onClick={() => {
                setShowModal(false);
                setEditingFaq(null);
              }}
            >
              Cancel
            </Button>
            <Button onClick={handleSaveFaq}>
              {editingFaq ? 'Update FAQ' : 'Add FAQ'}
            </Button>
          </div>
        </div>
      </Modal>
    </DashboardLayout>
  );
};

export default ChatbotManage;
