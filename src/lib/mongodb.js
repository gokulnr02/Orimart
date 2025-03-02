import mongoose from 'mongoose';

const mongoDB_URI = 'mongodb://127.0.0.1:27017/orimart';

let isConnected = false;

export async function MongodbConnection() {
  if (isConnected) {
    return;
  }

  try {
    await mongoose.connect(mongoDB_URI, {
      serverSelectionTimeoutMS: 30000, 
    });
    isConnected = true;
    console.log("DB CONNECTED Successfully");
  } catch (error) {
    console.error("Error connecting to the database", error);
    throw error;
  }
}
