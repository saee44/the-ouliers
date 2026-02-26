// backend apis
console.log("server started ")
const express = require("express");
const cors = require("cors");
const db = require("./db");

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

function checkRole(allowedRoles) {
  return (req, res, next) => {
    const { role } = req.body;

    if (!allowedRoles.includes(role)) {
      return res.status(403).json({ message: "Access denied" });
    }

    next();
  };
}

// create event
app.post("/events", checkRole(["coordinator", "admin"]), (req, res) => {
  const { title, description, event_date, category, location, userId } = req.body;

  if (!title || !event_date) {
    return res.status(400).json({ message: "Title and date required" });
  }

  db.query(
    "INSERT INTO events (title, description, event_date, category, location, created_by) VALUES (?, ?, ?, ?, ?, ?)",
    [title, description, event_date, category, location, userId],
    (err, result) => {
      if (err) return res.status(500).json({ error: err.message });

      res.json({ message: "Event created successfully" });
    }
  );
});

// get all events
app.get("/events", (req, res) => {
  db.query("SELECT * FROM events ORDER BY event_date ASC", (err, results) => {
    if (err) return res.status(500).json({ error: err.message });

    res.json(results);
  });
});

// registation for all event
app.post("/events/:id/register", checkRole(["student"]), (req, res) => {
  const eventId = req.params.id;
  const { userId } = req.body;

  db.query(
    "INSERT INTO registrations (user_id, event_id) VALUES (?, ?)",
    [userId, eventId],
    (err, result) => {
      if (err) {
        return res.status(400).json({ message: "Already registered or error occurred" });
      }

      res.json({ message: "Registered successfully" });
    }
  );
});

// GET MY REGISTRATIONS
app.get("/my-registrations/:userId", (req, res) => {
  const userId = req.params.userId;

  db.query(
    `SELECT events.* 
     FROM registrations
     JOIN events ON registrations.event_id = events.id
     WHERE registrations.user_id = ?`,
    [userId],
    (err, results) => {
      if (err) return res.status(500).json({ error: err.message });

      res.json(results);
    }
  );
});

// promot user

app.put("/users/:id/promote", checkRole(["admin"]), (req, res) => {
  const userId = req.params.id;

  db.query(
    "UPDATE users SET role = 'coordinator' WHERE id = ?",
    [userId],
    (err, result) => {
      if (err) return res.status(500).json({ error: err.message });

      res.json({ message: "User promoted to coordinator" });
    }
  );
});

// GET TEAM POSTS FOR EVENT
app.get("/events/:id/team-posts", (req, res) => {
  const eventId = req.params.id;

  db.query(
    `SELECT team_posts.*, users.name 
     FROM team_posts
     JOIN users ON team_posts.user_id = users.id
     WHERE event_id = ?`,
    [eventId],
    (err, results) => {
      if (err) return res.status(500).json({ error: err.message });

      res.json(results);
    }
  );
});

// get team post
app.post("/team-posts/:id/reply", checkRole(["student"]), (req, res) => {
  const postId = req.params.id;
  const { userId, message } = req.body;

  db.query(
    "INSERT INTO team_replies (post_id, user_id, message) VALUES (?, ?, ?)",
    [postId, userId, message],
    (err) => {
      if (err) return res.status(500).json({ error: err.message });

      res.json({ message: "Reply added" });
    }
  );
});

// reply to team post
app.post("/team-posts/:id/reply", checkRole(["student"]), (req, res) => {
  const postId = req.params.id;
  const { userId, message } = req.body;

  db.query(
    "INSERT INTO team_replies (post_id, user_id, message) VALUES (?, ?, ?)",
    [postId, userId, message],
    (err) => {
      if (err) return res.status(500).json({ error: err.message });

      res.json({ message: "Reply added" });
    }
  );
});




