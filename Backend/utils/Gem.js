// utils/getGeminiAPIResponse.js
import 'dotenv/config'; // Automatically load environment variables from .env file

// Import the necessary Google AI class
import { GoogleGenerativeAI } from "@google/generative-ai";

// Get the API key from environment variables
const apiKey = process.env.API_KEY;

// Check if the API key exists
if (!apiKey) {
  throw new Error("API_KEY not found. Please add it to your .env file.");
}

// Initialize the GoogleGenerativeAI instance with the API key
const genAI = new GoogleGenerativeAI(apiKey);

/**
 * Gets a response from the Gemini API for a given text prompt.
 * @param {string} prompt - The text prompt to send to the model.
 * @returns {Promise<string>} The text response from the API.
 */
async function getGeminiAPIResponse(prompt) {
  // Select the generative model (e.g., 'gemini-1.5-flash')
  const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

  try {
    // Generate content based on the prompt
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    return text;
  } catch (error) {
    // Log any errors that occur during the API call
    console.error("Error fetching Gemini API response:", error);
    return "Sorry, I couldn't get a response. Please try again.";
  }
}

// Export the function to be used in other parts of your application
export default getGeminiAPIResponse;