const jwt = require("jsonwebtoken");
const TokenModel = require("./tokenModel"); // Assuming you have a Token model for database operations

const verifyToken = (req, res, next) => {
  // Get the user identifier from the request (e.g., username or user ID)
  const userId = req.body.userId;

  if (!userId) {
    return res.status(400).json({ message: "User ID is missing" });
  }

  // Retrieve the token from the database based on the user identifier
  TokenModel.findOne({ userId: userId })
    .then((tokenData) => {
      if (!tokenData) {
        return res
          .status(403)
          .json({ message: "Token not found in the database" });
      }

      const tokenValue = tokenData.token;
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
    })
    .catch((err) => {
      console.error("Database Error:", err);
      return res.status(500).json({ message: "Database error" });
    });
};

module.exports = verifyToken;
