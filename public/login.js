document.addEventListener("DOMContentLoaded", function () {

    const form = document.getElementById("loginForm");
    const messageBox = document.getElementById("msg");

    form.addEventListener("submit", async function (e) {
        e.preventDefault();

        const email = document.getElementById("email").value.trim();
        const password = document.getElementById("password").value.trim();

        try {
            const response = await fetch("http://localhost:3000/login", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    email,
                    password
                })
            });

            const data = await response.json();

            if (response.ok) {
                messageBox.style.color = "green";
                messageBox.innerText = "Login successful";

                // ✅ Store user info properly
                localStorage.setItem("userId", data.userId);
                localStorage.setItem("role", data.role);

                setTimeout(() => {
                    window.location.href = "dashboard.html";
                }, 1000);

            } else {
                messageBox.style.color = "red";
                messageBox.innerText = data.message;
            }

        } catch (error) {
            console.error("Error:", error);
            messageBox.style.color = "red";
            messageBox.innerText = "Cannot connect to server";
        }
    });

});