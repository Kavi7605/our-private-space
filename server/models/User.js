const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    nickname: String,
    age: Number,
    gender: String,
    birthdate: Date,
    uniqueCode: { type: String, unique: true },
    partnerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    loveLetter: String,
});

module.exports = mongoose.model('User', userSchema);