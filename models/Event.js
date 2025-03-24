// models/Event.js
const mongoose = require("mongoose");

const eventSchema = new mongoose.Schema({
  Id: { type: Number },
  Subject: { type: String, required: true },
  StartTime: { type: Date, required: true },
  EndTime: { type: Date },
  Location: { type: String },
  Description: { type: String },
  IsAllDay: { type: Boolean },
  RecurrenceRule: { type: String },
  RecurrenceID: { type: Number },
});

module.exports = mongoose.model("Event", eventSchema);