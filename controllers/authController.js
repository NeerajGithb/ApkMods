const jwt = require('jsonwebtoken');
const {
    signupSchema,
    signinSchema,
} = require('../middlewares/validator');

const User = require('../models/usersModel')
const { doHash, doHashValidation, hmacProcess } = require('../utils/hashing');

exports.signup = async (req, res) => {
    const { email, password } = req.body;

    try {
        const { error, value } = signupSchema.validate({ email, password });

        if (error) {
            return res
                .status(401)
                .json({ success: false, message: error.details[0].message });
        }
        const existingUser = await User.findOne({ email });

        if (existingUser) {
            return res
                .status(401)
                .json({ success: false, message: 'User already exists!' });
        }

        const hashedPassword = await doHash(password, 12);

        const newUser = new User({
            email,
            password: hashedPassword
        })

        const result = await newUser.save();
        result.password = undefined;

        res.status(201).json({
            success: true,
            message: 'Your account has been created successfully',
            result,
        });
    } catch (error) {
        console.log(error);
    }
}

exports.signin = async (req, res) => {
    const { email, password } = req.body;

    try {
        const { error, value } = signinSchema.validate({ email, password });

        if (error) {
            return res
                .status(401)
                .json({ success: false, message: error.details[0].message });
        }

        const existingUser = await User.findOne({ email }).select('+password');
        if (!existingUser) {
            return res
                .status(401)
                .json({ success: false, message: 'User does not exists!' });
        }
        const result = await doHashValidation(password, existingUser.password);
        if (!result) {
            return res
                .status(401)
                .json({ success: false, message: 'Wrong Password!' });
        }

        const token = jwt.sign(
            {
                userId: existingUser._id,
                email: existingUser.email,
                verified: existingUser.verified,
            },
            process.env.TOKEN_SECRET,
            {
                expiresIn: '8h',
            }
        );
        res
            .cookie('token', token, {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                sameSite: 'None',
                maxAge: 8 * 60 * 60 * 1000,
            })
            .json({
                success: true,
                message: 'logged in successfully',
                token, 
            });
    } catch (error) {
        console.log(error);
    }
}

exports.signout = async (req, res) => {
    res.clearCookie('token', {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'None',
    });
    res.status(200).json({ success: true, message: 'Logged out successfully' });
};

exports.getMe = async (req, res) => {
    try {
        const user = await User.findById(req.user.userId).select('-password');
        if (!user) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }

        res.status(200).json({ success: true, user });
    } catch (error) {
        console.log(error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
};
