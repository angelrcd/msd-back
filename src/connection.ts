import mongoose from 'mongoose';
require('dotenv').config();

const MONGO_URL = process.env.MONGO_IP;

const startDatabase = async (): Promise<void> => {
  try {
    if (!MONGO_URL){
      throw new Error('Missing DB URL');
    } else {
      await mongoose.connect(MONGO_URL);
      console.log('Succesfully conected to database');
    }
  } catch (error){
    console.log('Error conecting to database: ' + error);
  }
};


export default startDatabase;
