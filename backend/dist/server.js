"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const dotenv_1 = __importDefault(require("dotenv"));
// Load environment variables
dotenv_1.default.config();
const authRoutes_1 = __importDefault(require("./routes/authRoutes"));
const projectRoutes_1 = __importDefault(require("./routes/projectRoutes"));
const teamRoutes_1 = __importDefault(require("./routes/teamRoutes"));
const app = (0, express_1.default)();
const port = 8000;
app.use(express_1.default.json());
// Use the auth routes
app.use('/api/auth', authRoutes_1.default);
// Use the project routes
app.use('/api/project', projectRoutes_1.default);
// // Use the team routes
app.use('/api/teams', teamRoutes_1.default);
// Start the server
app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
});
