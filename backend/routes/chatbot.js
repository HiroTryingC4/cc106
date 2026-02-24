const express = require('express');
const router = express.Router();
const fs = require('fs');
const path = require('path');

// Handle chatbot messages
router.post('/message', async (req, res) => {
  try {
    const { message, hostId, unitId } = req.body;
    
    // Load chatbot data
    const chatbotData = JSON.parse(fs.readFileSync(path.join(__dirname, '../data/chatbot.json'), 'utf8'));
    
    let response = '';
    let suggestions = [];
    
    // Check if the message is asking about availability
    const availabilityKeywords = ['available', 'availability', 'dates', 'book', 'booking', 'free', 'open', 'calendar'];
    const isAvailabilityQuery = availabilityKeywords.some(keyword => 
      message.toLowerCase().includes(keyword)
    );
    
    // Check if asking about specific dates
    const datePattern = /(\d{1,2}[-\/]\d{1,2}[-\/]\d{2,4})|(\d{1,2}\s+(jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec)\w*)|((next|this)\s+(week|month|weekend))/i;
    const hasSpecificDates = datePattern.test(message);
    
    // If asking about availability, get real-time data
    if ((isAvailabilityQuery || hasSpecificDates) && unitId) {
      const availabilityInfo = await getUnitAvailability(unitId);
      response = generateAvailabilityResponse(availabilityInfo, message);
      suggestions = [
        'What are the check-in times?',
        'How do I make a booking?',
        'What is the minimum stay?'
      ];
    } else {
      // Check for host-specific FAQs first
      if (hostId && chatbotData.hostFaqs && chatbotData.hostFaqs[hostId]) {
        const hostFaqs = chatbotData.hostFaqs[hostId];
        const matchedFaq = findMatchingFaq(message, hostFaqs);
        
        if (matchedFaq) {
          response = matchedFaq.answer;
          // Generate smart follow-up suggestions based on the answered question
          suggestions = getSmartSuggestions(matchedFaq, hostFaqs);
        }
      }
      
      // If no host-specific match, check general FAQs
      if (!response) {
        const matchedFaq = findMatchingFaq(message, chatbotData.faqs);
        
        if (matchedFaq) {
          response = matchedFaq.answer;
          suggestions = chatbotData.faqs
            .filter(faq => faq.id !== matchedFaq.id)
            .slice(0, 3)
            .map(faq => faq.question);
        } else {
          // Use fallback response
          response = chatbotData.fallback[Math.floor(Math.random() * chatbotData.fallback.length)];
          
          // Suggest most popular questions based on context
          if (hostId && chatbotData.hostFaqs && chatbotData.hostFaqs[hostId]) {
            suggestions = getPopularQuestions(chatbotData.hostFaqs[hostId]);
          } else {
            suggestions = getPopularQuestions(chatbotData.faqs);
          }
        }
      }
    }

    res.json({
      success: true,
      response,
      suggestions
    });

  } catch (error) {
    console.error('Chatbot error:', error);
    res.status(500).json({
      success: false,
      response: "I'm sorry, I'm having trouble right now. Please try again later.",
      suggestions: []
    });
  }
});

// Helper function to get unit availability
async function getUnitAvailability(unitId) {
  try {
    const bookings = JSON.parse(fs.readFileSync(path.join(__dirname, '../data/bookings.json'), 'utf8'));
    const unitBookings = bookings.filter(b => 
      b.unitId === unitId && 
      (b.status === 'confirmed' || b.status === 'pending')
    );
    
    // Get current date and next 30 days
    const today = new Date();
    const next30Days = new Date();
    next30Days.setDate(today.getDate() + 30);
    
    // Get all booked dates in the next 30 days
    const bookedDates = [];
    unitBookings.forEach(booking => {
      const start = new Date(booking.checkIn);
      const end = new Date(booking.checkOut);
      
      // Only include bookings within the next 30 days
      if (start <= next30Days) {
        for (let date = new Date(start); date < end; date.setDate(date.getDate() + 1)) {
          if (date >= today && date <= next30Days) {
            bookedDates.push(date.toISOString().split('T')[0]);
          }
        }
      }
    });
    
    // Calculate available dates
    const totalDays = 30;
    const bookedDays = [...new Set(bookedDates)].length;
    const availableDays = totalDays - bookedDays;
    
    // Find next available periods
    const availablePeriods = [];
    let currentStart = null;
    
    for (let i = 0; i < 30; i++) {
      const checkDate = new Date(today);
      checkDate.setDate(today.getDate() + i);
      const dateStr = checkDate.toISOString().split('T')[0];
      
      if (!bookedDates.includes(dateStr)) {
        if (!currentStart) {
          currentStart = new Date(checkDate);
        }
      } else {
        if (currentStart) {
          const prevDate = new Date(checkDate);
          prevDate.setDate(checkDate.getDate() - 1);
          availablePeriods.push({
            start: currentStart,
            end: prevDate
          });
          currentStart = null;
        }
      }
    }
    
    // Handle case where availability extends to the end
    if (currentStart) {
      availablePeriods.push({
        start: currentStart,
        end: next30Days
      });
    }
    
    return {
      totalDays,
      bookedDays,
      availableDays,
      availablePeriods: availablePeriods.slice(0, 3), // Show first 3 periods
      nextAvailable: availablePeriods.length > 0 ? availablePeriods[0].start : null
    };
  } catch (error) {
    console.error('Error checking availability:', error);
    return null;
  }
}

// Helper function to generate availability response
function generateAvailabilityResponse(availabilityInfo, originalMessage = '') {
  if (!availabilityInfo) {
    return "I'm having trouble checking availability right now. Please check the calendar on the booking page or contact me directly.";
  }
  
  const { availableDays, totalDays, availablePeriods, nextAvailable } = availabilityInfo;
  
  // Check if asking about specific dates
  const hasSpecificDates = /(\d{1,2}[-\/]\d{1,2}[-\/]\d{2,4})|(\d{1,2}\s+(jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec)\w*)|((next|this)\s+(week|month|weekend))/i.test(originalMessage);
  
  if (hasSpecificDates) {
    let response = "I'd be happy to check those specific dates for you! ";
    if (availableDays > 0) {
      response += "I do have availability in the coming weeks. ";
    } else {
      response += "I'm quite busy in the next 30 days, but I might have openings. ";
    }
    response += "Please check the calendar below to see if your exact dates are free, or let me know your specific dates and I'll confirm availability for you!";
    return response;
  }
  
  if (availableDays === 0) {
    return "I'm currently fully booked for the next 30 days! 📅 However, I sometimes get cancellations, so feel free to message me with your specific dates and I'll let you know if anything opens up. You can also check back in a few days as my calendar updates frequently!";
  }
  
  if (availableDays === totalDays) {
    return `🎉 Great news! I'm completely available for the next 30 days. You can book any dates that work for you. Just select your preferred check-in and check-out dates on the calendar below!`;
  }
  
  let response = `📅 I have ${availableDays} out of ${totalDays} days available in the next month. `;
  
  if (nextAvailable) {
    const nextDate = nextAvailable.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric' 
    });
    response += `The next available period starts ${nextDate}. `;
  }
  
  if (availablePeriods.length > 0) {
    response += `\n\n✅ Available periods:\n`;
    availablePeriods.forEach((period, index) => {
      const startDate = period.start.toLocaleDateString('en-US', { 
        month: 'short', 
        day: 'numeric' 
      });
      const endDate = period.end.toLocaleDateString('en-US', { 
        month: 'short', 
        day: 'numeric' 
      });
      const days = Math.ceil((period.end - period.start) / (1000 * 60 * 60 * 24));
      response += `• ${startDate} - ${endDate} (${days} days)\n`;
    });
  }
  
  response += `\n📋 Check the calendar below for exact dates and to make your booking instantly!`;
  
  return response;
}
function getSmartSuggestions(answeredFaq, allFaqs) {
  const suggestions = [];
  
  // Define related question groups
  const questionGroups = {
    'checkin': ['h2', 'h7', 'h8'], // parking, keys, minimum stay
    'parking': ['h1', 'h9'], // check-in times, location
    'pets': ['h4', 'h6'], // amenities, cancellation
    'amenities': ['h2', 'h9', 'h10'], // parking, location, cleaning
    'availability': ['h1', 'h8'], // check-in, minimum stay
    'cancellation': ['h5', 'h8'], // availability, minimum stay
    'keys': ['h1', 'h2'], // check-in, parking
    'minimum': ['h6', 'h5'], // cancellation, availability
    'location': ['h2', 'h4'], // parking, amenities
    'cleaning': ['h4', 'h8'] // amenities, minimum stay
  };
  
  // Find related questions based on the answered FAQ
  const answeredId = answeredFaq.id;
  for (const [category, relatedIds] of Object.entries(questionGroups)) {
    if (relatedIds.includes(answeredId)) {
      // Add other questions from the same category
      relatedIds.forEach(id => {
        if (id !== answeredId) {
          const relatedFaq = allFaqs.find(faq => faq.id === id);
          if (relatedFaq && suggestions.length < 3) {
            suggestions.push(relatedFaq.question);
          }
        }
      });
      break;
    }
  }
  
  // If we don't have enough suggestions, add popular ones
  if (suggestions.length < 3) {
    const popular = getPopularQuestions(allFaqs);
    popular.forEach(q => {
      if (suggestions.length < 3 && !suggestions.includes(q)) {
        suggestions.push(q);
      }
    });
  }
  
  return suggestions;
}

// Helper function to get popular questions
function getPopularQuestions(faqs) {
  // Return most commonly asked questions
  const popularOrder = ['h1', 'h2', 'h3', 'h4', 'h5']; // check-in, parking, pets, amenities, availability
  
  const popular = [];
  popularOrder.forEach(id => {
    const faq = faqs.find(f => f.id === id);
    if (faq && popular.length < 3) {
      popular.push(faq.question);
    }
  });
  
  // If not enough, add any remaining questions
  if (popular.length < 3) {
    faqs.slice(0, 3).forEach(faq => {
      if (popular.length < 3 && !popular.includes(faq.question)) {
        popular.push(faq.question);
      }
    });
  }
  
  return popular;
}
function findMatchingFaq(message, faqs) {
  const messageLower = message.toLowerCase();
  
  // First, try exact keyword matches
  for (const faq of faqs) {
    for (const keyword of faq.keywords) {
      if (messageLower.includes(keyword.toLowerCase())) {
        return faq;
      }
    }
  }
  
  // Then try partial matches in questions
  for (const faq of faqs) {
    const questionWords = faq.question.toLowerCase().split(' ');
    const messageWords = messageLower.split(' ');
    
    const matchCount = questionWords.filter(word => 
      messageWords.some(msgWord => msgWord.includes(word) || word.includes(msgWord))
    ).length;
    
    if (matchCount >= 2) {
      return faq;
    }
  }
  
  return null;
}

module.exports = router;