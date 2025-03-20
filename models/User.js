const mongoose = require('mongoose');

// Define user schema
const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        minlength: 5, 
        maxlength: 100
    },
    email: {
        type: String,
        required: true,
        minlength: 8,
        maxlength: 355
    },
    password: {
        type: String,
        required: true
    },
    role: {
        type: String,
        required: true,
        enum: ['user', 'storemanager', 'admin', 'parkingadmin'],  // Updated roles
        default: 'user'  // You can set a default role if needed
    },
    profile_picture: {
        type: String,
        default: 'https://www.khalqfoundation.org/assets/images/default.png' 
    },
    date: {
        type: Date,
        default: Date.now
    }
});

// Create a User model
module.exports = mongoose.model('User', userSchema);
