// In your backend project, create: middleware/auth.js

const jwt = require("jsonwebtoken");

function verifyToken(req, res, next) {
  const authHeader = req.headers["authorization"];
  // The header format is "Bearer TOKEN"
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) {
    return res
      .status(403)
      .json({ message: "A token is required for authentication." });
  }

  try {
    // Verify the token using the secret key from your environment variables
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    // Attach the decoded payload (which should contain the user's ID) to the request object
    req.user = decoded;
  } catch (err) {
    return res.status(401).json({ message: "Invalid or expired token." });
  }

  // If the token is valid, proceed to the next middleware or route handler
  return next();
}

module.exports = verifyToken;
