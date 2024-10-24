"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const TeamController_1 = require("../controllers/TeamController");
const authMiddleware_1 = require("../middlewares/authMiddleware");
const router = (0, express_1.Router)();
// Route to create a team (requires authentication)
router.post('/', authMiddleware_1.authMiddleware, TeamController_1.createTeam);
// Route to join a team (requires authentication)
router.post('/join', authMiddleware_1.authMiddleware, TeamController_1.joinTeam);
exports.default = router;
