const express = require("express");
const router = express.Router();
const verifyToken = require("./authMiddleware");

const User = require("./model");

router.get("/api/get", verifyToken, async (req, res) => {
  try {
    const userRole = req.user.userRole;
    const userEmail = req.user.email;

    const data = await User.find().select("-password");

    if (userRole === "admin") {
      res.json(data);
    } else {
      const userData = data.filter((user) => user.email === userEmail);
      res.json(userData);
    }
  } catch (error) {
    console.error("Error fetching data:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

module.exports = router;
