"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authMiddleware = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const JWT_SECRET = process.env.JWT_SECRET;
const authMiddleware = (req, res, next) => {
    const token = req.header("Authorization")?.replace("Bearer ", "");
    if (!token) {
        res.status(401).json({ message: "No token, authorization denied" });
    }
    else {
        try {
            if (!JWT_SECRET) {
                throw new Error("JWT_SECRET is not defined");
            }
            const decoded = jsonwebtoken_1.default.verify(token, JWT_SECRET);
            req.user = decoded;
            next();
        }
        catch (err) {
            console.error("Token verification error:", err);
            res.status(401).json({ message: "Token is not valid" });
        }
    }
};
exports.authMiddleware = authMiddleware;
