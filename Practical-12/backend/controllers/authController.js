const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");

const validEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

const register = async (req, res, next) => {
    try {
        const email = typeof req.body?.email === "string" ? req.body.email.trim().toLowerCase() : "";
        const password = req.body?.password;

        if (!validEmail(email) || typeof password !== "string" || password.length < 8) {
            return res.status(400).json({ message: "Provide a valid email and a password of at least 8 characters" });
        }

        const user = await User.create({ email, password: await bcrypt.hash(password, 10) });
        return res.status(201).json({
            message: "Account created successfully",
            user: { id: user._id, email: user.email }
        });
    } catch (error) {
        if (error.code === 11000) {
            return res.status(409).json({ message: "An account with this email already exists" });
        }
        return next(error);
    }
};

const login = async (req, res, next) => {
    try {
        const email = typeof req.body?.email === "string" ? req.body.email.trim().toLowerCase() : "";
        const password = req.body?.password;
        if (!validEmail(email) || typeof password !== "string" || !password) {
            return res.status(400).json({ message: "Provide a valid email and password" });
        }

        const user = await User.findOne({ email });
        if (!user || !(await bcrypt.compare(password, user.password))) {
            return res.status(401).json({ message: "Invalid email or password" });
        }

        const token = jwt.sign({ id: user._id.toString() }, process.env.JWT_SECRET, { expiresIn: "1h" });
        return res.json({ token, user: { id: user._id, email: user.email } });
    } catch (error) {
        return next(error);
    }
};

module.exports = { register, login };