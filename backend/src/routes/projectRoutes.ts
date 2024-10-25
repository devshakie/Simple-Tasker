import { Router } from "express";
import { createProject, updateProject, getProjectsByTeamId } from "../controllers/ProjectController";

const router = Router();

// Route to create a new project
router.post("/:teamId", createProject);

// Route to update an existing project
router.put("/:projectId", updateProject);

// Route to get projects by team ID
router.get("/:teamId/projects", getProjectsByTeamId);

export default router;