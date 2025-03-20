const router = require('express').Router()
const eventController = require('../controllers/eventController')



router.post('/create',eventController.createEvent)
router.delete('/delete/:id',eventController.deleteEvent)
router.put('/update/:id',eventController.updateEvent)
router.get('/events',eventController.getEvent)
router.get('/future-events',eventController.getFutureEvents)

module.exports = router