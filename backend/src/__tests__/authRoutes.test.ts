import request from "supertest";
import express from "express";
import authRoutes from "../routes/authRoutes";
import { register, login } from "../controllers/AuthController";

jest.mock("../controllers/AuthController");

const app = express();
app.use(express.json());
app.use("/api/auth", authRoutes);

describe("Auth Routes", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("POST /register", () => {
    it("should register a user successfully", async () => {
      (register as jest.Mock).mockImplementation((req, res) => {
        res.status(201).json({ message: "User registered" });
      });

      const response = await request(app)
        .post("/api/auth/register")
        .send({
          name: "John Doe",
          email: "john@example.com",
          password: "password123",
          role: "Admin",
        });

      expect(response.status).toBe(201);
      expect(response.body).toEqual({ message: "User registered" });
      expect(register).toHaveBeenCalled(); // Ensure register is called
    });

    it("should return 400 if validation fails", async () => {
      const response = await request(app)
        .post("/api/auth/register")
        .send({
          name: "",
          email: "not-an-email",
          password: "123",
          role: "Invalid Role",
        });

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty("errors"); // Expect errors from validation
      expect(register).not.toHaveBeenCalled(); // Ensure register is not called
    });
  });

  describe("POST /login", () => {
    it("should log in a user successfully", async () => {
      (login as jest.Mock).mockImplementation((req, res) => {
        res.status(200).json({ token: "jwt_token" });
      });

      const response = await request(app)
        .post("/api/auth/login")
        .send({
          email: "john@example.com",
          password: "password123",
        });

      expect(response.status).toBe(200);
      expect(response.body).toEqual({ token: "jwt_token" });
      expect(login).toHaveBeenCalled(); // Ensure login is called
    });

    it("should return 401 if login fails", async () => {
      (login as jest.Mock).mockImplementation((req, res) => {
        res.status(401).json({ message: "Invalid credentials" });
      });

      const response = await request(app)
        .post("/api/auth/login")
        .send({
          email: "john@example.com",
          password: "wrongpassword",
        });

      expect(response.status).toBe(401);
      expect(response.body).toEqual({ message: "Invalid credentials" });
      expect(login).toHaveBeenCalled(); // Ensure login is called
    });
  });
});
