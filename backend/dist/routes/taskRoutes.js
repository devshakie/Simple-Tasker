"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const TaskController_1 = require("../controllers/TaskController");
const authMiddleware_1 = require("../middlewares/authMiddleware");
const router = (0, express_1.Router)();
// Task Routes
router.post('/', authMiddleware_1.authMiddleware, TaskController_1.createTask);
router.put('/:taskId', authMiddleware_1.authMiddleware, TaskController_1.updateTask);
router.post('/:taskId/comments', authMiddleware_1.authMiddleware, TaskController_1.addComment);
