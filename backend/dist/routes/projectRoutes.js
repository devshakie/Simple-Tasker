"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const ProjectController_1 = require("../controllers/ProjectController");
const authMiddleware_1 = require("../middlewares/authMiddleware");
const router = (0, express_1.Router)();
router.post('/', authMiddleware_1.authMiddleware, ProjectController_1.createProject);
router.put('/:projectId', authMiddleware_1.authMiddleware, ProjectController_1.updateProject);
exports.default = router;
