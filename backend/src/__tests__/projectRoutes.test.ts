import request from "supertest";
import express from "express";
import projectRoutes from "../routes/projectRoutes";
import { createProject, updateProject, getProjectsByTeamId } from "../controllers/ProjectController";

jest.mock("../controllers/ProjectController");

const app = express();
app.use(express.json());
app.use("/api/projects", projectRoutes);

describe("Project Routes", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("POST /", () => {
    it("should create a new project successfully", async () => {
      (createProject as jest.Mock).mockImplementation((req, res) => {
        res.status(201).json({ message: "Project created" });
      });

      const response = await request(app)
        .post("/api/projects")
        .send({
          name: "New Project",
          description: "Project description",
          teamId: "teamId123",
        });

      expect(response.status).toBe(201);
      expect(response.body).toEqual({ message: "Project created" });
      expect(createProject).toHaveBeenCalled(); // Ensure createProject is called
    });

    it("should return 400 if project data is invalid", async () => {
      const response = await request(app)
        .post("/api/projects")
        .send({
          name: "", // Invalid project name
          description: "Project description",
          teamId: "teamId123",
        });

      expect(response.status).toBe(400);
      expect(createProject).not.toHaveBeenCalled(); // Ensure createProject is not called
    });
  });

  describe("PUT /:projectId", () => {
    it("should update an existing project successfully", async () => {
      (updateProject as jest.Mock).mockImplementation((req, res) => {
        res.status(200).json({ message: "Project updated" });
      });

      const response = await request(app)
        .put("/api/projects/projectId123")
        .send({
          name: "Updated Project",
          description: "Updated description",
        });

      expect(response.status).toBe(200);
      expect(response.body).toEqual({ message: "Project updated" });
      expect(updateProject).toHaveBeenCalled(); // Ensure updateProject is called
    });

    it("should return 404 if project is not found", async () => {
      (updateProject as jest.Mock).mockImplementation((req, res) => {
        res.status(404).json({ message: "Project not found" });
      });

      const response = await request(app)
        .put("/api/projects/projectId123")
        .send({
          name: "Updated Project",
          description: "Updated description",
        });

      expect(response.status).toBe(404);
      expect(response.body).toEqual({ message: "Project not found" });
      expect(updateProject).toHaveBeenCalled(); // Ensure updateProject is called
    });
  });

  describe("GET /teams/:teamId", () => {
    it("should get projects by team ID successfully", async () => {
      (getProjectsByTeamId as jest.Mock).mockImplementation((req, res) => {
        res.status(200).json([{ id: "projectId123", name: "Project 1" }]);
      });

      const response = await request(app).get("/api/projects/teams/teamId123");

      expect(response.status).toBe(200);
      expect(response.body).toEqual([{ id: "projectId123", name: "Project 1" }]);
      expect(getProjectsByTeamId).toHaveBeenCalled(); // Ensure getProjectsByTeamId is called
    });

    it("should return 404 if no projects found for team", async () => {
      (getProjectsByTeamId as jest.Mock).mockImplementation((req, res) => {
        res.status(404).json({ message: "No projects found for this team" });
      });

      const response = await request(app).get("/api/projects/teams/teamId123");

      expect(response.status).toBe(404);
      expect(response.body).toEqual({ message: "No projects found for this team" });
      expect(getProjectsByTeamId).toHaveBeenCalled(); // Ensure getProjectsByTeamId is called
    });
  });
});
