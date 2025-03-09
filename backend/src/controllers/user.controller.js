import { User } from "../models/user.model.js";
import { generateToken } from "../utils/jwt.js";
import bcrypt from "bcryptjs";

// Register a new user
const registerUser = async (req, res) => {
    try {
        const { name, age, dateOfBirth, password, gender, about } = req.body;
        const trimmedName = name?.trim();
        const trimmedAbout = about?.trim();

        // Validate required fields
        if (!trimmedName || !dateOfBirth?.trim() || !password || !gender?.trim()) {
            return res.status(400).json({ success: false, message: "All required fields must be provided." });
        }

        // Validate name length
        if (trimmedName.length < 2) {
            return res.status(400).json({ success: false, message: "Name must be at least 2 characters." });
        }

        // Validate date of birth
        const birthDate = new Date(dateOfBirth);
        const today = new Date();
        if (isNaN(birthDate.getTime()) || birthDate > today) {
            return res.status(400).json({ success: false, message: "Invalid date of birth." });
        }

        // Calculate age from date of birth
        let calculatedAge = today.getFullYear() - birthDate.getFullYear();
        const monthDiff = today.getMonth() - birthDate.getMonth();
        const dayDiff = today.getDate() - birthDate.getDate();
        if (monthDiff < 0 || (monthDiff === 0 && dayDiff < 0)) calculatedAge--;

        // Validate age
        if (calculatedAge < 0 || calculatedAge > 120 || calculatedAge !== age) {
            return res.status(400).json({ success: false, message: "Invalid age." });
        }

        // Validate password complexity
        if (password.length < 10 || !/(?=.*[A-Za-z])(?=.*\d)(?=.*[!@#$%^&*])/.test(password)) {
            return res.status(400).json({ success: false, message: "Password must be at least 10 characters and include a letter, number, and special character." });
        }

        // Check if user already exists
        const existingUser = await User.findOne({ name: trimmedName, dateOfBirth });
        if (existingUser) {
            return res.status(400).json({ success: false, message: "User already exists." });
        }

        // Hash password and create new user
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);
        const newUser = new User({
            name: trimmedName,
            age: calculatedAge,
            dateOfBirth,
            about: trimmedAbout,
            gender,
            password: hashedPassword
        });

        await newUser.save();
        generateToken(newUser._id, res);

        const createdUser = await User.findById(newUser._id).select("-password");
        return res.status(201).json({ success: true, createdUser, message: "User registered successfully." });

    } catch (error) {
        console.error("Error in registerUser:", error);
        return res.status(500).json({ success: false, message: error.message || "Registration failed. Please try again later." });
    }
};

// Login user
const login = async (req, res) => {
    const { name, dateOfBirth, password } = req.body;

    try {
        if (!name?.trim() || !dateOfBirth?.trim() || !password) {
            return res.status(400).json({ success: false, message: "All fields are required." });
        }

        // Find user and validate credentials
        const user = await User.findOne({ name: name.trim(), dateOfBirth });
        if (!user) {
            return res.status(401).json({ success: false, message: "User does not exist!" });
        }

        const isPasswordCorrect = await bcrypt.compare(password, user.password);
        if (!isPasswordCorrect) {
            return res.status(401).json({ success: false, message: "Invalid credentials!" });
        }

        generateToken(user._id, res);

        return res.status(200).json({
            success: true,
            user: {
                _id: user._id,
                name: user.name,
                dateOfBirth: user.dateOfBirth,
                age: user.age,
                about: user.about,
                gender: user.gender,
            },
            message: "Login successful."
        });

    } catch (error) {
        console.error("Error in login:", error.message);
        return res.status(500).json({ success: false, message: "Login failed. Please try again later." });
    }
};

// Fetch user details
const getUser = async (req, res) => {
    try {
        const user = await User.findById(req.user._id).select("-password");
        if (!user) {
            return res.status(404).json({ success: false, message: "User not found." });
        }
        return res.status(200).json({ success: true, user });

    } catch (error) {
        console.error("Error in getUser:", error.message);
        return res.status(500).json({ success: false, message: "Failed to fetch user details." });
    }
};

// Update user details
const updateDetails = async (req, res) => {
    try {
        const { about, password } = req.body;
        const user = await User.findById(req.user._id);
        if (!user) {
            return res.status(404).json({ success: false, message: "User not found." });
        }
        if (about?.trim()) user.about = about.trim();
        if (password) {
            const salt = await bcrypt.genSalt(10);
            user.password = await bcrypt.hash(password, salt);
        }

        await user.save();
        const updatedUser = await User.findById(req.user._id).select("-password");
        return res.status(200).json({ success: true, user: updatedUser, message: "Details updated successfully." });
    } catch (error) {
        console.error("Error in updateDetails:", error.message);
        return res.status(500).json({ success: false, message: "Failed to update user details." });
    }
};

// Delete user account
const deleteUser = async (req, res) => {
    try {
        if (!req.user || !req.user._id) {
            return res.status(400).json({ success: false, message: "User ID is required" });
        }

        const userId = req.user._id;
        const result = await User.findByIdAndDelete(userId);

        if (!result) {
            return res.status(404).json({ success: false, message: "User not found" });
        }

        res.json({ success: true, message: "User deleted successfully" });
    } catch (error) {
        console.error("Error in deleteUser:", error);
        res.status(500).json({ success: false, message: "Server error" });
    }
};

// Logout user by clearing JWT cookie
const logout = (req, res) => {
    res.cookie("jwt", "", { httpOnly: true, secure: true, sameSite: "strict", maxAge: 0 });
    return res.status(200).json({ success: true, message: "Logged out successfully." });
};

// Fetch gender options
const getGenders = (req, res) => {
    try {
        const genders = ["Male", "Female", "Other"];
        return res.status(200).json({ success: true, genders });
    } catch (error) {
        console.error("Error in getGenders:", error.message);
        return res.status(500).json({ success: false, message: "Failed to fetch gender options." });
    }
};

export { registerUser, login, updateDetails, deleteUser, logout, getUser, getGenders };