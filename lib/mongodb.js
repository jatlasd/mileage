import mongoose from 'mongoose';

let isConnected = false;

export const connectToDb = async () => {
  if (isConnected && mongoose.connection.readyState === 1) {
    console.log('Using existing database connection');
    return;
  }

  try {
    if (!process.env.MONGODB_URI) {
      throw new Error('MONGODB_URI is not defined in environment variables');
    }

    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    isConnected = true;
    console.log('Database connected successfully');
  } catch (error) {
    console.error('Error connecting to database:', error);
    isConnected = false;
    throw error;
  }
};

export default connectToDb;
