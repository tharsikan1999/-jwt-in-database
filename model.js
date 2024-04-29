const { Schema } = require("mongoose");

const mongoose = require("./mongodb");

const userSchema = new Schema({
  name: String,
  email: String,
  password: String,
  role: String,
});

const User = mongoose.model("User", userSchema);

module.exports = User;
