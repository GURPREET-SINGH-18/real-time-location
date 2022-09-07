const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({

    username: {
        type: String,
        required: true,
        min: 3,
        max: 20,
        unique: true
    },
    email: {
        type: String,
        require: true,
        max: 50,
        unique: true
    },
    password: {
        type: String,
        required: true,
        min: 6
    },
    role:{
        type: String,
        required: true,
    },
    hotelId:{
        type:Number,
        required: true,
    }

},{
    timestamps: true
});

module.exports = mongoose.model("User", UserSchema);