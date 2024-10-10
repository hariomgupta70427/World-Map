// Wait for DOM content to be fully loaded
document.addEventListener("DOMContentLoaded", function () {
    const svgObject = document.getElementById("world-map");
    const infoBox = document.getElementById("info-box");
    const countryNameElement = document.getElementById("country-name");

    // Ensure the SVG is fully loaded before manipulating it
    svgObject.addEventListener("load", function () {
        const svgDoc = svgObject.contentDocument; // Access the SVG's inner document
        const countries = svgDoc.querySelectorAll("path, polygon"); // Select all country paths and polygons

        // Handle mouseover to show country name in the floating info box
        countries.forEach(country => {
            country.addEventListener("mouseover", function () {
                const countryName = country.getAttribute("title") || country.querySelector("id")?.textContent;

                if (countryName) {
                    // Update country name in the info box
                    countryNameElement.textContent = countryName;

                    // Show the info box
                    infoBox.classList.remove("hidden");
                    infoBox.classList.add("show");
                }

                // Move the info box with mouse movement
                window.onmousemove = function (event) {
                    const x = event.clientX;
                    const y = event.clientY;
                    infoBox.style.top = `${y - 60}px`;
                    infoBox.style.left = `${x + 10}px`;
                };
            });

            // Hide the info box when the mouse leaves the country
            country.addEventListener("mouseout", function () {
                infoBox.classList.add("hidden");
                infoBox.classList.remove("show");
            });
        });
    });
});

// Handle sidebar functionality for detailed country information
document.addEventListener("DOMContentLoaded", function () {
    const svgObject = document.getElementById("world-map");
    const sidebar = document.getElementById("country-details");
    const countryNameElement = document.getElementById("country-name");
    const countryCapitalElement = document.getElementById("country-capital");
    const countryTimeElement = document.getElementById("country-time");
    const countryPopulationElement = document.getElementById("country-population");
    const countryWeatherElement = document.getElementById("country-weather");
    const closeSidebarButton = document.getElementById("close-sidebar");

    // Ensure the SVG is fully loaded before adding event listeners
    svgObject.addEventListener("load", function () {
        const svgDoc = svgObject.contentDocument; // Access the inner SVG document
        const countries = svgDoc.querySelectorAll("path, polygon"); // Select all country paths and polygons

        // Handle click event for country
        countries.forEach(country => {
            country.addEventListener("click", function () {
                const countryName = country.getAttribute("id") || country.querySelector("title")?.textContent;

                if (countryName) {
                    // Set country details in the sidebar
                    countryNameElement.textContent = countryName;
                    countryCapitalElement.textContent = "N/A"; // Replace with actual capital
                    countryTimeElement.textContent = "N/A"; // Replace with actual local time
                    countryPopulationElement.textContent = "N/A"; // Replace with actual population
                    countryWeatherElement.textContent = "N/A"; // Replace with actual weather

                    // Show the sidebar
                    sidebar.classList.remove("hidden");
                    sidebar.classList.add("show");
                }
            });
        });
    });

    // Close the sidebar when the close button is clicked
    closeSidebarButton.addEventListener("click", function () {
        sidebar.classList.remove("show");
        sidebar.classList.add("hidden");
    });
});
