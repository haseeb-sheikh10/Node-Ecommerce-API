process.loadEnvFile();
const express = require("express");
const connect = require("./db");
const cors = require("cors");
const multer = require("multer");

// Create an Express app
const app = express();
const port = process.env.PORT ?? 5000;
const base_url = process.env.BASE_URL ?? `http://localhost:`;

// Middleware
app.use(express.json()); // for parsing application/json
app.use(express.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded
// app.use(multer().none()); // for parsing multipart/form-data
app.use(cors());
app.use("/public/", express.static(__dirname + "/public/"));

// Routes
app.use("/api/auth", require("./src/routes/auth"));
app.use("/api/users", require("./src/routes/user"));
app.use("/api/product", require("./src/routes/product"));
app.use("/api/categories", require("./src/routes/category"));
app.use("/api/comment", require("./src/routes/comment"));
app.use("/api/cart", require("./src/routes/cart"));
app.use("/api/annonymous-cart", require("./src/routes/annonymous-cart"));
app.use("/api/order", require("./src/routes/order"));
app.use("/api/role", require("./src/routes/role"));

// Start the server
app.listen(port, () => {
  console.log(`Server listening at ${base_url}${port}`);
});
// Connect to MongoDB
connect();
