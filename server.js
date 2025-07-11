import express from 'express';
import fetch from 'node-fetch';
import cors from 'cors';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

// Initialize environment variables
dotenv.config();

// Get current directory
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.static('.')); // Serve static files from current directory

// Proxy for REST Countries API
app.get('/api/country', async (req, res) => {
  const { name } = req.query;
  if (!name) return res.status(400).json({ error: 'Country name is required' });
  
  try {
    // Try exact name match first
    console.log(`Fetching country data for: ${name}`);
    let response = await fetch(`https://restcountries.com/v3.1/name/${encodeURIComponent(name)}?fullText=true`);
    
    // If exact match fails, try partial match
    if (!response.ok) {
      console.log(`Exact match failed for ${name}, trying partial match`);
      response = await fetch(`https://restcountries.com/v3.1/name/${encodeURIComponent(name)}`);
    }
    
    if (!response.ok) {
      // If still fails, try alternative API endpoint with alpha code (if name looks like a code)
      if (name.length <= 3) {
        console.log(`Trying alpha code lookup for ${name}`);
        response = await fetch(`https://restcountries.com/v3.1/alpha/${encodeURIComponent(name)}`);
      }
      
      // If all attempts fail
      if (!response.ok) {
        const errorStatus = response.status;
        console.error(`All country API attempts failed with status: ${errorStatus}`);
        throw new Error(`Country API responded with status: ${errorStatus}`);
      }
    }
    
    const data = await response.json();
    console.log(`Successfully fetched data for ${name}`);
    res.json(data);
  } catch (err) {
    console.error('Country API error:', err.message);
    res.status(500).json({ error: `Failed to fetch country data: ${err.message}` });
  }
});

// Local time calculation - always returns IST time
app.get('/api/time', async (req, res) => {
  const { timezone } = req.query;
  
  try {
    // Always return IST time (UTC+5:30) regardless of the country's timezone
    const now = new Date();
    const utcTime = now.getTime() + (now.getTimezoneOffset() * 60000);
    
    // IST is UTC+5:30 (5 hours and 30 minutes ahead of UTC)
    const istOffset = 5.5; // 5 hours and 30 minutes
    const istTime = new Date(utcTime + (3600000 * istOffset));
    
    // Format the date in a readable format
    const formattedTime = istTime.toISOString();
    
    res.json({
      datetime: formattedTime,
      timezone: "UTC+05:30",
      utc_offset: "+05:30",
      timezone_location: "Indian Standard Time (IST)"
    });
    
    console.log(`Time API: Returned IST time ${formattedTime} for request with timezone ${timezone}`);
  } catch (err) {
    console.error('Time calculation error:', err.message);
    res.status(500).json({ error: 'Failed to calculate IST time data' });
  }
});

app.listen(PORT, () => {
  console.log(`Proxy server running on http://localhost:${PORT}`);
}); 