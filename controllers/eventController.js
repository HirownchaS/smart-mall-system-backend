const express = require("express");
const mongoose = require("mongoose");
const Event = require("../models/Event");
const User = require("../models/User");
const RegisterEvent = require("../models/Visitor");
const eventController = {
  createEvent: async (req, res) => {
    try {
      const eventData = req.body;
      const newEvent = new Event(eventData);
      await newEvent.save();
      res.status(201).json(newEvent);
    } catch (error) {
      res.status(500).json({ message: "Error saving event", error });
    }
  },
  //get all events
  getEvent: async (req, res) => {
    try {
      const events = await Event.find().lean().select("-_id -__v");
      res.json(events);
    } catch (err) {
      res.status(500).send(err.message);
    }
  },
  getFutureEvents: async (req, res) => {
    try {
      const currentDate = new Date();
      const events = await Event.find({
        EndTime: { $gte: currentDate },
      })
        .lean()
        .select("-_id -__v")
        .sort({ StartTime: 1 });
      res.json(events);
    } catch (err) {
      res.status(500).send(err.message);
    }
  },

  //remove event
  deleteEvent: async (req, res) => {
    const { id } = req.params;
    try {
      const deletedEvent = await Event.findOneAndDelete({ Id: id });
      if (!deletedEvent) {
        return res.status(404).send("Event not found");
      }
      res.status(204).send(); // No content
    } catch (err) {
      res.status(500).send(err.message);
    }
  },

  updateEvent: async (req, res) => {
    const { id } = req.params;
    try {
      const updatedEvent = await Event.findOneAndUpdate({ Id: id }, req.body, {
        new: true,
        runValidators: true,
      });

      if (!updatedEvent) {
        return res.status(404).send("Event not found");
      }

      res.json(updatedEvent);
    } catch (err) {
      res.status(500).send(err.message);
    }
  },

  registerForEvent: async (req, res) => {
    const { userId, eventId } = req.body;

    // if (
    //   !mongoose.Types.ObjectId.isValid(userId) ||
    //   typeof eventId !== "number"
    // ) {
    //   return res.status(400).json({ message: "Invalid User ID or Event ID" });
    // }

    try {
      const user = await User.findById(userId);
      const event = await Event.findOne({ Id: eventId });

      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      if (!event) {
        return res.status(404).json({ message: "Event not found" });
      }

      const newRegistration = await RegisterEvent.create({
        userId: user._id,
        userName: user.username,
        userEmail: user.email,
        eventId,
      });

      // event.participants.push(userId);
      // await event.save();

      res.status(200).json({
        message: "Registration successful",
        newRegistration,
      });
    } catch (err) {
      res.status(500).json({ message: "Error registering", error: err });
    }
  },
};

module.exports = eventController;
