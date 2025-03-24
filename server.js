require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();
const advertisementRoutes = require("./routes/advertisementRoutes");
const eventRoute = require("./routes/eventRoute");
const storeRoutes = require("./routes/store.route");
const userRoute = require("./routes/userRoute");
const parkRoute = require("./routes/parkingRoute");
const comboPackRoute = require("./routes/combopackRoute");
const feedbackRoute = require("./routes/feedbackRoute");
const mailRoutes = require("./routes/mailRoutes");
const ParkingSlot = require("./models/ParkingSlot");
const PORT = process.env.PORT || 8080;

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB connection
mongoose.connect(process.env.MONGO_URI);

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
  console.log("Connected to MongoDB..🪐");
});

// Set up routes
app.use("/api/ads", advertisementRoutes);
app.use("/api/event", eventRoute);
app.use("/api/store", storeRoutes);
app.use("/api/user", userRoute);
app.use("/api/park", parkRoute);
app.use("/api/combopack", comboPackRoute);
app.use("/api/feedback", feedbackRoute);
app.use("/api/mail", mailRoutes);

// Start the server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}...🚀`);
});
