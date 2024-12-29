// Wait for the DOM to fully load
document.addEventListener("DOMContentLoaded", () => {
    console.log("DOM fully loaded and parsed!");

    // Select main elements
    const svgObject = document.getElementById("world-map"); // Embedded SVG map
    const sidebar = document.getElementById("country-details"); // Sidebar element
    const closeSidebarButton = document.getElementById("close-sidebar"); // Close button in sidebar
    const mapContainer = document.querySelector(".map-container"); // Map container for dynamic resizing
    const infoBox = document.createElement("div"); // Hover info box
    infoBox.id = "info-box";
    document.body.appendChild(infoBox);

    // Sidebar Elements
    const countryNameElement = document.getElementById("country-name");
    const countryCapitalElement = document.getElementById("country-capital");
    const countryTimeElement = document.getElementById("country-time");
    const countryPopulationElement = document.getElementById("country-population");
    const countryWeatherElement = document.getElementById("country-weather");

    // Ensure the SVG map is fully loaded
    svgObject.addEventListener("load", () => {
        console.log("SVG map loaded successfully!");

        const svgDoc = svgObject.contentDocument; // Access the inner SVG document
        const countries = svgDoc.querySelectorAll("path, polygon"); // Select all country shapes

        // Add event listeners to each country
        countries.forEach((country) => {
            // Mouseover: Show hover info box
            country.addEventListener("mouseover", (event) => {
                const countryName = country.getAttribute("title") || country.id || "Unknown Country";
                infoBox.textContent = countryName;
                infoBox.classList.add("show");

                // Position the info box
                const x = event.clientX;
                const y = event.clientY;
                infoBox.style.top = `${y - 40}px`;
                infoBox.style.left = `${x + 10}px`;

                console.log(`Hovered over: ${countryName}`);
            });

            // Mouseout: Hide hover info box
            country.addEventListener("mouseout", () => {
                infoBox.classList.remove("show");
            });

            // Click: Show country details in the sidebar
            country.addEventListener("click", () => {
                const countryName = country.getAttribute("title") || country.id || "Unknown Country";

                // Fetch and display country details
                fetchCountryDetails(countryName);

                // Show the sidebar and adjust map width
                sidebar.classList.remove("hidden");
                sidebar.classList.add("show");
                mapContainer.classList.add("reduced");

                console.log(`Clicked on: ${countryName}`);
            });
        });
    });

    // Close sidebar on button click
    closeSidebarButton.addEventListener("click", () => {
        sidebar.classList.remove("show");
        sidebar.classList.add("hidden");
        mapContainer.classList.remove("reduced"); // Reset map width
        console.log("Sidebar closed");
    });

    // Fetch country details from multiple APIs
    async function fetchCountryDetails(countryName) {
        console.log(`Fetching details for: ${countryName}`);

        try {
            // 1. Fetch country details from REST Countries API
            const countryResponse = await fetch(`https://restcountries.com/v3.1/name/${countryName}`);
            if (!countryResponse.ok) {
                throw new Error("Country data not found!");
            }
            const countryData = await countryResponse.json();
            const country = countryData[0]; // Take the first matching result

            // Extract relevant data
            const capital = country.capital ? country.capital[0] : "Not Available";
            const population = country.population.toLocaleString();
            const timezone = country.timezones ? country.timezones[0] : "Not Available";

            // 2. Fetch local time from World Time API
            let localTime = "Not Available";
            if (timezone !== "Not Available") {
                const timeResponse = await fetch(`http://worldtimeapi.org/api/timezone/${timezone}`);
                if (timeResponse.ok) {
                    const timeData = await timeResponse.json();
                    localTime = timeData.datetime ? new Date(timeData.datetime).toLocaleTimeString() : "Not Available";
                }
            }

            // 3. Fetch weather from OpenWeatherMap API
            const weatherResponse = await fetch(
                `https://api.openweathermap.org/data/2.5/weather?q=${capital}&appid=YOUR_API_KEY&units=metric`
            );
            let weather = "Not Available";
            if (weatherResponse.ok) {
                const weatherData = await weatherResponse.json();
                weather = `${weatherData.main.temp}°C, ${weatherData.weather[0].description}`;
            }

            // Update sidebar with fetched data
            countryNameElement.textContent = countryName;
            countryCapitalElement.textContent = capital;
            countryTimeElement.textContent = localTime;
            countryPopulationElement.textContent = population;
            countryWeatherElement.textContent = weather;

            console.log("Real-time data successfully updated!");
        } catch (error) {
            console.error("Error fetching country details:", error);

            // Display error message in the sidebar
            countryNameElement.textContent = countryName;
            countryCapitalElement.textContent = "Error fetching data";
            countryTimeElement.textContent = "Error fetching data";
            countryPopulationElement.textContent = "Error fetching data";
            countryWeatherElement.textContent = "Error fetching data";
        }
    }

    // Close sidebar when clicking outside
    document.addEventListener("click", (event) => {
        if (
            !sidebar.contains(event.target) &&
            !mapContainer.contains(event.target) &&
            !event.target.closest("path, polygon")
        ) {
            sidebar.classList.remove("show");
            mapContainer.classList.remove("reduced"); // Reset map width
            console.log("Clicked outside, sidebar closed");
        }
    });

    // Window resize handler for responsiveness
    window.addEventListener("resize", () => {
        console.log("Window resized");
        if (window.innerWidth < 768) {
            mapContainer.classList.remove("reduced"); // Reset map width for smaller screens
        }
    });
});
