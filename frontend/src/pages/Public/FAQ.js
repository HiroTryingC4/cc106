import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Layout from '../../components/Layout';

const FAQ = () => {
  const [openIndex, setOpenIndex] = useState(null);

  const toggleFAQ = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  const faqCategories = [
    {
      category: 'General',
      questions: [
        {
          question: 'What is SmartStay Analytics?',
          answer: 'SmartStay Analytics is an AI-driven web-based platform for intelligent Airbnb-style booking and host financial management. We provide smart recommendations, automated chatbot support, and comprehensive analytics for both guests and hosts.'
        },
        {
          question: 'How do I create an account?',
          answer: 'Click the "Sign Up" button in the navigation bar, choose your account type (Guest or Host), and fill in your details. Guests can start booking immediately, while hosts need to complete verification before listing properties.'
        },
        {
          question: 'Is SmartStay free to use?',
          answer: 'Creating an account and browsing properties is completely free. Guests pay only for their bookings, and hosts pay a small service fee on completed reservations.'
        },
        {
          question: 'What makes SmartStay different from other booking platforms?',
          answer: 'SmartStay uses AI-powered recommendations based on your preferences and browsing history, provides intelligent chatbot assistance, and offers hosts comprehensive financial analytics including expense tracking, payroll management, and profit analysis.'
        }
      ]
    },
    {
      category: 'For Guests',
      questions: [
        {
          question: 'How do I book a property?',
          answer: 'Browse available units, select your desired property, choose your check-in and check-out dates, and click "Book Now". You\'ll be guided through the payment process to confirm your reservation.'
        },
        {
          question: 'Can I browse properties without an account?',
          answer: 'Yes! You can browse all properties and view recommendations without logging in. However, you\'ll need to create an account to make a booking.'
        },
        {
          question: 'How does the AI recommendation system work?',
          answer: 'Our AI analyzes your browsing history, saved preferences, and booking patterns to suggest properties that match your interests. The more you use SmartStay, the better the recommendations become.'
        },
        {
          question: 'Can I cancel or modify my booking?',
          answer: 'Yes, you can view and manage your bookings from your dashboard. Cancellation policies vary by property, so check the specific terms before booking.'
        },
        {
          question: 'How do I leave a review?',
          answer: 'After your stay is completed, go to "My Bookings", select the booking, and click "Write Review". You can rate the property (1-5 stars), write comments, and upload up to 5 photos.'
        },
        {
          question: 'What payment methods are accepted?',
          answer: 'We accept major credit cards, debit cards, and digital payment methods. All transactions are processed securely through our encrypted payment system.'
        }
      ]
    },
    {
      category: 'For Hosts',
      questions: [
        {
          question: 'How do I become a host?',
          answer: 'Register as a host, complete the verification process by submitting required documents (ID, property ownership proof, tax documents), and wait for admin approval. Once verified, you can start listing properties.'
        },
        {
          question: 'What is the verification process?',
          answer: 'Hosts must submit identification documents, proof of property ownership, and tax information. Our admin team reviews submissions within 2-3 business days. You\'ll be notified via email once approved.'
        },
        {
          question: 'How do I list a property?',
          answer: 'After verification, go to "My Units" in your dashboard, click "Add New Unit", and fill in property details including photos, amenities, pricing, and availability. Your listing goes live immediately after submission.'
        },
        {
          question: 'How does the financial dashboard work?',
          answer: 'The financial dashboard provides real-time insights into your gross income, expenses, staff salaries, and net profit. You can track bookings, manage expenses, handle payroll, and generate detailed financial reports.'
        },
        {
          question: 'Can I track expenses and payroll?',
          answer: 'Yes! SmartStay includes comprehensive expense tracking (maintenance, utilities, supplies, etc.) and payroll management for your staff. All expenses are automatically factored into your profit calculations.'
        },
        {
          question: 'How do I get paid?',
          answer: 'Payments are processed automatically after guest check-in. Funds are transferred to your registered bank account within 3-5 business days, minus the service fee.'
        },
        {
          question: 'What is the AI chatbot for hosts?',
          answer: 'The AI chatbot helps you manage guest inquiries automatically. You can customize responses, set up templates, and let the chatbot handle common questions 24/7.'
        },
        {
          question: 'Can I see analytics for my properties?',
          answer: 'Yes! Access detailed analytics including booking trends, occupancy rates, revenue per property, guest demographics, and performance comparisons across your listings.'
        }
      ]
    },
    {
      category: 'Bookings & Payments',
      questions: [
        {
          question: 'When will I be charged for my booking?',
          answer: 'Payment is processed immediately upon booking confirmation. You\'ll receive a confirmation email with your receipt and booking details.'
        },
        {
          question: 'What is the cancellation policy?',
          answer: 'Cancellation policies vary by property. Most hosts offer flexible, moderate, or strict cancellation options. Check the specific policy on the property page before booking.'
        },
        {
          question: 'Can I get a refund?',
          answer: 'Refunds depend on the property\'s cancellation policy and when you cancel. Early cancellations typically receive full or partial refunds, while last-minute cancellations may not be eligible.'
        },
        {
          question: 'Is my payment information secure?',
          answer: 'Absolutely. We use industry-standard encryption and secure payment gateways. Your financial information is never stored on our servers and is processed through PCI-compliant payment processors.'
        },
        {
          question: 'What happens if there\'s a dispute?',
          answer: 'Contact our support team immediately. We have a dispute resolution process that reviews evidence from both parties and works toward a fair solution.'
        }
      ]
    },
    {
      category: 'Technical Support',
      questions: [
        {
          question: 'I forgot my password. How do I reset it?',
          answer: 'Click "Forgot Password" on the login page, enter your email address, and follow the instructions sent to your email to create a new password.'
        },
        {
          question: 'The website is not loading properly. What should I do?',
          answer: 'Try clearing your browser cache, using a different browser, or checking your internet connection. If issues persist, contact our support team.'
        },
        {
          question: 'How do I update my profile information?',
          answer: 'Log in to your account, go to your profile/dashboard, and click "Edit Profile" to update your personal information, contact details, and preferences.'
        },
        {
          question: 'Can I use SmartStay on mobile devices?',
          answer: 'Yes! SmartStay is fully responsive and works seamlessly on smartphones and tablets. Simply access the website through your mobile browser.'
        },
        {
          question: 'How do I contact customer support?',
          answer: 'Use the chatbot widget in the bottom-right corner for instant assistance, or send us a message through the "Messages" section in your dashboard. We typically respond within 24 hours.'
        }
      ]
    },
    {
      category: 'Privacy & Security',
      questions: [
        {
          question: 'How is my personal data protected?',
          answer: 'We use advanced encryption, secure servers, and follow strict data protection regulations. Your personal information is never shared with third parties without your consent.'
        },
        {
          question: 'Can I delete my account?',
          answer: 'Yes, you can request account deletion by contacting our support team. Note that some information may be retained for legal and accounting purposes.'
        },
        {
          question: 'Who can see my booking history?',
          answer: 'Your booking history is private and visible only to you and the hosts of properties you\'ve booked. Admins can access this information for support and dispute resolution purposes only.'
        },
        {
          question: 'How do you prevent fraud?',
          answer: 'We employ AI-powered fraud detection, secure payment processing, identity verification for hosts, and continuous monitoring of suspicious activities to keep our platform safe.'
        }
      ]
    }
  ];

  return (
    <Layout>
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              Frequently Asked Questions
            </h1>
            <p className="text-lg text-gray-600">
              Find answers to common questions about SmartStay Analytics
            </p>
          </div>

          {/* FAQ Categories */}
          <div className="space-y-8">
            {faqCategories.map((category, categoryIndex) => (
              <div key={categoryIndex} className="bg-white rounded-lg shadow-md p-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-4 border-b pb-2">
                  {category.category}
                </h2>
                <div className="space-y-3">
                  {category.questions.map((faq, faqIndex) => {
                    const globalIndex = `${categoryIndex}-${faqIndex}`;
                    const isOpen = openIndex === globalIndex;

                    return (
                      <div
                        key={faqIndex}
                        className="border border-gray-200 rounded-lg overflow-hidden"
                      >
                        <button
                          onClick={() => toggleFAQ(globalIndex)}
                          className="w-full flex items-center justify-between p-4 text-left hover:bg-gray-50 transition"
                        >
                          <span className="font-semibold text-gray-900 pr-4">
                            {faq.question}
                          </span>
                          {isOpen ? (
                            <svg className="h-5 w-5 text-gray-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                            </svg>
                          ) : (
                            <svg className="h-5 w-5 text-gray-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                            </svg>
                          )}
                        </button>
                        {isOpen && (
                          <div className="px-4 pb-4 text-gray-600 bg-gray-50">
                            {faq.answer}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>

          {/* Contact Section */}
          <div className="mt-12 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg shadow-lg p-8 text-center text-white">
            <h2 className="text-2xl font-bold mb-4">Still have questions?</h2>
            <p className="text-lg mb-6">
              Our support team is here to help you 24/7
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/login"
                className="bg-white text-blue-600 px-6 py-3 rounded-lg font-semibold hover:bg-gray-100 transition"
              >
                Contact Support
              </Link>
              <Link
                to="/units"
                className="bg-transparent border-2 border-white text-white px-6 py-3 rounded-lg font-semibold hover:bg-white hover:text-blue-600 transition"
              >
                Browse Properties
              </Link>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default FAQ;
