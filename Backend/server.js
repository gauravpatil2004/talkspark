// server.js

// 1. Load Environment Variables
import 'dotenv/config';
import express from 'express';
import mongoose from 'mongoose';
import { GoogleGenerativeAI } from '@google/generative-ai';
import chatRoutes from './routes/chat.js';
import cors from 'cors';

// 2. Initialize App and Constants
const app = express();
const PORT = process.env.PORT || 3000;
const MONGO_URI = process.env.MONGO_URI;
const API_KEY = process.env.API_KEY;

// 3. Middleware
// Add CORS middleware FIRST
app.use(cors({
    origin: 'http://localhost:5173', // Your frontend URL
    credentials: true
}));

// This allows your server to understand and process JSON data sent in requests
app.use(express.json());

app.use("/api", chatRoutes);

// 4. Validate Environment Variables
if (!MONGO_URI) {
  throw new Error('MONGO_URI is not defined in the .env file.');
}
if (!API_KEY) {
  throw new Error('API_KEY is not defined in the .env file.');
}

// 5. Connect to MongoDB
mongoose.connect(MONGO_URI)
  .then(() => {
    console.log('✅ Successfully connected to MongoDB Atlas!');
  })
  .catch((error) => {
    console.error('❌ Error connecting to MongoDB:', error.message);
    // Exit the process with failure
    process.exit(1);
  });

// 6. Initialize Gemini AI Model
const genAI = new GoogleGenerativeAI(API_KEY);
const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

// 7. Start the Server
app.listen(PORT, () => {
  console.log(`🚀 Server is running on http://localhost:${PORT}`);
});