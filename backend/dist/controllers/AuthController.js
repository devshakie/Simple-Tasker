"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.adminMiddleware = exports.authMiddleware = exports.login = exports.register = void 0;
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const xata_1 = require("../xata"); // Import the Xata client
const express_validator_1 = require("express-validator");
const xata = (0, xata_1.getXataClient)();
const JWT_SECRET = process.env.JWT_SECRET || "your_jwt_secret";
// Register a new user
const register = async (req, res, next) => {
    const errors = (0, express_validator_1.validationResult)(req);
    if (!errors.isEmpty()) {
        res.status(400).json({ errors: errors.array() });
    }
    const { name, email, password, role } = req.body;
    try {
        // Check if user already exists
        const existingUser = await xata.db.User.filter({ email }).getFirst();
        if (existingUser) {
            res.status(400).json({ message: "User already exists" });
        }
        // Hash the password
        const hashedPassword = await bcryptjs_1.default.hash(password, 10);
        // Create new user
        const newUser = await xata.db.User.create({
            name,
            email,
            password: hashedPassword,
            role,
        });
        // Generate JWT token
        const token = jsonwebtoken_1.default.sign({ id: newUser.id, role: newUser.role }, JWT_SECRET, {
            expiresIn: "1h",
        });
        res.status(201).json({ token });
    }
    catch (err) {
        next(err); // Pass the error to the error handler
    }
};
exports.register = register;
// Login a user
const login = async (req, res, next) => {
    const { email, password } = req.body;
    try {
        // Find the user by email
        const user = await xata.db.User.filter({ email }).getFirst();
        // If user is null or password is missing, send an error response
        if (!user || !user.password) {
            res.status(400).json({ message: "Invalid credentials" });
        }
        else {
            // Compare password
            const isMatch = await bcryptjs_1.default.compare(password, user.password);
            if (!isMatch) {
                res.status(400).json({ message: "Invalid credentials" });
            }
            else {
                // Generate JWT token
                const token = jsonwebtoken_1.default.sign({ id: user.id, role: user.role }, JWT_SECRET, {
                    expiresIn: "1h",
                });
                res.json({ token });
            }
        }
    }
    catch (err) {
        next(err); // Pass the error to the error handler
    }
};
exports.login = login;
// Middleware to protect routes
const authMiddleware = (req, res, next) => {
    const token = req.header("Authorization")?.replace("Bearer ", "");
    if (!token) {
        res.status(401).json({ message: "No token, authorization denied" });
    }
    else {
        try {
            const decoded = jsonwebtoken_1.default.verify(token, JWT_SECRET);
            req.user = decoded;
            next();
        }
        catch (err) {
            res.status(401).json({ message: "Token is not valid" });
        }
    }
};
exports.authMiddleware = authMiddleware;
// Middleware to restrict access to admin users
const adminMiddleware = (req, res, next) => {
    const user = req.user;
    if (!user || user.role !== "Admin") {
        res.status(403).json({ message: "Admin access only" });
    }
    next();
};
exports.adminMiddleware = adminMiddleware;
