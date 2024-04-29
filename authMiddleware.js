const jwt = require("jsonwebtoken");

const verifyToken = (req, res, next) => {
  // Get the token from the request headers
  const token = req.headers.authorization;

  if (!token) {
    return res.status(403).json({ message: "Token is missing" });
  }

  // Check if the token starts with "Bearer "
  if (!token.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Invalid token format" });
  }

  // Extract the token value without the "Bearer " prefix
  const tokenValue = token.split(" ")[1];

  const jwtSecret = process.env.JWT_SECRET;

  // Verify the token
  jwt.verify(tokenValue, jwtSecret, (err, decoded) => {
    if (err) {
      console.error("JWT Verification Error:", err);
      return res.status(401).json({ message: "Token is invalid" });
    }

    // Check if token includes role information
    if (!decoded.userRole || !decoded.email) {
      return res
        .status(401)
        .json({ message: "Token does not contain necessary information" });
    }

    // Store decoded token payload in the request object
    req.user = decoded;
    next();
  });
};

module.exports = verifyToken;
