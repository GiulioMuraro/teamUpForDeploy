const mongoose = require('mongoose')

const connectDB = async () => {
  try {
    console.log(process.env.DB_URL_LOCAL);

    await mongoose.connect(process.env.DB_URL_LOCAL, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      // Add other options if necessary
    });

    console.log('Mongoose connected to MongoDB');

    mongoose.connection.on('error', (err) => {
      console.error('Mongoose connection error:', err);
    });

    mongoose.connection.on('disconnected', () => {
      console.log('Mongoose disconnected from MongoDB');
    });
  } catch (error) {
    console.error('Mongoose connection error:', error.message);
    // Rethrow the error to propagate it to the calling code
    throw error;
  }
};

const closeDB = async () => {
  try {
    await mongoose.disconnect();
    console.log('Mongoose connection closed');
  } catch (error) {
    console.error('Error closing Mongoose connection:', error.message);
    // Rethrow the error to propagate it to the calling code
    throw error;
  }
};

module.exports = { connectDB, closeDB };