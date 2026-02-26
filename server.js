// backend apis
console.log("server started ")
const express = require("express");
const cors = require("cors");
const db = require("./db");
const bcrypt = require("bcrypt");

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.static("public"));

app.listen(3000, () => {
  console.log("Server running on port 3000");
});



app.post("/signup", async (req, res) => {
  try {
    const { name, email, password, student_id, department } = req.body;

    // Basic validation
    if (!name || !email || !password || !student_id || !department) {
      return res.status(400).json({ message: "All fields are required" });
    }

    // Allowed departments
    const allowedDepartments = [
      "Computer Engineering",
      "Information Technology",
      "Mechanical",
      "Electronics",
      "Civil"
    ];

    if (!allowedDepartments.includes(department)) {
      return res.status(400).json({ message: "Invalid department" });
    }

    // Check duplicate email or student_id
    db.query(
      "SELECT * FROM users WHERE email = ? OR student_id = ?",
      [email, student_id],
      async (err, results) => {
        if (err) {
          return res.status(500).json({ error: err.message });
        }

        if (results.length > 0) {
          return res.status(400).json({
            message: "Email or Student ID already exists"
          });
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Insert user (role always student)
        db.query(
          "INSERT INTO users (name, email, password, student_id, department, role) VALUES (?, ?, ?, ?, ?, ?)",
          [name, email, hashedPassword, student_id, department, "student"],
          (err, result) => {
            if (err) {
              return res.status(500).json({ error: err.message });
            }

            res.status(201).json({
              message: "User registered successfully"
            });
          }
        );
      }
    );
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    db.query(
      "SELECT * FROM users WHERE email = ?",
      [email],
      async (err, results) => {
        if (err) return res.status(500).json({ error: err });

        if (results.length === 0) {
          return res.status(400).json({ message: "User not found" });
        }

        const user = results[0];

        // compare password
        const match = await bcrypt.compare(password, user.password);

        if (!match) {
          return res.status(400).json({ message: "Invalid password" });
        }

        res.json({
          message: "Login successful",
          userId: user.id
        });
      }
    );
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});


app.post("/login", (req, res) => {
  const { email, password } = req.body;

  // Basic validation
  if (!email || !password) {
    return res.status(400).json({ message: "Email and password are required" });
  }

  // Find user by email
  db.query("SELECT * FROM users WHERE email = ?", [email], async (err, results) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }

    if (results.length === 0) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    const user = results[0];

    // Compare password
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    // Successful login
    res.status(200).json({
      message: "Login successful",
      userId: user.id,
      role: user.role,
      name: user.name
    });
  });
});