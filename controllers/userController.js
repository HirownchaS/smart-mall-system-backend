const { get } = require('mongoose');
const User = require('../models/User');
const { registerValidation, loginValidation} = require('../validation/userValidation');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const userAuthController = {
    
    registerUser: async (req, res) => {
        // Validate the data before creating a user
        const { error } = registerValidation(req.body);
        if (error) return res.status(400).send({ error: error.details[0].message });

        // Check if the user already exists in the database
        const emailExist = await User.findOne({ email: req.body.email });
        if (emailExist) return res.status(400).send({ error: 'Email already exists' });

        // Hash the password
        const salt = await bcrypt.genSalt(10);
        const hashPassword = await bcrypt.hash(req.body.password, salt);

        // Create a new user
        const user = new User({
            username: req.body.username,
            email: req.body.email,
            password: hashPassword,
            profile_picture: req.body.profile_picture,
        });

        try {
            const savedUser = await user.save();
            res.status(201).send({ userId: savedUser._id });
        } catch (err) {
            res.status(400).send({ error: 'Error saving user: ' + err.message });
        }
    },

    loginUser: async (req, res) => {
        // Validate the data before user login
        const { error } = loginValidation(req.body);
        if (error) return res.json({ error: error.details[0].message });

        // Check if the user exists in the database
        const user = await User.findOne({ email: req.body.email });
        if (!user) return res.status(400).json({ error: 'Email not found' });

        // Check if the password is correct
        const validPassword = await bcrypt.compare(req.body.password, user.password);
        if (!validPassword) return res.status(400).json({ error: 'Invalid password' });

        // Create and assign a token with an expiration time
        const token = jwt.sign({ _id: user._id, username:user.username }, process.env.TOKEN_SECRET, { expiresIn: '1h' });
        res.header('authtoken', token).json({ token,user });
    },
    Authentication : (req,res)=>{
        res.json(req.user)
    },

    getAllUsers: async (req, res) => {
        try {
            const users = await User.find();
            res.json(users);
        } catch (err) {
            res.status(400).send({ error: 'Error fetching users: ' + err.message });
        }
    },

    getUserById: async (req, res) => {
        try {
            const user = await User.findById(req.params.id);
            res.status(200).json(user); 
        } catch (err) {
            res.status(400).send({ error: 'Error fetching user: ' + err.message });
        }
    }


};

module.exports = userAuthController;
