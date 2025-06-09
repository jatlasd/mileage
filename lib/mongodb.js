import mongoose from 'mongoose';

let isConnected = false;

export const connectToDb = async () => {
  if (isConnected) {
    return;
  }

  try {
    await mongoose.connect(process.env.MONGODB_URI);
    isConnected = true;
  } catch (error) {
    console.error('Error connecting to database:', error);
    throw error;
  }
};

export default connectToDb;
