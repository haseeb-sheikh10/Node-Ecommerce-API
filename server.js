process.loadEnvFile();
const express = require("express");
const connect = require("./db");
const cors = require("cors");
const multer = require("multer");

// Connect to MongoDB
connect();

// Create an Express app
const app = express();
const port = process.env.PORT ?? 5000;
const base_url = process.env.BASE_URL ?? `http://localhost:`;

// Middleware
app.use(express.json()); // for parsing application/json
app.use(express.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded
app.use(multer().none()); // for parsing multipart/form-data
app.use(cors());

// Routes
app.use("/api/auth", require("./routes/auth"));
app.use("/api/product", require("./routes/product"));
app.use("/api/categories", require("./routes/category"));
app.use("/api/comment", require("./routes/comment"));
app.use("/api/cart", require("./routes/cart"));
app.use("/api/annonymous-cart", require("./routes/annonymous-cart"));

// Start the server
app.listen(port, () => {
  console.log(`Server listening at ${base_url}${port}`);
});
