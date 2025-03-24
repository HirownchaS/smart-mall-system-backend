const express = require('express');
const router = express.Router();
const parkController = require('../controllers/bookingController')

router.post('/book',parkController.createBooking);
router.get('/bookings/:userId',parkController.getBookingsByUserId);
router.get('/booked-slots', parkController.getAllParkingSlots);
router.get('/bookings', parkController.getAllBookings);
router.put('/disable/:pId', parkController.disableBooking);
router.get('/:bookingId', parkController.getBookingById);
router.put('/time/:bookingId', parkController.updateTime);
router.get('/time/:bookingId', parkController.getBookingTimeById);
router.get('/bill/:bookingId', parkController.calculateBill);



// router.put("/bookings/:bookingId/arrival", bookingController.updateArrivalTime);
// router.put("/bookings/:bookingId/departure", bookingController.updateDepartureTime);
// router.get("/bookings/:bookingId/times", bookingController.getBookingTimes);


module.exports = router