import { throwMissingEnvironmentVariable } from '@/errors/missing-environment-variable';
import mongoose from 'mongoose';

import dotenv from 'dotenv';
dotenv.config();

export const connectWithMongoDb = async () => {
  try {
    if (!process.env.MONGO_URI) throwMissingEnvironmentVariable('MONGO_URI');
    await mongoose.connect(process.env.MONGO_URI!);

    console.log('The mongoDB connection is successfully established! 🔥');
  } catch (error) {
    console.error('MongoDB connection error', error);
    process.exit(1);
  }
};
