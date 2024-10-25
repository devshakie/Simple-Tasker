import { Request, Response } from "express";
import { getXataClient } from "../xata"; // Import the Xata client
const xata = getXataClient();

// Create a new task
export const createTask = async (req: Request, res: Response) => {
  const { description, status, dueDate, projectId, assignedToId } = req.body;

  try {
    const project = await xata.db.Project.read(projectId);
    if (!project) {
      return res.status(404).json({ message: "Project not found" }); // Added return
    }

    const task = await xata.db.Task.create({
      description,
      status,
      dueDate,
      projectId,
      assignedToId,
    });

    res.status(201).json(task);
  } catch (err) {
    console.error("Error creating task:", err); // Log error
    res.status(500).json({ message: "Server error" });
  }
};

// Update a task
export const updateTask = async (req: Request, res: Response) => {
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
      return res.status(404).json({ message: "Task not found" }); // Added return
    }

    res.json(task);
  } catch (err) {
    console.error("Error updating task:", err); // Log error
    res.status(500).json({ message: "Server error" });
  }
};

// Add a comment to a task
export const addComment = async (req: Request, res: Response) => {
  const { taskId, content } = req.body;
  const userId = (req as any).user.id;

  try {
    const task = await xata.db.Task.read(taskId);
    if (!task) {
      return res.status(404).json({ message: "Task not found" }); // Added return
    }

    const comment = await xata.db.Comment.create({
      content,
      taskId,
      userId,
    });

    res.status(201).json(comment);
  } catch (err) {
    console.error("Error adding comment:", err); // Log error
    res.status(500).json({ message: "Server error" });
  }
};
