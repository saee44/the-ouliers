document.addEventListener("DOMContentLoaded", () => {

    const eventsGrid = document.querySelector(".events-grid");
    const authZone = document.getElementById("auth-zone");

    // Check login from localStorage
    const userId = localStorage.getItem("userId");
    const role = localStorage.getItem("role");

    if (userId) {
        authZone.innerHTML = `
            <button class="btn btn-text" onclick="window.location.href='profile.html'">My Profile</button>
            <button class="btn btn-primary dark" onclick="window.location.href='home.html'">Dashboard</button>
        `;
    }

    // Fetch events from backend
    fetch("http://localhost:3000/events")
        .then(res => res.json())
        .then(events => {
            eventsGrid.innerHTML = "";

            if (events.length === 0) {
                eventsGrid.innerHTML = "<p>No events available</p>";
                return;
            }

            events.forEach(event => {
                const eventCard = document.createElement("div");
                eventCard.classList.add("event-card", "animate-fade-up");

                eventCard.innerHTML = `
                    <div class="event-img" style="background:#eef2f3;">
                        <span class="tag tag-green">REGISTRATION OPEN</span>
                    </div>
                    <div class="event-info">
                        <small class="event-date">${formatDate(event.event_date)}</small>
                        <h3>${event.title}</h3>
                        <p class="event-location">📍 ${event.location || "TBA"}</p>
                        <p class="event-desc">${event.description || ""}</p>
                        ${
                            role === "student"
                            ? `<button class="btn btn-primary register-btn" data-id="${event.id}">Register</button>`
                            : ""
                        }
                    </div>
                `;

                eventsGrid.appendChild(eventCard);
            });

            // Register button click
            document.querySelectorAll(".register-btn").forEach(btn => {
                btn.addEventListener("click", () => {
                    const eventId = btn.getAttribute("data-id");

                    fetch(`http://localhost:3000/events/${eventId}/register`, {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json"
                        },
                        body: JSON.stringify({
                            userId,
                            role
                        })
                    })
                    .then(res => res.json())
                    .then(data => {
                        alert(data.message);
                    })
                    .catch(err => {
                        alert("Error registering");
                        console.error(err);
                    });
                });
            });

        })
        .catch(err => {
            console.error("Error fetching events:", err);
        });

});

// Format date nicely
function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric"
    });
}