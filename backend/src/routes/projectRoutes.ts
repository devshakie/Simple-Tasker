import { Router } from "express";
import { createProject, updateProject, getProjectsByTeamId } from "../controllers/ProjectController";

const router = Router();

// Route to create a new project
router.post("/", createProject);

// Route to update an existing project
router.put("/:projectId", updateProject);

// Route to get projects by team ID
router.get("/teams/:teamId", getProjectsByTeamId);

export default router;