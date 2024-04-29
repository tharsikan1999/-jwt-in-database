const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const router = express.Router();
const Token = require("./tokenModel");

const User = require("./model");

router.post("/api/login", async (req, res) => {
  const { email, password } = req.body;

  const jwtSecret = process.env.JWT_SECRET;

  // Check if user already exists
  const existingUser = await User.findOne({ email });

  if (!existingUser) {
    return res.status(400).json({ message: "User does not exist" });
  }

  try {
    // Check if the password is correct
    const isPasswordCorrect = await bcrypt.compare(
      password,
      existingUser.password
    );

    if (!isPasswordCorrect) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    // Delete existing tokens for the user
    await Token.deleteMany({ userId: existingUser._id });

    // Generate JWT token
    const token = jwt.sign(
      {
        email: existingUser.email,
        userId: existingUser._id,
        userRole: existingUser.role,
      },
      jwtSecret,
      { expiresIn: "1h" } // Token expiration time
    );

    // Store token in database
    const tokenData = new Token({
      userId: existingUser._id,
      token: token,
    });
    await tokenData.save();

    // Send success response with token
    res.json({ message: "Login successful", token });
  } catch (error) {
    console.error(error);
    // Send error response
    res.status(500).json({ message: "Server Error" });
  }
});

module.exports = router;
