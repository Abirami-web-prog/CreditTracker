const express = require("express");
const cors = require("cors");
const path = require("path");
require("dotenv").config({ path: path.join(__dirname, ".env") });

const app = express();
const port = process.env.PORT || 5000;

// Middlewares
app.use(cors());
app.use(express.json());

// Routes
const customerRoutes = require("./routes/customerRoutes");
app.use("/api/customers", customerRoutes);

// Root route
app.get("/", (req, res) => {
  res.send("✅ CreditFlow Backend is running successfully!");
});

// Start server
app.listen(port, () => {
  console.log(🚀 Server running on port ${port});
});
