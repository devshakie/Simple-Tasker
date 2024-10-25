import request from "supertest";
import express from "express";
import taskRoutes from "../routes/taskRoutes";
import { createTask, updateTask, addComment } from "../controllers/TaskController";
import { authMiddleware } from "../middlewares/authMiddleware";

// Mocking the authMiddleware
jest.mock("../middlewares/authMiddleware", () => ({
  authMiddleware: jest.fn((req, res, next) => next()),
}));

jest.mock("../controllers/TaskController");

const app = express();
app.use(express.json());
app.use("/api/tasks", taskRoutes);

describe("Task Routes", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("POST /", () => {
    it("should create a new task successfully", async () => {
      (createTask as jest.Mock).mockImplementation((req, res) => {
        res.status(201).json({ message: "Task created" });
      });

      const response = await request(app)
        .post("/api/tasks")
        .send({
          title: "New Task",
          description: "Task description",
          teamId: "teamId123",
        });

      expect(response.status).toBe(201);
      expect(response.body).toEqual({ message: "Task created" });
      expect(createTask).toHaveBeenCalled(); // Ensure createTask is called
    });

    it("should return 400 if task data is invalid", async () => {
      const response = await request(app)
        .post("/api/tasks")
        .send({
          title: "", // Invalid task title
          description: "Task description",
          teamId: "teamId123",
        });

      expect(response.status).toBe(400);
      expect(createTask).not.toHaveBeenCalled(); // Ensure createTask is not called
    });
  });

  describe("PUT /:taskId", () => {
    it("should update an existing task successfully", async () => {
      (updateTask as jest.Mock).mockImplementation((req, res) => {
        res.status(200).json({ message: "Task updated" });
      });

      const response = await request(app)
        .put("/api/tasks/taskId123")
        .send({
          title: "Updated Task",
          description: "Updated description",
        });

      expect(response.status).toBe(200);
      expect(response.body).toEqual({ message: "Task updated" });
      expect(updateTask).toHaveBeenCalled(); // Ensure updateTask is called
    });

    it("should return 404 if task is not found", async () => {
      (updateTask as jest.Mock).mockImplementation((req, res) => {
        res.status(404).json({ message: "Task not found" });
      });

      const response = await request(app)
        .put("/api/tasks/taskId123")
        .send({
          title: "Updated Task",
          description: "Updated description",
        });

      expect(response.status).toBe(404);
      expect(response.body).toEqual({ message: "Task not found" });
      expect(updateTask).toHaveBeenCalled(); // Ensure updateTask is called
    });
  });

  describe("POST /:taskId/comments", () => {
    it("should add a comment to a task successfully", async () => {
      (addComment as jest.Mock).mockImplementation((req, res) => {
        res.status(201).json({ message: "Comment added" });
      });

      const response = await request(app)
        .post("/api/tasks/taskId123/comments")
        .send({
          comment: "This is a comment",
        });

      expect(response.status).toBe(201);
      expect(response.body).toEqual({ message: "Comment added" });
      expect(addComment).toHaveBeenCalled(); // Ensure addComment is called
    });

    it("should return 400 if comment data is invalid", async () => {
      const response = await request(app)
        .post("/api/tasks/taskId123/comments")
        .send({
          comment: "", // Invalid comment
        });

      expect(response.status).toBe(400);
      expect(addComment).not.toHaveBeenCalled(); // Ensure addComment is not called
    });
  });
});
