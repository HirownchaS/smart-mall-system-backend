const express = require("express");
const { model } = require("mongoose");
const Event = require("../models/Event");

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
};

module.exports = eventController;
