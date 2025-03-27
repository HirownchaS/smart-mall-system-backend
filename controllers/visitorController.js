// const User = require("../models/User");
// const Event = require("../models/Event");

// const visitorController = {
//   // Register a new user (visitor)
//   registerVisitor: async (req, res) => {
//     try {
//       const { name, email } = req.body;

//       // Check if the user already exists by email
//       let user = await User.findOne({ email });
//       if (user) {
//         return res.status(400).json({ message: "Email already registered" });
//       }

//       // Create a new user
//       user = new User({ name, email });
//       await user.save();

//       res.status(201).json({ message: "User registered successfully", user });
//     } catch (error) {
//       res.status(500).json({ message: "Error registering user", error: error.message });
//     }
//   },

//   // Register a user for an event
//   registerForEvent: async (req, res) => {
//     try {
//       const { userId, eventId } = req.body;

//       // Find the event by ID
//       const event = await Event.findById(eventId);
//       if (!event) {
//         return res.status(404).json({ message: "Event not found" });
//       }

//       // Find the user by ID
//       const user = await User.findById(userId);
//       if (!user) {
//         return res.status(404).json({ message: "User not found" });
//       }

//       // Check if the user is already registered for the event
//       if (event.participants.includes(userId)) {
//         return res.status(400).json({ message: "User already registered for this event" });
//       }

//       // Add user to the event participants and event to user's registeredEvents
//       event.participants.push(userId);
//       user.registeredEvents.push(eventId);

//       await event.save();
//       await user.save();

//       res.json({ message: "Successfully registered for the event", event, user });
//     } catch (error) {
//       res.status(500).json({ message: "Error registering for event", error: error.message });
//     }
//   },

//   // Get all events a user has registered for
//   getUserEvents: async (req, res) => {
//     try {
//       const { userId } = req.params;

//       // Find the user by ID and populate their registered events
//       const user = await User.findById(userId).populate("registeredEvents", "-__v");

//       if (!user) {
//         return res.status(404).json({ message: "User not found" });
//       }

//       res.json(user.registeredEvents);
//     } catch (error) {
//       res.status(500).json({ message: "Error fetching events", error: error.message });
//     }
//   }
// };

// module.exports = visitorController;
