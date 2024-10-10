document.addEventListener("DOMContentLoaded", function () {
    const svgObject = document.getElementById("world-map");
    const infoBox = document.getElementById("info-box");
    const countryNameElement = document.getElementById("country-name");

    // Ensure the SVG is fully loaded before manipulating it
    svgObject.addEventListener("load", function () {
        const svgDoc = svgObject.contentDocument; // Access the SVG's inner document

        // Attempt to select all countries by their paths
        const countries = svgDoc.querySelectorAll("path, polygon"); // Cover both path and polygon

        countries.forEach(country => {
            // Attach mouseover event to display country name
            country.addEventListener("mouseover", function () {
                let countryName = country.getAttribute("title") || country.querySelector("id")?.textContent;

                if (countryName) {
                    countryNameElement.textContent = countryName;
                    infoBox.classList.remove("hidden");
                    infoBox.classList.add("show");
                }

                // Update the info-box position with mouse movement
                window.onmousemove = function (event) {
                    const x = event.clientX;
                    const y = event.clientY;
                    infoBox.style.top = (y - 60) + 'px';
                    infoBox.style.left = (x + 10) + 'px';
                };
            });

            // Hide the info box when mouse leaves the country
            country.addEventListener("mouseout", function () {
                infoBox.classList.add("hidden");
                infoBox.classList.remove("show");
            });
        });
    });
});
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
        const countries = svgDoc.querySelectorAll("path, polygon"); // Select all country paths

        countries.forEach(country => {
            country.addEventListener("click", function () {
                const countryName = country.getAttribute("id") || country.querySelector("title")?.textContent;

                if (countryName) {
                    // Set the country name in the sidebar
                    countryNameElement.textContent = countryName;

                    // Placeholder for other country details
                    countryCapitalElement.textContent = "N/A"; // Replace with actual data
                    countryTimeElement.textContent = "N/A"; // Replace with actual time
                    countryPopulationElement.textContent = "N/A"; // Replace with actual population
                    countryWeatherElement.textContent = "N/A"; // Replace with actual weather

                    // Show the sidebar
                    sidebar.classList.remove("hidden");
                    sidebar.classList.add("show");
                }
            });
        });
    });

    // Close sidebar when "Close" button is clicked
    closeSidebarButton.addEventListener("click", function () {
        sidebar.classList.remove("show");
        sidebar.classList.add("hidden");
    });
});
