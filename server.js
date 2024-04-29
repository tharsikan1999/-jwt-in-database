const express = require("express");
const app = express();
const PORT = process.env.PORT || 3000;

const registerRoutes = require("./register");
const loginRoutes = require("./login");
const getRoutes = require("./get");

app.use(express.json());
require("dotenv").config();

app.use(registerRoutes);
app.use(loginRoutes);
app.use(getRoutes);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
