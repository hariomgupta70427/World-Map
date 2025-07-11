
# **World Explorer Interactive Map**

This project is an interactive world map built using **HTML, CSS, and JavaScript** with a Node.js backend. It allows users to explore countries by hovering over different regions and clicking to view detailed information about each country.

## 🛠️ Features

- **Interactive Map:** Hover over different countries to see highlighting and country names.
- **Country Details:** Click on any country to view detailed information including:
  - Capital city
  - Local time (based on country's timezone)
  - Population
  - Region and subregion
  - Languages
  - Currencies
  - Area
  - Flag
- **Responsive Design:** Works on various screen sizes with smooth transitions.
- **Real-time Data:** Fetches up-to-date country information from REST Countries API.

## 🚀 Technologies Used

- **Frontend:**
  - HTML5 for structure
  - CSS3 for styling and animations
  - JavaScript for dynamic interactions
  - SVG for the interactive map

- **Backend:**
  - Node.js with Express for the server
  - REST Countries API for country data

## 📂 Project Structure

- `index.html` — Main structure and map interface
- `styles.css` — Custom styles for the map and UI
- `script.js` — Frontend logic for interactions and data display
- `server.js` — Backend API proxy and data processing
- `assets/` — Contains the SVG world map and other assets

## 📈 How to Use

### Local Development

1. Clone the repository:  
   ```bash
   git clone https://github.com/hariomgupta70427/World-Map.git
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the server:
   ```bash
   npm start
   ```

4. Open `http://localhost:5000` in your browser to view and interact with the map.

### Deployment on Vercel

1. Create a Vercel account if you don't have one: https://vercel.com/signup

2. Install Vercel CLI:
   ```bash
   npm install -g vercel
   ```

3. Login to Vercel:
   ```bash
   vercel login
   ```

4. Deploy the project:
   ```bash
   vercel
   ```

5. Follow the prompts to complete the deployment.

## 🏆 Future Improvements

- Adding search functionality to quickly find countries
- Implementing zoom and pan capabilities
- Adding historical data and statistics
- Creating comparison features between countries

## 💡 Contribution

Feel free to fork this project, open issues, or submit pull requests to make it better!

## 📄 License

This project is open-source and available under the [MIT](https://choosealicense.com/licenses/mit/) License.



