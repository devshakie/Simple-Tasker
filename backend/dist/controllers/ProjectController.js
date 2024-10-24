"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateProject = exports.createProject = void 0;
const xata_1 = require("../xata"); // Import the Xata client
const xata = (0, xata_1.getXataClient)();
// Create a new project
const createProject = async (req, res) => {
    const { name, teamId } = req.body;
    try {
        const team = await xata.db.Team.read(teamId);
        if (!team) {
            res.status(404).json({ message: "Team not found" });
        }
        const project = await xata.db.Project.create({ name, teamId });
        res.status(201).json(project);
    }
    catch (err) {
        res.status(500).json({ message: "Server error" });
    }
};
exports.createProject = createProject;
// Update an existing project
const updateProject = async (req, res) => {
    const { projectId } = req.params;
    const { name } = req.body;
    try {
        const project = await xata.db.Project.update(projectId, { name });
        if (!project) {
            res.status(404).json({ message: "Project not found" });
        }
        res.json(project);
    }
    catch (err) {
        res.status(500).json({ message: "Server error" });
    }
};
exports.updateProject = updateProject;
