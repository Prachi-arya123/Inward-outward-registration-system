const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const User = require('../models/user.model');

// Signup Route
router.post('/signup', async (req, res) => {
    try {
        const { fullname, email, collage_email, password } = req.body;
        console.log('Received signup request:', req.body);
        
        if (!fullname || !password || (!email && !collage_email)) {
            return res.status(400).json({
                message: 'Missing required fields',
                required: ['fullname', 'password', 'email or collage_email']
            });
        }

        // Use collage_email if provided, otherwise use email
        const userEmail = collage_email || email;
        
        // Check if user already exists
        const existingUser = await User.findByEmail(userEmail);
        if (existingUser) {
            return res.status(400).json({ message: 'Email already registered' });
        }

        // Create new user
        const userId = await User.create({
            fullname,
            collage_email: userEmail,
            password
        });

        console.log('User created with ID:', userId);
        const user = await User.findById(userId);

        const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, {
            expiresIn: '24h'
        });

        res.status(201).json({
            message: 'User created successfully',
            token,
            user: {
                id: user.id,
                fullname: user.fullname,
                collage_email: user.collage_email
            }
        });
    } catch (error) {
        console.error('Signup error:', error);
        res.status(500).json({
            message: 'Error creating user',
            error: error.message,
            stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
        });
    }
});

// Login Route
router.post('/login', async (req, res) => {
    try {
        const { email, collage_email, password } = req.body;
        console.log('Received login request:', req.body);

        if (!password || (!email && !collage_email)) {
            return res.status(400).json({
                message: 'Missing required fields',
                required: ['password', 'email or collage_email']
            });
        }

        // Use collage_email if provided, otherwise use email
        const userEmail = collage_email || email;
        
        const user = await User.findByEmail(userEmail);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        const isValidPassword = await User.validatePassword(password, user.password);
        if (!isValidPassword) {
            return res.status(401).json({ message: 'Invalid password' });
        }

        const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, {
            expiresIn: '24h'
        });

        res.json({
            message: 'Login successful',
            token,
            user: {
                id: user.id,
                fullname: user.fullname,
                collage_email: user.collage_email
            }
        });
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({
            message: 'Error logging in',
            error: error.message,
            stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
        });
    }
});

// Logout Route (Client-side logout)
router.post('/logout', (req, res) => {
    res.json({ message: 'Logged out successfully' });
});

module.exports = router;
