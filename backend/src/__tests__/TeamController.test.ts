import { Request, Response } from "express";
import { joinTeam, createTeam, getAllTeams } from "../controllers/TeamController";
import { getXataClient } from "../xata"; // Adjust the import based on your project structure

jest.mock("../xata");

const mockXataClient = getXataClient();
const req = {} as Request;
const res = {
  status: jest.fn().mockReturnThis(),
  json: jest.fn().mockReturnThis(),
} as unknown as Response;

beforeEach(() => {
  jest.clearAllMocks();
});

describe("TeamController Tests", () => {
  
  describe("joinTeam", () => {
    it("should successfully join a team", async () => {
      req.body = { teamId: "team_id_1" };
      (req as any).user = { id: "user_id_1" };
      mockXataClient.db.Team.read.mockResolvedValueOnce({ id: "team_id_1", members: [] });

      await joinTeam(req, res);

      expect(res.json).toHaveBeenCalledWith({ message: "Successfully joined the team" });
      expect(mockXataClient.db.Team.update).toHaveBeenCalledWith("team_id_1", {
        members: ["user_id_1"],
      });
    });

    it("should return 404 if the team is not found", async () => {
      req.body = { teamId: "team_id_1" };
      (req as any).user = { id: "user_id_1" };
      mockXataClient.db.Team.read.mockResolvedValueOnce(null);

      await joinTeam(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ message: "Team not found" });
    });

    it("should return 400 if the user is already a member", async () => {
      req.body = { teamId: "team_id_1" };
      (req as any).user = { id: "user_id_1" };
      mockXataClient.db.Team.read.mockResolvedValueOnce({ id: "team_id_1", members: ["user_id_1"] });

      await joinTeam(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ message: "You are already a member of this team" });
    });

    it("should handle server error", async () => {
      req.body = { teamId: "team_id_1" };
      (req as any).user = { id: "user_id_1" };
      mockXataClient.db.Team.read.mockResolvedValueOnce({ id: "team_id_1", members: [] });
      mockXataClient.db.Team.update.mockRejectedValueOnce(new Error("Server error"));

      await joinTeam(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ message: "Server error" });
    });
  });

  describe("createTeam", () => {
    it("should create a new team", async () => {
      req.body = { name: "New Team", description: "Team description" };
      (req as any).user = { id: "admin_id_1" };
      mockXataClient.db.Team.create.mockResolvedValueOnce({ id: "team_id_1", ...req.body, adminId: "admin_id_1" });

      await createTeam(req, res);

      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
        id: "team_id_1",
        name: req.body.name,
      }));
    });

    it("should handle server error while creating a team", async () => {
      req.body = { name: "New Team", description: "Team description" };
      (req as any).user = { id: "admin_id_1" };
      mockXataClient.db.Team.create.mockRejectedValueOnce(new Error("Server error"));

      await createTeam(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ message: "Server error" });
    });
  });

  describe("getAllTeams", () => {
    it("should return all teams", async () => {
      const mockTeams = [
        { id: "team_id_1", name: "Team One", description: "First team", adminId: "admin_id_1", members: [] },
        { id: "team_id_2", name: "Team Two", description: "Second team", adminId: "admin_id_2", members: [] },
      ];
      mockXataClient.db.Team.getAll.mockResolvedValueOnce(mockTeams);

      await getAllTeams(req, res);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(mockTeams);
    });

    it("should return 404 if no teams are found", async () => {
      mockXataClient.db.Team.getAll.mockResolvedValueOnce([]);

      await getAllTeams(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ message: "No teams found" });
    });

    it("should handle server error", async () => {
      mockXataClient.db.Team.getAll.mockRejectedValueOnce(new Error("Server error"));

      await getAllTeams(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ message: "Server error" });
    });
  });
});
