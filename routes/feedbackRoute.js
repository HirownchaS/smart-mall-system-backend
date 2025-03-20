const express = require('express');
const router = express.Router();
const feedbackController = require('../controllers/feedbackController');
const authMiddleware = require('../middleware/VerifyToken'); // Adjust the path as necessary

// Route to create a new feedback
router.post('/', feedbackController.createFeedback);

// Route to get all feedback
router.get('/getAll', feedbackController.getAllFeedback);
router.get('/v1/getAlls', feedbackController.getAllFeedbacks);

// Route to get feedback by ID
router.get('/:id', feedbackController.getFeedbackById);

// Route to update feedback by ID
router.put('/update/:id', feedbackController.updateFeedbackById);

// Route to delete feedback by ID
router.delete('/delete/:id', feedbackController.deleteFeedbackById);

module.exports = router;