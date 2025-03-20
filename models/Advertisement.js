const mongoose = require('mongoose');
const AutoIncrement = require("mongoose-sequence")(mongoose);

const advertisementSchema = new mongoose.Schema({
    adNo: {
        type: Number,
        unique: true
    },
    title: {
        type: String,
        required: true,
        trim: true
    },
    description: {
        type: String,   
        required: true,
        trim: true
    },
    image: {
        type: String,
        required: true
    },
    link: {
        type: String,
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});


advertisementSchema.plugin(AutoIncrement, { inc_field: "adNo" });
const Advertisement = mongoose.model('Advertisement', advertisementSchema);

module.exports = Advertisement;