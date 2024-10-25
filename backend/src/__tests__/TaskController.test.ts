import { createTask, updateTask, addComment } from "../controllers/TaskController";
import { Request, Response } from "express";
import { getXataClient } from "../xata"; // Adjust import according to your setup

jest.mock("../xata");

const mockXataClient = getXataClient();
const req = {} as Request;
const res = {
  status: jest.fn().mockReturnThis(),
  json: jest.fn().mockReturnThis(),
  send: jest.fn().mockReturnThis(),
} as unknown as Response;

beforeEach(() => {
  jest.clearAllMocks();
});

describe("TaskController Tests", () => {
  
  describe("createTask", () => {
    it("should create a new task", async () => {
      req.body = {
        description: "New Task",
        status: "pending",
        dueDate: "2024-12-31",
        projectId: "project_id_1",
        assignedToId: "user_id_1"
      };
      mockXataClient.db.Project.read.mockResolvedValueOnce({ id: "project_id_1" });
      mockXataClient.db.Task.create.mockResolvedValueOnce({ id: "task_id_1", ...req.body });

      await createTask(req, res);
      
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
        id: "task_id_1",
        description: req.body.description,
      }));
    });

    it("should return 404 if project is not found", async () => {
      req.body = { description: "New Task", projectId: "project_id_1" };
      mockXataClient.db.Project.read.mockResolvedValueOnce(null);

      await createTask(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ message: "Project not found" });
    });
    
    it("should handle server error", async () => {
      req.body = { description: "New Task", projectId: "project_id_1" };
      mockXataClient.db.Project.read.mockResolvedValueOnce({ id: "project_id_1" });
      mockXataClient.db.Task.create.mockRejectedValueOnce(new Error("Server error"));

      await createTask(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ message: "Server error" });
    });
  });

  describe("updateTask", () => {
    it("should update an existing task", async () => {
      req.params = { taskId: "task_id_1" };
      req.body = { description: "Updated Task" };
      mockXataClient.db.Task.update.mockResolvedValueOnce({ id: "task_id_1", ...req.body });

      await updateTask(req, res);

      expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
        id: "task_id_1",
        description: req.body.description,
      }));
    });

    it("should return 404 if task is not found", async () => {
      req.params = { taskId: "task_id_1" };
      req.body = { description: "Updated Task" };
      mockXataClient.db.Task.update.mockResolvedValueOnce(null);

      await updateTask(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ message: "Task not found" });
    });
    
    it("should handle server error", async () => {
      req.params = { taskId: "task_id_1" };
      req.body = { description: "Updated Task" };
      mockXataClient.db.Task.update.mockRejectedValueOnce(new Error("Server error"));

      await updateTask(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ message: "Server error" });
    });
  });

  describe("addComment", () => {
    it("should add a comment to a task", async () => {
      req.body = { taskId: "task_id_1", content: "This is a comment" };
      (req as any).user = { id: "user_id_1" };
      mockXataClient.db.Task.read.mockResolvedValueOnce({ id: "task_id_1" });
      mockXataClient.db.Comment.create.mockResolvedValueOnce({ id: "comment_id_1", ...req.body });

      await addComment(req, res);

      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
        id: "comment_id_1",
        content: req.body.content,
      }));
    });

    it("should return 404 if task is not found", async () => {
      req.body = { taskId: "task_id_1", content: "This is a comment" };
      (req as any).user = { id: "user_id_1" };
      mockXataClient.db.Task.read.mockResolvedValueOnce(null);

      await addComment(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ message: "Task not found" });
    });
    
    it("should handle server error", async () => {
      req.body = { taskId: "task_id_1", content: "This is a comment" };
      (req as any).user = { id: "user_id_1" };
      mockXataClient.db.Task.read.mockResolvedValueOnce({ id: "task_id_1" });
      mockXataClient.db.Comment.create.mockRejectedValueOnce(new Error("Server error"));

      await addComment(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ message: "Server error" });
    });
  });
});
