const express = require("express");
const bcrypt = require("bcrypt");
const router = express.Router();

const User = require("./model");

router.post("/api/register", async (req, res) => {
  const { name, email, password, role } = req.body;

  try {
    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    } else {
      // Hash the password
      const hashedPassword = await bcrypt.hash(password, 10);

      // Create a new user
      const newUser = new User({
        name,
        email,
        password: hashedPassword,
        role,
      });

      // Save the new user to the database
      await newUser.save();

      // Send success response
      res
        .status(201)
        .json({ message: "User created successfully", user: newUser });
    }
  } catch (error) {
    console.error(error);
    // Send error response
    res.status(500).json({ message: "Server Error" });
  }
});

module.exports = router;
