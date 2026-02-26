document.addEventListener("DOMContentLoaded", function () {
    const form = document.getElementById("registerForm");

    form.addEventListener("submit", async function (e) {
        e.preventDefault(); // prevent form default

        const name = document.getElementById("full-name").value.trim();
        const department = document.getElementById("department").value;
        const student_id = document.getElementById("student-id").value.trim();
        const email = document.getElementById("email").value.trim();
        const password = document.getElementById("password").value.trim();

        if (!name || !department || !student_id || !email || !password) {
            alert("Please fill all fields!");
            return;
        }

        try {
            const response = await fetch("http://localhost:3000/signup", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ name, email, password, student_id, department })
            });

            const data = await response.json();
            console.log("API response:", data);

            if (response.status === 201) {
                // Use setTimeout to avoid alert blocking redirect
                alert(data.message);
                setTimeout(() => {
                    window.location.href = "home.html";
                }, 50);
            } else {
                alert(data.message || "Signup failed");
            }

        } catch (error) {
            console.error("Signup error:", error);
            alert("Server error. Try again later.");
        }
    });
});