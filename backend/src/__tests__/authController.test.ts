import { register, login, authMiddleware, adminMiddleware } from "../controllers/AuthController";
import { Request, Response, NextFunction } from "express";
import { mock } from "jest-mock-extended";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

// Mock environment variables
process.env.JWT_SECRET = "test_jwt_secret";

// Mock the getXataClient function before defining the mockXataClient
jest.mock("../xata", () => {
  return {
    getXataClient: jest.fn(),
  };
});

// Mock Xata client
const mockXataClient = {
  db: {
    User: {
      filter: jest.fn(),
      create: jest.fn(),
    }
  }
};

// Make getXataClient return the mockXataClient
const { getXataClient } = require("../xata");
(getXataClient as jest.Mock).mockReturnValue(mockXataClient);

describe('AuthController Tests', () => {
  let req: Request;
  let res: Response;
  let next: NextFunction;

  beforeEach(() => {
    req = mock<Request>();
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis(),
      send: jest.fn().mockReturnThis(),
    } as unknown as Response; // Cast to `Response` to avoid TypeScript issues
    next = jest.fn();
  });

  describe('register', () => {
    it('should register a new user', async () => {
      req.body = { name: "Test User", email: "test@example.com", password: "password", role: "User" };
      
      // Mock Xata calls
      mockXataClient.db.User.filter.mockReturnValueOnce({ 
        getFirst: jest.fn().mockResolvedValue(null) // Simulating no existing user
      });
      mockXataClient.db.User.create.mockResolvedValueOnce({ 
        id: "1", 
        name: "Test User", 
        email: "test@example.com", 
        role: "User" 
      });
      
      await register(req, res, next);

      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.send).toHaveBeenCalledWith(expect.objectContaining({
        token: expect.any(String)
      }));
    });

    it('should return 400 if user already exists', async () => {
      req.body = { name: "Test User", email: "test@example.com", password: "password", role: "User" };

      // Mock existing user
      mockXataClient.db.User.filter.mockReturnValueOnce({ 
        getFirst: jest.fn().mockResolvedValue({ email: "test@example.com" }) // Simulating user already exists
      });

      await register(req, res, next);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
        message: "User already exists"
      }));
    });
  });

  describe('login', () => {
    it('should log in an existing user', async () => {
      req.body = { email: "test@example.com", password: "password" };

      // Mock user and bcrypt comparison
      const hashedPassword = await bcrypt.hash("password", 10);
      mockXataClient.db.User.filter.mockReturnValueOnce({
        getFirst: jest.fn().mockResolvedValue({ email: "test@example.com", password: hashedPassword })
      });

      jest.spyOn(bcrypt, 'compare').mockImplementation(async (password: string, hashedPassword: string): Promise<boolean> => {
        return bcrypt.compare(password, hashedPassword);
      });

      await login(req, res, next);

      expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
        token: expect.any(String)
      }));
    });

    it('should return 400 for invalid credentials', async () => {
      req.body = { email: "invalid@example.com", password: "wrongpassword" };

      // Mock user not found
      mockXataClient.db.User.filter.mockReturnValueOnce({ 
        getFirst: jest.fn().mockResolvedValue(null) // Simulating no user found
      });

      await login(req, res, next);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
        message: "Invalid credentials"
      }));
    });
  });

  describe('authMiddleware', () => {
    it('should call next if the token is valid', () => {
      req.header = jest.fn().mockReturnValue(`Bearer valid_token`);
      jest.spyOn(jwt, 'verify').mockReturnValueOnce({ id: "user_id", role: "User" } as unknown as any); // Adjusted for TypeScript

      authMiddleware(req, res, next);

      expect(next).toHaveBeenCalled();
      expect((req as any).user).toEqual(expect.objectContaining({
        id: "user_id",
        role: "User"
      }));
    });

    it('should return 401 if token is invalid', () => {
      req.header = jest.fn().mockReturnValue(`Bearer invalid_token`);
      jest.spyOn(jwt, 'verify').mockImplementationOnce(() => { throw new Error("Invalid token") });

      authMiddleware(req, res, next);

      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.json).toHaveBeenCalledWith({ message: "Token is not valid" });
    });
  });

  describe('adminMiddleware', () => {
    it('should allow access for admin users', () => {
      (req as any).user = { id: "user_id", role: "Admin" };

      adminMiddleware(req, res, next);

      expect(next).toHaveBeenCalled();
    });

    it('should return 403 for non-admin users', () => {
      (req as any).user = { id: "user_id", role: "User" };

      adminMiddleware(req, res, next);

      expect(res.status).toHaveBeenCalledWith(403);
      expect(res.json).toHaveBeenCalledWith({ message: "Admin access only" });
    });
  });
});

