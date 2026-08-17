const User = require('../Models/Users');
const bcrypt = require('bcrypt');


//create a user
exports.createUser = async (req, res) => {
    try {
        //request body validation
        const { name, email, password, gender, phone, role} = req.body;

        //check if all required fields are provided
        if (!req.body.name || !req.body.email || !req.body.password || !req.body.gender || !req.body.phone || !req.body.role) {
            return res.status(400).json({ message: 'Please provide all required fields'});
        }

        //email check
        const existingEmail = await User.findOne({ email: req.body.email});
        if (existingEmail) {
            return res.status(400).json({ message: 'Email already exists'});
        }

        //phone number check
        const existingPhone = await User.findOne({ phone: req.body.phone});
        if (existingPhone) {
            return res.status(400).json({ message: 'Phone number already exists'});
        }

        //encrypt password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(req.body.password, salt);

        //create new user
        const user = new User({
            name: req.body.name,
            email: req.body.email,
            password: hashedPassword,
            gender: req.body.gender,
            phone: req.body.phone,
            role: req.body.role || 'user', // Default role is 'user' if not provided
            HasAdminAccess: req.body.HasAdminAccess || false //Default is false if not provided
        });

        await user.save();
        res.status(201).json({ message: 'User created successfully', user});
    } catch (error) {
        res.status(500).json({ message: 'Error creating user', error: error.message });
    }

};


//login user
exports.loginUser = async (req, res) => {
    try {
        const { email, password } =req.body;

        //check if all required fields are provided
        if (!email || !password) {
            return res.status(400).json({ message: 'please provide all required fields'});
        }

        //check if user exists
        const user = await User.findOne({ email });
        if (!User) {
            return res.status(404).json({message: 'user not found' });
        }

        //check if password is correct
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(401).json({ message: 'Invalid password' });
        }

        //generate a token (you can use JWI or any other method)
        //const token = generateToken(user); // Implement ypur token generation logic here

          //generate a token using JWT
        const jwt = require('jsonwebtoken');
        const token = jwt.sign({ id: user._id, email: user.email, name: user.name, role: user.role, HasAdminAccess: user.HasAdminAccess }, process.env.JWT_SECRET, {expiresIn: '1h'});

        res.status(200).json({ message: 'Login successful', token, role: user.role });
    } catch (error) {
        res.status(500).json({ message: 'Error logging in', error: error.message });
    }
};


