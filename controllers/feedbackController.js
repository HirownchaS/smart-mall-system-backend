const Feedback = require("../models/Feedback");

// Create a new feedback
exports.createFeedback = async (req, res) => {
  try {
    const { store, storeName, rating, userId, feedback } = req.body;
    const newFeedback = new Feedback({
      storeRating: {
        store,
        rating
      },
      storeName,
      userId,
      feedback
    });
    const savedFeedback = await newFeedback.save();
    res.status(201).json({
      message: 'Feedback submitted successfully',
      data: savedFeedback
    });
  } catch (error) {
    res.status(500).json({
      message: 'Failed to submit feedback',
      error: error.message
    });
  }
};

exports.getAllFeedbacks = async (req, res) => {
  try {
    const feedbacks = await Feedback.find()
      .populate("storeRating.store")
      .populate("userId");
      res.status(200).json(feedbacks);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  };

// Get all feedback or filter by store name
exports.getAllFeedback = async (req, res) => {
  try {
    const { storeName } = req.query; // Get the storeName from query parameters
    console.log("Fetching feedbacks for store:", storeName);

    // Only fetch feedbacks if storeName is provided
    if (!storeName) {
      return res.status(400).json({ message: "Store name is required" });
    }

    // Use .find() to query feedback based on storeName directly
    const feedbacks = await Feedback.find({ storeName: storeName })
      .populate("storeRating.store") // Populate store details
      .populate("userId"); // Populate user details

    // Log the number of feedbacks found
    console.log(`Found ${feedbacks.length} feedbacks for store: ${storeName}`);

    // Return the feedbacks
    res.status(200).json(feedbacks);
  } catch (error) {
    console.error("Error fetching feedbacks:", error);
    res.status(500).json({ message: error.message });
  }
};



// Get feedback by ID
exports.getFeedbackById = async (req, res) => {
  try {
    const feedback = await Feedback.findById(req.params.id)
      .populate("storeRating.store")
      .populate("userId");
    if (!feedback) {
      return res.status(404).json({ message: "Feedback not found" });
    }
    res.status(200).json(feedback);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update feedback by ID
exports.updateFeedbackById = async (req, res) => {
  try {
    const { store, storeName, rating, feedback } = req.body;
    const updatedFeedback = await Feedback.findByIdAndUpdate(
      req.params.id,
      { 
        storeRating: { store, rating },
        storeName,
        feedback
      },
      { new: true }
    );
    if (!updatedFeedback) {
      return res.status(404).json({ message: "Feedback not found" });
    }
    res.status(200).json(updatedFeedback);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Delete feedback by ID
exports.deleteFeedbackById = async (req, res) => {
  try {
    const deletedFeedback = await Feedback.findByIdAndDelete(req.params.id);
    if (!deletedFeedback) {
      return res.status(404).json({ message: "Feedback not found" });
    }
    res.status(200).json({ message: "Feedback deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};