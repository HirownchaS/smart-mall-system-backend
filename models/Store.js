const mongoose = require("mongoose");
const AutoIncrement = require("mongoose-sequence")(mongoose);



const storeSchema = new mongoose.Schema({

    storeno: {
        type: Number,
        unique: true
    },
    name: {
        type: String,
        required: true
    },
    level: {
        type: Number,
        required: true
    },
    category: {
        type: String,
        required: true,
    },
    img: {
        type: String,
        required: true
    },
    rating: {
        type: Number,
        required: true
    }

},{
    timestamps: true
})


storeSchema.plugin(AutoIncrement, { inc_field: "storeno" });

const Store = mongoose.model('Store', storeSchema);

module.exports = Store;