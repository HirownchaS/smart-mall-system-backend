const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Define the Feedback schema
const feedbackSchema = new Schema({
  storeRating: {
    store: {
      type: Schema.Types.ObjectId,
      ref: 'Store'
    },
    rating: {
      type: Number,
      min: 1,
      max: 5
    }
  },
  storeName: {  // Add store name field here
    type: String,
    required: true
  },
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  feedback: {
    type: String
  }
}, {
  timestamps: true // Adds createdAt and updatedAt fields
});

// Create the Feedback model
const Feedback = mongoose.model('Feedback', feedbackSchema);

module.exports = Feedback;
