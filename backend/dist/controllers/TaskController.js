"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.addComment = exports.updateTask = exports.createTask = void 0;
const xata_1 = require("../xata"); // Import the Xata client
const xata = (0, xata_1.getXataClient)();
// Create a new task
const createTask = async (req, res) => {
    const { description, status, dueDate, projectId, assignedToId } = req.body;
    try {
        const project = await xata.db.Project.read(projectId);
        if (!project) {
            res.status(404).json({ message: "Project not found" });
        }
        const task = await xata.db.Task.create({
            description,
            status,
            dueDate,
            projectId,
            assignedToId,
        });
        res.status(201).json(task);
    }
    catch (err) {
        res.status(500).json({ message: "Server error" });
    }
};
exports.createTask = createTask;
// Update a task
const updateTask = async (req, res) => {
    const { taskId } = req.params;
    const { description, status, dueDate, assignedToId } = req.body;
    try {
        const task = await xata.db.Task.update(taskId, {
            description,
            status,
            dueDate,
            assignedToId,
        });
        if (!task) {
            res.status(404).json({ message: "Task not found" });
        }
        res.json(task);
    }
    catch (err) {
        res.status(500).json({ message: "Server error" });
    }
};
exports.updateTask = updateTask;
// Add a comment to a task
const addComment = async (req, res) => {
    const { taskId, content } = req.body;
    const userId = req.user.id;
    try {
        const task = await xata.db.Task.read(taskId);
        if (!task) {
            res.status(404).json({ message: "Task not found" });
        }
        const comment = await xata.db.Comment.create({
            content,
            taskId,
            userId,
        });
        res.status(201).json(comment);
    }
    catch (err) {
        res.status(500).json({ message: "Server error" });
    }
};
exports.addComment = addComment;
