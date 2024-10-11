document.addEventListener("DOMContentLoaded", function () {
    const svgObject = document.getElementById("world-map"); // The embedded SVG map
    const infoBox = document.getElementById("info-box"); // Floating info box for hover
    const sidebar = document.getElementById("country-details"); // Sidebar for clicked country details
    const sidebarCountryName = document.getElementById("country-name"); // Country name in sidebar
    const closeSidebarButton = document.getElementById("close-sidebar"); // Sidebar close button

    let selectedCountry = null; // To track the clicked country

    // Wait until the SVG map is fully loaded
    svgObject.addEventListener("load", function () {
        const svgDoc = svgObject.contentDocument; // Access the SVG document inside the object
        const countries = svgDoc.querySelectorAll("path, polygon"); // Select all country paths/polygons

        // Hover: Show country name in floating info box
        countries.forEach(country => {
            country.addEventListener("mouseover", function () {
                const countryTitle = country.querySelector("title")?.textContent; // Use the <title> element in the SVG for the country name

                if (countryTitle) {
                    // Display country name in the hover info box
                    infoBox.textContent = countryTitle;

                    // Show and position the info box
                    infoBox.classList.remove("hidden");
                    infoBox.classList.add("show");

                    // Move the info box with the mouse
                    window.onmousemove = function (event) {
                        const x = event.clientX;
                        const y = event.clientY;
                        infoBox.style.top = `${y - 60}px`;
                        infoBox.style.left = `${x + 10}px`;
                    };
                }
            });

            // Hide info box when the mouse leaves the country
            country.addEventListener("mouseout", function () {
                infoBox.classList.add("hidden");
                infoBox.classList.remove("show");
            });

            // Click: Open the sidebar with country details
            country.addEventListener("click", function () {
                const countryTitle = country.querySelector("title")?.textContent; // Get the country name from <title>

                if (countryTitle && selectedCountry !== countryTitle) {
                    selectedCountry = countryTitle; // Track the clicked country

                    // Update the sidebar with the clicked country name
                    sidebarCountryName.textContent = countryTitle;

                    // Placeholder for additional country details (fetch dynamically if needed)

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
        selectedCountry = null; // Reset the selected country when closing the sidebar
    });
});
