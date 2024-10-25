import request from "supertest";
import express from "express";
import teamRoutes from "../routes/teamRoutes";
import { createTeam, joinTeam, getAllTeams } from "../controllers/TeamController";
import { authMiddleware } from "../middlewares/authMiddleware";

// Mocking the authMiddleware
jest.mock("../middlewares/authMiddleware", () => ({
  authMiddleware: jest.fn((req, res, next) => next()),
}));

jest.mock("../controllers/TeamController");

const app = express();
app.use(express.json());
app.use("/api/teams", teamRoutes);

describe("Team Routes", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("POST /", () => {
    it("should create a new team successfully", async () => {
      (createTeam as jest.Mock).mockImplementation((req, res) => {
        res.status(201).json({ message: "Team created", teamId: "teamId123" });
      });

      const response = await request(app)
        .post("/api/teams")
        .send({
          name: "New Team",
          description: "Team description",
        });

      expect(response.status).toBe(201);
      expect(response.body).toEqual({ message: "Team created", teamId: "teamId123" });
      expect(createTeam).toHaveBeenCalled(); // Ensure createTeam is called
    });

    it("should return 400 if team data is invalid", async () => {
      const response = await request(app)
        .post("/api/teams")
        .send({
          name: "", // Invalid team name
          description: "Team description",
        });

      expect(response.status).toBe(400);
      expect(createTeam).not.toHaveBeenCalled(); // Ensure createTeam is not called
    });
  });

  describe("POST /join", () => {
    it("should allow a user to join a team successfully", async () => {
      (joinTeam as jest.Mock).mockImplementation((req, res) => {
        res.status(200).json({ message: "Successfully joined the team" });
      });

      const response = await request(app)
        .post("/api/teams/join")
        .send({
          teamId: "teamId123",
        });

      expect(response.status).toBe(200);
      expect(response.body).toEqual({ message: "Successfully joined the team" });
      expect(joinTeam).toHaveBeenCalled(); // Ensure joinTeam is called
    });

    it("should return 404 if team is not found", async () => {
      (joinTeam as jest.Mock).mockImplementation((req, res) => {
        res.status(404).json({ message: "Team not found" });
      });

      const response = await request(app)
        .post("/api/teams/join")
        .send({
          teamId: "nonExistentTeamId",
        });

      expect(response.status).toBe(404);
      expect(response.body).toEqual({ message: "Team not found" });
      expect(joinTeam).toHaveBeenCalled(); // Ensure joinTeam is called
    });
  });

  describe("GET /", () => {
    it("should return all teams successfully", async () => {
      (getAllTeams as jest.Mock).mockImplementation((req, res) => {
        res.status(200).json([{ id: "teamId123", name: "Team One" }]);
      });

      const response = await request(app).get("/api/teams");

      expect(response.status).toBe(200);
      expect(response.body).toEqual([{ id: "teamId123", name: "Team One" }]);
      expect(getAllTeams).toHaveBeenCalled(); // Ensure getAllTeams is called
    });

    it("should return 404 if no teams are found", async () => {
      (getAllTeams as jest.Mock).mockImplementation((req, res) => {
        res.status(404).json({ message: "No teams found" });
      });

      const response = await request(app).get("/api/teams");

      expect(response.status).toBe(404);
      expect(response.body).toEqual({ message: "No teams found" });
      expect(getAllTeams).toHaveBeenCalled(); // Ensure getAllTeams is called
    });
  });
});
