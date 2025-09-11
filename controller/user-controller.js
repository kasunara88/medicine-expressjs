require("dotenv").config();
const mysql = require("mysql2");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
// const secretKey = process.env.JWT_SECRET;

const connection = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "1988@Ara",
  database: "afsd09_medicine",
});

const userRegistration = (req, res) => {
  // 1. Add basic validation
  const { username, email, password } = req.body;
  if (!username || !email || !password) {
    return res.status(400).send("Username, email, and password are required.");
  }

  const hashedPassword = bcrypt.hashSync(req.body.password, 10);
  const image = req.file ? req.file.filename : null;

  connection.query(
    "INSERT INTO users (username, email, password, image) VALUES (?, ?, ?, ?)",
    [username, email, hashedPassword, image],
    (err, rows) => {
      if (err) {
        return res
          .status(500)
          .json({ message: "Error saving registration", error: err });
      }
      res.send(rows);
    }
  );
};

const userLogin = (req, res) => {
  const submittedEmail = req.body.email;
  const submittedPassword = req.body.password;

  connection.query(
    "SELECT * FROM users WHERE email = ?",
    [submittedEmail],
    (err, rows) => {
      if (err) {
        return res.send("Server error.");
      }

      const user = rows[0];

      if (!user) {
        return res.status(401).send("Login failed: Invalid credentials.");
      }

      const hashedPasswordFromDB = user.password;

      // 3. Compare the submitted password with the stored hash.
      // bcrypt.compare does all the work for you!
      bcrypt.compare(
        submittedPassword,
        hashedPasswordFromDB,
        (bcryptErr, isMatch) => {
          if (bcryptErr) {
            return res.send("Server error during password comparison.");
          }

          if (isMatch) {
            const payload = {
              id: user.id,
              email: user.email,
            };
            const token = jwt.sign(
              payload,
              process.env.JWT_SECRET, // Your secret from the .env file
              { expiresIn: "1h", issuer: process.env.JWT_ISSUER || "api" } // Set an expiration time (e.g., 1 hour)
            );
            // Passwords match! User is logged in.
            res.json({
              message: "Login successful!",
              token: token,
            });
          } else {
            // Passwords do not match.
            res.status(401).send("Login failed: Invalid credentials.");
          }
        }
      );
    }
  );
};

const getUserProfile = (req, res) => {
  // The user ID is available from the decoded token in req.user
  const userId = req.user.id;

  // Query your database to get the user's details
  // Make sure to exclude the password!
  connection.query(
    "SELECT id, username, email, image FROM users WHERE id = ?",
    [userId],
    (err, results) => {
      if (err) {
        return res.status(500).json({ message: "Database error", error: err });
      }
      if (results.length === 0) {
        return res.status(404).json({ message: "User not found" });
      }
      // Send the user data back to the client
      res.status(200).json(results[0]);
    }
  );
};

module.exports = { userRegistration, userLogin, getUserProfile };
