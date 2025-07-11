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
    
    // Hide weather element as requested
    if (countryWeatherElement) {
        const weatherItem = countryWeatherElement.closest('li');
        if (weatherItem) {
            weatherItem.style.display = 'none';
        }
    }

    // Country name normalization mapping - expanded with more countries
    const countryNameMapping = {
        // Americas
        "United States": "United States of America",
        "USA": "United States of America",
        "US": "United States of America",
        "Dominican Rep.": "Dominican Republic",
        
        // Europe
        "UK": "United Kingdom",
        "England": "United Kingdom",
        "Great Britain": "United Kingdom",
        "Czech Republic": "Czechia",
        "Macedonia": "North Macedonia",
        
        // Asia
        "Russia": "Russian Federation",
        "Syria": "Syrian Arab Republic",
        "Laos": "Lao People's Democratic Republic",
        "Vietnam": "Viet Nam",
        "South Korea": "Korea, Republic of",
        "North Korea": "Korea, Democratic People's Republic of",
        "Burma": "Myanmar",
        "Iran": "Iran (Islamic Republic of)",
        
        // Africa
        "Congo": "Democratic Republic of the Congo",
        "DR Congo": "Democratic Republic of the Congo",
        "DRC": "Democratic Republic of the Congo",
        "Republic of Congo": "Congo",
        "Tanzania": "United Republic of Tanzania",
        "Ivory Coast": "Côte d'Ivoire",
        "Swaziland": "Eswatini",
        "W. Sahara": "Western Sahara",
        
        // Specific fixes for SVG map issues
        "India": "India",
        "Republic of India": "India",
        "Bharat": "India"
    };

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

    // Normalize country name for API compatibility
    function normalizeCountryName(name) {
        // Check if we have a direct mapping
        if (countryNameMapping[name]) {
            return countryNameMapping[name];
        }
        return name;
    }

    // Fetch country details from APIs
    async function fetchCountryDetails(countryName) {
        console.log(`Fetching details for: ${countryName}`);
        
        // Reset sidebar data to show loading state
        countryNameElement.textContent = countryName;
        countryCapitalElement.textContent = "Loading...";
        countryTimeElement.textContent = "Loading...";
        countryPopulationElement.textContent = "Loading...";
        
        // Remove any previously added extra info
        const sidebarList = countryPopulationElement.closest('ul');
        Array.from(sidebarList.querySelectorAll('.extra-info')).forEach(el => el.remove());

        try {
            // Normalize country name for API compatibility
            const normalizedName = normalizeCountryName(countryName);
            console.log(`Using normalized name: ${normalizedName}`);
            
            // 1. Fetch country details from proxy
            const countryResponse = await fetch(`/api/country?name=${encodeURIComponent(normalizedName)}`);
            if (!countryResponse.ok) {
                throw new Error(`Country API responded with status: ${countryResponse.status}`);
            }
            
            const countryData = await countryResponse.json();
            if (!countryData || countryData.length === 0) {
                throw new Error("No country data found");
            }
            
            // Find the best match for the country
            let country = countryData[0]; // Default to first result
            
            // If we have multiple results, try to find exact match
            if (countryData.length > 1) {
                const exactMatch = countryData.find(c => 
                    c.name.common.toLowerCase() === normalizedName.toLowerCase() ||
                    c.name.official.toLowerCase() === normalizedName.toLowerCase()
                );
                if (exactMatch) {
                    country = exactMatch;
                }
            }
            
            console.log("Country data:", country);

            // Extract relevant data with proper error handling
            let capital = "Not Available";
            if (country.capital && country.capital.length > 0) {
                capital = country.capital[0];
            }
            
            let population = "Not Available";
            if (country.population) {
                population = country.population.toLocaleString();
            }
            
            // Get timezone - use the first one from the list
            let timezone = "Not Available";
            if (country.timezones && country.timezones.length > 0) {
                timezone = country.timezones[0];
            }
            
            const region = country.region || "Not Available";
            const subregion = country.subregion || "Not Available";
            
            let flag = null;
            if (country.flags && country.flags.svg) {
                flag = country.flags.svg;
            } else if (country.flags && country.flags.png) {
                flag = country.flags.png;
            }
            
            let currencies = "Not Available";
            if (country.currencies) {
                currencies = Object.values(country.currencies)
                    .map(c => `${c.name} (${c.symbol || ''})`)
                    .join(', ');
            }

            // Update basic country info
            countryNameElement.textContent = country.name?.common || countryName;
            countryCapitalElement.textContent = capital;
            countryPopulationElement.textContent = population;

            // 2. Fetch local time for the country's timezone
            if (timezone !== "Not Available") {
                try {
                    const timeResponse = await fetch(`/api/time?timezone=${encodeURIComponent(timezone)}`);
                    if (!timeResponse.ok) {
                        throw new Error(`Time API responded with status: ${timeResponse.status}`);
                    }
                    
                    const timeData = await timeResponse.json();
                    console.log("Time data:", timeData);
                    
                    if (timeData.datetime) {
                        const date = new Date(timeData.datetime);
                        const options = { 
                            hour: '2-digit', 
                            minute: '2-digit',
                            second: '2-digit',
                            hour12: true,
                            weekday: 'short',
                            year: 'numeric',
                            month: 'short',
                            day: 'numeric'
                        };
                        countryTimeElement.textContent = `${date.toLocaleString(undefined, options)} (IST)`;
                    } else {
                        countryTimeElement.textContent = "Time data unavailable";
                    }
                } catch (timeError) {
                    console.error("Error fetching time:", timeError);
                    countryTimeElement.textContent = "Error fetching time data";
                }
            } else {
                // Even if timezone is not available, still fetch IST time
                try {
                    const timeResponse = await fetch(`/api/time?timezone=UTC+05:30`);
                    if (!timeResponse.ok) {
                        throw new Error(`Time API responded with status: ${timeResponse.status}`);
                    }
                    
                    const timeData = await timeResponse.json();
                    
                    if (timeData.datetime) {
                        const date = new Date(timeData.datetime);
                        const options = { 
                            hour: '2-digit', 
                            minute: '2-digit',
                            second: '2-digit',
                            hour12: true,
                            weekday: 'short',
                            year: 'numeric',
                            month: 'short',
                            day: 'numeric'
                        };
                        countryTimeElement.textContent = `${date.toLocaleString(undefined, options)} (IST)`;
                    } else {
                        countryTimeElement.textContent = "Time data unavailable";
                    }
                } catch (timeError) {
                    console.error("Error fetching time:", timeError);
                    countryTimeElement.textContent = "Error fetching time data";
                }
            }

            // Display additional info (region, subregion, flag, currencies)
            let extraInfo = '';
            extraInfo += `<li><strong>Region:</strong> ${region}</li>`;
            extraInfo += `<li><strong>Subregion:</strong> ${subregion}</li>`;
            extraInfo += `<li><strong>Currencies:</strong> ${currencies}</li>`;
            
            // Add languages if available
            if (country.languages) {
                const languages = Object.values(country.languages).join(', ');
                extraInfo += `<li><strong>Languages:</strong> ${languages}</li>`;
            }
            
            // Add area if available
            if (country.area) {
                extraInfo += `<li><strong>Area:</strong> ${country.area.toLocaleString()} km²</li>`;
            }
            
            // Add flag if available
            if (flag) {
                extraInfo += `<li><strong>Flag:</strong> <img src="${flag}" alt="Flag" style="width:40px;vertical-align:middle;"></li>`;
            }
            
            // Add new extra info
            const tempDiv = document.createElement('div');
            tempDiv.innerHTML = `<ul class="extra-info">${extraInfo}</ul>`;
            sidebarList.appendChild(tempDiv.firstChild);

            console.log("Real-time data successfully updated!");
        } catch (error) {
            console.error("Error fetching country details:", error);

            // Display error message in the sidebar
            countryNameElement.textContent = countryName;
            countryCapitalElement.textContent = "Error fetching data";
            countryTimeElement.textContent = "Error fetching data";
            countryPopulationElement.textContent = "Error fetching data";
            
            // Show error details
            const tempDiv = document.createElement('div');
            tempDiv.innerHTML = `<ul class="extra-info"><li class="error"><strong>Error:</strong> ${error.message}</li></ul>`;
            sidebarList.appendChild(tempDiv.firstChild);
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
