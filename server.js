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
    const { name, email, password } = req.body;

    // basic validation
    if (!name || !email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    // check if user already exists
    db.query(
      "SELECT * FROM users WHERE email = ?",
      [email],
      async (err, results) => {
        if (err) return res.status(500).json({ error: err });

        if (results.length > 0) {
          return res.status(400).json({ message: "User already exists" });
        }

        // hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // insert user
        db.query(
          "INSERT INTO users (name, email, password) VALUES (?, ?, ?)",
          [name, email, hashedPassword],
          (err, result) => {
            if (err) return res.status(500).json({ error: err });

            res.json({ message: "User registered successfully" });
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
});app.post("/login", async (req, res) => {
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