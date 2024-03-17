require("dotenv").config();
const express = require("express");
const connect = require("./db");
const cors = require("cors");

// Connect to MongoDB
connect();

// Create an Express app
const app = express();
const port = process.env.PORT ?? 5000;

// Middleware
app.use(express.json());
app.use(cors());

// Routes
app.use("/api/users", require("./routes/users"));

// Start the server
app.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}`);
});
