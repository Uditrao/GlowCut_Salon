const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/glowcut');
    console.log(`[Database] MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`[Database] Error: ${error.message}`);
    // Don't exit hard in dev so application structural tests can continue gracefully
  }
};

module.exports = connectDB;
