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

// Local time calculation
app.get('/api/time', async (req, res) => {
  const { timezone } = req.query;
  if (!timezone) return res.status(400).json({ error: 'Timezone is required' });
  
  try {
    // Handle timezone directly
    // Parse the timezone string to extract offset
    let offset = 0;
    
    if (timezone.startsWith('UTC')) {
      const offsetStr = timezone.substring(3); // Remove "UTC"
      if (offsetStr) {
        // Convert offset string (like "+01:00" or "-05:00") to hours
        const sign = offsetStr.charAt(0) === '-' ? -1 : 1;
        const parts = offsetStr.substring(1).split(':');
        const hours = parseInt(parts[0], 10);
        const minutes = parts.length > 1 ? parseInt(parts[1], 10) : 0;
        offset = sign * (hours + minutes / 60);
      }
    }
    
    // Calculate current time with offset
    const now = new Date();
    const utcTime = now.getTime() + (now.getTimezoneOffset() * 60000);
    const localTime = new Date(utcTime + (3600000 * offset));
    
    res.json({
      datetime: localTime.toISOString(),
      timezone: timezone,
      utc_offset: offset >= 0 ? `+${offset}:00` : `${offset}:00`
    });
  } catch (err) {
    console.error('Time calculation error:', err.message);
    res.status(500).json({ error: 'Failed to calculate time data' });
  }
});

app.listen(PORT, () => {
  console.log(`Proxy server running on http://localhost:${PORT}`);
}); 