// models/RegisterEvent.js
const mongoose = require("mongoose");
const { Schema, model } = mongoose;

const registerEvents = new Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  userName: { type: String },
  userEmail: { type: String },
  eventId: { type:Number },
});

module.exports = model("RegisterEvent", registerEvents);
