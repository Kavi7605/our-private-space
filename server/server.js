const express = require('express');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(bodyParser.json());

mongoose.connect('mongodb://localhost:27017/our-private-space', { useNewUrlParser: true, useUnifiedTopology: true });

const userSchema = new mongoose.Schema({
    email: { type: String, unique: true },
    password: String,
    nickname: String,
    age: Number,
    gender: String,
    birthdate: Date,
    uniqueCode: { type: String, unique: true }
});

const User = mongoose.model('User ', userSchema);

// Signup
app.post('/signup', async (req, res) => {
    const { email, password, nickname, age, gender, birthdate } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    const uniqueCode = Math.random().toString(36).substring(2, 8); // Generate a unique code

    const user = new User({ email, password: hashedPassword, nickname, age, gender, birthdate, uniqueCode });
    await user.save();
    res.status(201).send({ message: 'User  created', uniqueCode });
});

// Signin
app.post('/signin', async (req, res) => {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user || !(await bcrypt.compare(password, user.password))) {
        return res.status(401).send('Invalid credentials');
    }
    const token = jwt.sign({ id: user._id }, 'secret', { expiresIn: '1h' });
    res.send({ token, user });
});

// Connect Users
app.post('/connect', async (req, res) => {
    const { userId, partnerCode } = req.body;
    const partner = await User.findOne({ uniqueCode: partnerCode });
    if (!partner) return res.status(404).send('Partner not found');
    
    // Logic to connect users (e.g., save partner ID in user profile)
    // This part needs to be implemented based on your data structure
    res.send('Users connected');
});

app.listen(3000, () => {
    console.log('Server running on http://localhost:3000');
});