const path = require('path');
const dotenv = require('dotenv');

// Set environment variables
process.env.NODE_ENV = 'development';

// Load environment variables from .env file
const envPath = path.join(__dirname, '.env');
const result = dotenv.config({ path: envPath });

if (result.error) {
  console.error('Error loading .env file:', result.error);
  process.exit(1);
}

console.log('Environment variables loaded from:', envPath);
console.log('Environment check:', {
  GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID ? 'Set' : 'Not Set',
  GOOGLE_REDIRECT_URI: process.env.GOOGLE_REDIRECT_URI,
  NODE_ENV: process.env.NODE_ENV,
  SERVER_PORT: process.env.SERVER_PORT
});

// Load the main server file
require('./index.js'); 