const { Schema } = require("mongoose");

const mongoose = require("./mongodb");

const tokenSchema = new Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  token: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
    expires: "1h",
  },
});

const Token = mongoose.model("Token", tokenSchema);

module.exports = Token;
