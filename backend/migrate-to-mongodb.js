const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');

// IMPORTANT: Replace this with your MongoDB Atlas connection string
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/smartstay?retryWrites=true&w=majority';

// Define flexible schema for all collections
const flexibleSchema = new mongoose.Schema({}, { strict: false, timestamps: true });

async function migrate() {
  try {
    console.log('🔄 Starting migration to MongoDB...\n');
    
    await mongoose.connect(MONGODB_URI);
    console.log('✅ Connected to MongoDB\n');

    const dataFiles = [
      'users.json',
      'units.json',
      'bookings.json',
      'reviews.json',
      'messages.json',
      'expenses.json',
      'payroll.json',
      'employees.json',
      'disputes.json',
      'chatbot.json',
      'browsing_history.json',
      'host_verifications.json',
      'unit_conditions.json',
      'logs.json',
      'security_logs.json',
      'chatbot_logs.json',
      'chatbot_analytics.json',
      'settings.json'
    ];

    let totalRecords = 0;

    for (const file of dataFiles) {
      const filePath = path.join(__dirname, 'data', file);
      
      if (fs.existsSync(filePath)) {
        const collectionName = file.replace('.json', '');
        const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));
        
        // Create or get model
        const Model = mongoose.models[collectionName] || mongoose.model(collectionName, flexibleSchema);
        
        // Clear existing data
        await Model.deleteMany({});
        
        // Insert new data
        if (Array.isArray(data) && data.length > 0) {
          await Model.insertMany(data);
          console.log(`✅ ${collectionName.padEnd(25)} → ${data.length} records`);
          totalRecords += data.length;
        } else {
          console.log(`⚠️  ${collectionName.padEnd(25)} → No data found`);
        }
      } else {
        console.log(`❌ ${file.padEnd(25)} → File not found`);
      }
    }

    console.log(`\n🎉 Migration completed! Total records: ${totalRecords}`);
    console.log('📊 Database: smartstay');
    console.log('🌐 Ready for production deployment!\n');
    
    await mongoose.connection.close();
    process.exit(0);
  } catch (error) {
    console.error('❌ Migration failed:', error.message);
    console.error(error);
    process.exit(1);
  }
}

// Run migration
migrate();
