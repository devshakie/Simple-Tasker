import { createProject, updateProject, getProjectsByTeamId } from "../controllers/ProjectController";
import { Request, Response, NextFunction } from "express";
import { mock } from "jest-mock-extended";

// Mock the Xata client
const mockXataClient = {
  db: {
    Team: {
      read: jest.fn(),
    },
    Project: {
      create: jest.fn(),
      update: jest.fn(),
      filter: jest.fn().mockReturnThis(),
      getAll: jest.fn(),
    },
  },
};

// Mock the getXataClient function
jest.mock("../xata", () => {
  return {
    getXataClient: jest.fn().mockReturnValue(mockXataClient),
  };
});

describe("ProjectController Tests", () => {
  let req: Request;
  let res: Response;
  let next: NextFunction;

  beforeEach(() => {
    req = mock<Request>();
    res = mock<Response>({
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis(),
      send: jest.fn().mockReturnThis(),
    });
    next = jest.fn();
  });

  describe("createProject", () => {
    it("should create a new project", async () => {
      req.body = { name: "New Project", teamId: "team_id_1" };

      // Mock Xata responses
      mockXataClient.db.Team.read.mockResolvedValueOnce({ id: "team_id_1" });
      mockXataClient.db.Project.create.mockResolvedValueOnce({ id: "project_id_1", name: "New Project", teamId: "team_id_1" });

      await createProject(req, res, next);

      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
        id: expect.any(String),
        name: "New Project",
        teamId: "team_id_1"
      }));
    });

    it("should return 404 if team is not found", async () => {
      req.body = { name: "New Project", teamId: "team_id_1" };

      // Mock team not found
      mockXataClient.db.Team.read.mockResolvedValueOnce(null);

      await createProject(req, res, next);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ message: "Team not found" });
    });

    it("should handle server error", async () => {
      req.body = { name: "New Project", teamId: "team_id_1" };

      // Mock server error
      mockXataClient.db.Team.read.mockRejectedValueOnce(new Error("Server error"));

      await createProject(req, res, next);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.send).toHaveBeenCalledWith({ message: "Server error" });
    });
  });

  describe("updateProject", () => {
    it("should update an existing project", async () => {
      req.params = { projectId: "project_id_1" };
      req.body = { name: "Updated Project" };

      // Mock Xata responses
      mockXataClient.db.Project.update.mockResolvedValueOnce({ id: "project_id_1", name: "Updated Project" });

      await updateProject(req, res, next);

      expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
        id: "project_id_1",
        name: "Updated Project"
      }));
    });

    it("should return 404 if project is not found", async () => {
      req.params = { projectId: "project_id_1" };
      req.body = { name: "Updated Project" };

      // Mock project not found
      mockXataClient.db.Project.update.mockResolvedValueOnce(null);

      await updateProject(req, res, next);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ message: "Project not found" });
    });

    it("should handle server error", async () => {
      req.params = { projectId: "project_id_1" };
      req.body = { name: "Updated Project" };

      // Mock server error
      mockXataClient.db.Project.update.mockRejectedValueOnce(new Error("Server error"));

      await updateProject(req, res, next);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ message: "Server error" });
    });
  });

  describe("getProjectsByTeamId", () => {
    it("should get projects by team ID", async () => {
      req.params = { teamId: "team_id_1" };

      // Mock Xata responses
      mockXataClient.db.Team.read.mockResolvedValueOnce({ id: "team_id_1" });
      mockXataClient.db.Project.filter.mockReturnValueOnce({ getAll: jest.fn().mockResolvedValueOnce([{ id: "project_id_1", name: "Project 1" }]) });

      await getProjectsByTeamId(req, res, next);

      expect(res.json).toHaveBeenCalledWith([{ id: "project_id_1", name: "Project 1" }]);
    });

    it("should return 404 if team is not found", async () => {
      req.params = { teamId: "team_id_1" };

      // Mock team not found
      mockXataClient.db.Team.read.mockResolvedValueOnce(null);

      await getProjectsByTeamId(req, res, next);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ message: "Team not found" });
    });

    it("should handle server error", async () => {
      req.params = { teamId: "team_id_1" };

      // Mock server error
      mockXataClient.db.Team.read.mockRejectedValueOnce(new Error("Server error"));

      await getProjectsByTeamId(req, res, next);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ message: "Server error" });
    });
  });
});
