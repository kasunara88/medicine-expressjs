const jwt = require("jsonwebtoken");

function getTokenFromReq(req) {
  // Prefer Authorization: Bearer <token>
  const header = req.headers.authorization || "";
  if (header.startsWith("Bearer ")) return header.slice(7);
}

function authGuard(req, res, next) {
  const token = getTokenFromReq(req);
  if (!token) return res.status(401).json({ message: "Missing token" });

  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET, {
      issuer: process.env.JWT_ISSUER || "api", // Use issuer from .env for better configuration
      clockTolerance: 5, // tolerate small clock skew (seconds)
    });

    // Attach user info to request for downstream handlers
    req.user = payload; // { sub, email, role, iat, exp, ... }
    next();
  } catch (err) {
    // Log the error for server-side debugging
    console.error("Authentication error:", err.message);

    // Differentiate common errors for easier debugging
    if (err.name === "TokenExpiredError") {
      return res.status(401).json({ message: "Token expired" });
    }
    if (err.name === "JsonWebTokenError") {
      return res.status(401).json({ message: "Invalid token" });
    }
    return res.status(401).json({ message: "Unauthorized" });
  }
}

module.exports = { authGuard };
