document.addEventListener("DOMContentLoaded", function () {
    const svgObject = document.getElementById("world-map");
    const infoBox = document.getElementById("info-box");
    const countryNameElement = document.getElementById("country-name");

    // Listen for when the SVG is fully loaded
    svgObject.addEventListener("load", function () {
        const svgDoc = svgObject.contentDocument;

        // Get all country paths (assuming the countries have 'title' elements inside <path>)
        const countries = svgDoc.querySelectorAll("path");

        countries.forEach(country => {
            country.addEventListener("mouseover", function () {
                const title = country.querySelector("title");
                if (title) {
                    countryNameElement.textContent = title.textContent;
                    infoBox.classList.remove("hidden");
                }
            });

            country.addEventListener("mouseout", function () {
                infoBox.classList.add("hidden");
            });

            // Optionally, you can also handle clicks on countries
            country.addEventListener("click", function () {
                alert("You clicked on " + title.textContent);
            });
        });
    });
});
