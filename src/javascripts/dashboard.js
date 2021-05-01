/*!
 * =============================================================================
 * Client-side logic for /dashboard
 * =============================================================================
 */

// Event that listens for cursor's moves and update popup's container
// based on it (whenever it moves).
window.addEventListener("mousemove", (event) => {
    // Get popup's container.
    const popup = document.getElementsByClassName("popup-img")[0];
    // Update popup's location based on cursor's location. 
    popup.style.top  = `${event.clientY + 30}px`;
    popup.style.left = `${event.clientX + 30}px`;
});

// Events that listens for cursor's moves within rows of main table. Whenever
// cursor enters one, an image tag is created, appended to popup, and showed.
// Whenever cursor leave area, popup is hidden again and its contents erased.
document.querySelectorAll(".results > tbody tr")
    .forEach(e => {
        e.addEventListener("mouseenter", () => {
            // Get popup's container.
            const popup = document.getElementsByClassName("popup-img")[0];
            // Create image and append it to popup.
            const img = document.createElement("img");
            img.src   = e.getAttribute("data-src-img");
            img.alt   = `${e.id}'s image`;
            img.width = "300";
            // Append image to popup and show it.
            popup.appendChild(img);
            popup.style.display = "block";
        })
        e.addEventListener("mouseleave", () => {
            // Get popup's container.
            const popup = document.getElementsByClassName("popup-img")[0];
            // Remove all of its contents and hide it.
            popup.style.display = "none";
            popup.innerHTML = "";
        })
    });

// Event that listens for incoming clicks on header's menu button
// and toggles display of the filters' container (in yellow).
document.getElementById("btn-menu")
    .addEventListener("click", () => {
        const filters = document.getElementsByClassName("form")[0];
        filters.style.display = (filters.style.display != "block") 
            ? "block"
            : "none";
    });