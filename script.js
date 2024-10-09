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