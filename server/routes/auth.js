const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const router = express.Router();

// Signup
router.post('/signup', async (req, res) => {
    const { email, password, nickname, age, gender, birthdate } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    const uniqueCode = Math.random().toString(36).substring(2, 8); // Generate a unique code

    const newUser = new User({
        email,
        password: hashedPassword,
        nickname,
        age,
        gender,
        birthdate,
        uniqueCode,
    });

    await newUser.save();
    res.status(201).json({ message: 'User created', uniqueCode });
});

// Login
router.post('/login', async (req, res) => {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user || !(await bcrypt.compare(password, user.password))) {
        return res.status(401).json({ message: 'Invalid credentials' });
    }
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);
    res.json({ token, user });
});

module.exports = router;