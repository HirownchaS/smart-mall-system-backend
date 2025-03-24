const Booking = require("../models/Booking");
const ParkingSlot = require("../models/ParkingSlot");
const User = require("../models/User");
const cron = require("node-cron");

// Create a new booking
exports.createBooking = async (req, res) => {
  const { slot, carNumber, userId, arrivalTime, departureTime, bookingDate } =
    req.body;
  console.log(
    "arrival",
    arrivalTime,
    "depature",
    departureTime,
    "user",
    userId
  );

  try {
    // Check if the parking slot exists
    let parkingSlot = await ParkingSlot.findOne({ slot });

    // If the parking slot does not exist, create a new one
    if (!parkingSlot) {
      parkingSlot = new ParkingSlot({ slot, isBooked: false });
      await parkingSlot.save();
    }

    // Check if the slot is already booked
    if (parkingSlot.isBooked) {
      return res.status(400).json({ message: "Slot is already booked." });
    }

    let user = await Booking.findOne({ user: userId });
    console.log(user);

    if (!user) {
      const newBooking = new Booking({
        user: userId,
        parkingSlot: parkingSlot._id,
        carNumber: carNumber,
        bookingDate: bookingDate,
        isActive: true,
        arrivalTime: arrivalTime,
        departureTime: departureTime,
      });
      await newBooking.save(); // Save the booking record

      // Update the parking slot to mark it as booked
      parkingSlot.isBooked = true;
      await parkingSlot.save();
    } else if (!user.isActive) {
      user.isActive = true;
      user.carNumber = carNumber;
      user.parkingSlot = parkingSlot._id;
      user.bookingDate = bookingDate;
      user.arrivalTime = arrivalTime;
      user.departureTime = departureTime;

      // No need to redeclare parkingSlot, just reuse it
      parkingSlot.isBooked = true;

      await parkingSlot.save();
      await user.save();
    } else if (user.isActive) {
      return res
        .status(400)
        .json({ message: "User already has an active booking." });
    }

    res.status(200).json({ message: "Slot booked successfully." });
  } catch (error) {
    console.error("Error booking slot:", error);
    res.status(500).json({ message: "Internal server error." });
  }
};

exports.getBookingTimeById = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.bookingId);
    if (!booking) {
      return res.status(404).json({ message: "Booking not found" });
    }
    //console.log(booking);
    res.status(200).json(booking);
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

// Get a specific booking by ID
exports.getBookingById = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.bookingId)
      .populate("user")
      .populate("parkingSlot");
    if (!booking) {
      return res.status(404).json({ message: "Booking not found" });
    }
    if (!booking.isActive) {
      return res.status(404).json({ message: "Booking not found" });
    }
    //console.log(booking);
    res.status(200).json(booking);
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

// Get bookings by userId
exports.getBookingsByUserId = async (req, res) => {
  try {
    const bookings = await Booking.find({
      user: req.params.userId,
      isActive: true,
    }).populate("parkingSlot");
    // if (!bookings.length) {
    //   return res
    //     .status(404)
    //     .json({ message: "No bookings found for this user" });
    // }
    res.status(200).json(bookings);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error", error });
  }
};

// Update a booking
exports.updateBooking = async (req, res) => {
  try {
    const { carNumber, date, fromTime, hours } = req.body;

    // Find the booking
    const booking = await Booking.findById(req.params.id);
    if (!booking) {
      return res.status(404).json({ message: "Booking not found" });
    }

    // Update the booking details
    booking.carNumber = carNumber || booking.carNumber;
    booking.date = date || booking.date;
    booking.fromTime = fromTime || booking.fromTime;
    booking.hours = hours || booking.hours;

    // Calculate the total cost again if hours were updated
    if (hours) {
      const parkingSlot = await ParkingSlot.findById(booking.slot);
      booking.totalCost = parkingSlot.hourlyRate * hours;
    }

    // Save the updated booking
    await booking.save();

    res.status(200).json({ message: "Booking updated successfully", booking });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

// Delete a booking
exports.deleteBooking = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);
    if (!booking) {
      return res.status(404).json({ message: "Booking not found" });
    }

    // Update the parking slot availability
    const parkingSlot = await ParkingSlot.findById(booking.slot);
    parkingSlot.isAvailable = true;
    await parkingSlot.save();

    // Delete the booking
    await booking.remove();

    res.status(200).json({ message: "Booking deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

// Controller to get all parking slots and their booking status
exports.getAllParkingSlots = async (req, res) => {
  try {
    // Find all parking slots
    const parkingSlots = await ParkingSlot.find({ isBooked: true });

    // Fetch all bookings to cross-reference booked slots
    const bookedSlots = await Booking.find().select("parkingSlot");

    // Extract IDs of booked slots
    const bookedSlotIds = bookedSlots.map((booking) =>
      booking.parkingSlot.toString()
    );

    // Map parking slots to include booking status
    const slotsWithStatus = parkingSlots.map((slot) => {
      return {
        slotId: slot._id,
        slot: slot.slot,
        isBooked: bookedSlotIds.includes(slot._id.toString()), // Check if the slot is booked
      };
    });

    // Send response with all slots and their status
    res.status(200).json({ parkingSlots: slotsWithStatus });
  } catch (error) {
    console.error("Error fetching parking slots:", error);
    res.status(500).json({ message: "Error fetching parking slots" });
  }
};

exports.getAllBookings = async (req, res) => {
  try {
    const bookings = await Booking.find()
      .populate("parkingSlot")
      .populate("user");
    res.status(200).json(bookings);
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

exports.disableBooking = async (req, res) => {
  try {
    const id = req.params.pId;
    const time = req.body.time;

    // Log the booking ID and time for debugging
    console.log(`Booking ID: ${id}, Time: ${time}`);

    const booking = await Booking.findById(id);
    if (!booking) {
      return res.status(404).json({ message: "Booking not found" });
    }

    booking.departureTime = time;
    booking.isActive = false;

    // Ensure the parking slot is found before deletion
    await ParkingSlot.findByIdAndDelete(booking.parkingSlot);

    await booking.save();

    const bookingg = await Booking.findById(id);
    if (!booking) {
      return res.status(404).json({ message: "Booking not found" });
    }

    const arrivalTime = new Date(booking.arrivalTime);
    const departureTime = new Date(booking.departureTime);

    // Log arrival and departure times to ensure they are valid
    console.log(
      `Arrival Time: ${arrivalTime}, Departure Time: ${departureTime}`
    );

    const hours = Math.round(Math.abs(departureTime - arrivalTime) / 36e5); // Hours difference
    const hourlyRate = 100; // Replace with the actual rate if dynamic
    const totalCost = Math.round(hours * hourlyRate);

    booking.bookingFee = totalCost;
    await booking.save();
    // Log total hours and cost for debugging
    console.log(`Total Hours: ${hours}, Total Cost: ${totalCost}`);

    res.status(200).json({
      message: "Booking disabled successfully",
      totalCost,
      arrivalTime,
      departureTime,
    });
  } catch (error) {
    // Log the entire error for better understanding
    console.error("Server Error: ", error);
    res.status(500).json({ message: "Server error", error });
  }
};

exports.updateTime = async (req, res) => {
  try {
    const id = req.params.bookingId;
    const time = req.body.time;
    console.log(time);
    const booking = await Booking.findById(id);
    booking.arrivalTime = time;
    console.log(booking.arrivalTime);
    await booking.save();
    res.status(200).json({ message: "Time updated successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

exports.calculateBill = async (req, res) => {
  try {
    const id = req.params.bookingId;
    const booking = await Booking.findById(id);
    if (!booking) {
      return res.status(404).json({ message: "Booking not found" });
    }
    // const parkingSlot = await ParkingSlot.findById(booking.parkingSlot);
    const hourlyRate = 100;
    const arrivalTime = new Date(booking.arrivalTime);
    const departureTime = new Date(booking.departureTime);
    const hours = Math.abs(departureTime - arrivalTime) / 36e5;
    const totalCost = Math.round(hours * hourlyRate);

    res.status(200).json({ totalCost, arrivalTime, departureTime });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

cron.schedule("* * * * *", async () => {
  console.log("scheduler starting");

  const timeStampsSeconds = Date.now();
  const activeBookings = await Booking.find({
    isActive: true,
  }).populate("parkingSlot");

  activeBookings.forEach(async (booking) => {
    const dateTimeString = `${booking.bookingDate}T${booking.departureTime}:00`;
    const bookingTimestamp = new Date(dateTimeString).getTime();

    if (bookingTimestamp < timeStampsSeconds) {
      const parkingSlot = await ParkingSlot.findById(booking.parkingSlot._id);
      parkingSlot.isBooked = false;
      await parkingSlot.save();

      booking.isActive = false;
      await booking.save();

      console.log(`Disabled expired booking: ${booking.parkingSlot._id}`);
    } else {
      console.log(`booking not expired ${booking.parkingSlot._id}`);
    }
  });
});
