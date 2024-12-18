const mongoose = require('mongoose');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config();

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGOURL);
    console.log('✅ Database connected successfully');
  } catch (err) {
    console.error('❌ Database connection error:', err.message);
    process.exit(1); // Exit the process on connection failure
  }
};

module.exports = connectDB;
