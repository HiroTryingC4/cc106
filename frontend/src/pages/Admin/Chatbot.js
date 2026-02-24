import React, { useState, useEffect } from 'react';
import DashboardLayout from '../../components/DashboardLayout';
import Card from '../../components/Card';
import Button from '../../components/Button';
import Input from '../../components/Input';
import Modal from '../../components/Modal';
import { useToast } from '../../components/Toast';

const Chatbot = () => {
  const { addToast } = useToast();
  const [config, setConfig] = useState(null);
  const [faqs, setFaqs] = useState([]);
  const [responses, setResponses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showFaqModal, setShowFaqModal] = useState(false);
  const [showResponseModal, setShowResponseModal] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [formData, setFormData] = useState({
    question: '',
    answer: '',
    category: 'general'
  });

  useEffect(() => {
    fetchChatbotData();
  }, []);

  const fetchChatbotData = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:5000/api/admin/chatbot/config', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await response.json();
      if (data.success) {
        setConfig(data.config);
        setFaqs(data.faqs || []);
        setResponses(data.responses || []);
      }
    } catch (error) {
      console.error('Error fetching chatbot data:', error);
      // Load sample data
      loadSampleData();
    } finally {
      setLoading(false);
    }
  };

  const loadSampleData = () => {
    setConfig({
      enabled: true,
      welcomeMessage: 'Hello! How can I help you today?',
      fallbackMessage: "I'm sorry, I don't understand. Can you rephrase that?",
      responseDelay: 1000
    });

    setFaqs([
      {
        id: '1',
        question: 'What are your check-in times?',
        answer: 'Check-in is typically from 3:00 PM onwards. Early check-in may be available upon request.',
        category: 'booking'
      },
      {
        id: '2',
        question: 'How do I make a payment?',
        answer: 'You can make payments through our secure payment gateway using credit card, debit card, or bank transfer.',
        category: 'payment'
      },
      {
        id: '3',
        question: 'What is your cancellation policy?',
        answer: 'Free cancellation up to 48 hours before check-in. Cancellations within 48 hours are subject to a fee.',
        category: 'booking'
      },
      {
        id: '4',
        question: 'Are pets allowed?',
        answer: 'Pet policies vary by property. Please check the specific property listing for pet information.',
        category: 'general'
      }
    ]);

    setResponses([
      {
        id: '1',
        trigger: 'hello|hi|hey',
        response: 'Hello! Welcome to Smart Stay. How can I assist you today?',
        type: 'greeting'
      },
      {
        id: '2',
        trigger: 'book|booking|reserve',
        response: 'I can help you with bookings! Would you like to search for available properties or check an existing booking?',
        type: 'booking'
      },
      {
        id: '3',
        trigger: 'payment|pay|price',
        response: 'For payment inquiries, I can help you understand our payment methods and pricing. What would you like to know?',
        type: 'payment'
      }
    ]);
  };

  const handleSaveConfig = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:5000/api/admin/chatbot/config', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(config)
      });

      const data = await response.json();
      if (data.success) {
        addToast('Chatbot configuration updated', 'success');
      } else {
        addToast(data.message || 'Failed to update configuration', 'error');
      }
    } catch (error) {
      addToast('Error updating configuration', 'error');
    }
  };

  const handleAddFaq = () => {
    setEditingItem(null);
    setFormData({ question: '', answer: '', category: 'general' });
    setShowFaqModal(true);
  };

  const handleEditFaq = (faq) => {
    setEditingItem(faq);
    setFormData({ question: faq.question, answer: faq.answer, category: faq.category });
    setShowFaqModal(true);
  };

  const handleSaveFaq = () => {
    if (editingItem) {
      setFaqs(faqs.map(f => f.id === editingItem.id ? { ...editingItem, ...formData } : f));
      addToast('FAQ updated', 'success');
    } else {
      const newFaq = {
        id: String(faqs.length + 1),
        ...formData
      };
      setFaqs([...faqs, newFaq]);
      addToast('FAQ added', 'success');
    }
    setShowFaqModal(false);
  };

  const handleDeleteFaq = (id) => {
    if (window.confirm('Are you sure you want to delete this FAQ?')) {
      setFaqs(faqs.filter(f => f.id !== id));
      addToast('FAQ deleted', 'success');
    }
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
        <h1 className="text-3xl font-bold text-gray-900">Chatbot Management</h1>
        <p className="text-gray-600 mt-2">Manage the main website chatbot assistant</p>
      </div>

      {/* Configuration */}
      <Card className="mb-6">
        <h2 className="text-xl font-semibold mb-4">Chatbot Configuration</h2>
        <div className="space-y-4">
          <div className="flex items-center gap-4">
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={config?.enabled}
                onChange={(e) => setConfig({ ...config, enabled: e.target.checked })}
                className="mr-2"
              />
              <span className="text-sm font-medium">Enable Chatbot</span>
            </label>
          </div>

          <Input
            label="Welcome Message"
            value={config?.welcomeMessage || ''}
            onChange={(e) => setConfig({ ...config, welcomeMessage: e.target.value })}
          />

          <Input
            label="Fallback Message"
            value={config?.fallbackMessage || ''}
            onChange={(e) => setConfig({ ...config, fallbackMessage: e.target.value })}
          />

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Response Delay (ms)
            </label>
            <input
              type="number"
              value={config?.responseDelay || 1000}
              onChange={(e) => setConfig({ ...config, responseDelay: parseInt(e.target.value) })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <Button onClick={handleSaveConfig}>Save Configuration</Button>
        </div>
      </Card>

      {/* FAQs Management */}
      <Card className="mb-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Frequently Asked Questions</h2>
          <Button onClick={handleAddFaq}>Add FAQ</Button>
        </div>

        <div className="space-y-3">
          {faqs.map(faq => (
            <div key={faq.id} className="border border-gray-200 rounded-lg p-4">
              <div className="flex justify-between items-start mb-2">
                <div className="flex-1">
                  <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                    {faq.category}
                  </span>
                  <h3 className="font-semibold mt-2">{faq.question}</h3>
                  <p className="text-sm text-gray-600 mt-1">{faq.answer}</p>
                </div>
                <div className="flex gap-2 ml-4">
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
            </div>
          ))}
        </div>
      </Card>

      {/* Automated Responses */}
      <Card>
        <h2 className="text-xl font-semibold mb-4">Automated Responses</h2>
        <div className="space-y-3">
          {responses.map(response => (
            <div key={response.id} className="border border-gray-200 rounded-lg p-4">
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">
                    {response.type}
                  </span>
                  <p className="text-sm text-gray-600 mt-2">
                    <strong>Trigger:</strong> {response.trigger}
                  </p>
                  <p className="text-sm text-gray-800 mt-1">
                    <strong>Response:</strong> {response.response}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* FAQ Modal */}
      <Modal
        isOpen={showFaqModal}
        onClose={() => setShowFaqModal(false)}
        title={editingItem ? 'Edit FAQ' : 'Add FAQ'}
      >
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
            <select
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            >
              <option value="general">General</option>
              <option value="booking">Booking</option>
              <option value="payment">Payment</option>
              <option value="property">Property</option>
              <option value="support">Support</option>
            </select>
          </div>

          <Input
            label="Question"
            value={formData.question}
            onChange={(e) => setFormData({ ...formData, question: e.target.value })}
            required
          />

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Answer</label>
            <textarea
              value={formData.answer}
              onChange={(e) => setFormData({ ...formData, answer: e.target.value })}
              rows="4"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <div className="flex gap-3 justify-end pt-4">
            <Button variant="secondary" onClick={() => setShowFaqModal(false)}>
              Cancel
            </Button>
            <Button onClick={handleSaveFaq}>
              {editingItem ? 'Update' : 'Add'} FAQ
            </Button>
          </div>
        </div>
      </Modal>
    </DashboardLayout>
  );
};

export default Chatbot;
