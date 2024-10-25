import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { authMiddleware } from "../middlewares/authMiddleware";

jest.mock("jsonwebtoken");

const mockRequest = (headers: object) => ({
  header: jest.fn((name: string) => headers[name]),
}) as Request;

const mockResponse = () => {
  const res: Partial<Response> = {
    status: jest.fn().mockReturnThis(),
    json: jest.fn().mockReturnThis(),
  };
  return res as Response;
};

const mockNext = jest.fn();

describe("authMiddleware", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should return 401 if no token is provided", () => {
    const req = mockRequest({ Authorization: undefined });
    const res = mockResponse();
    const next = mockNext;

    authMiddleware(req, res, next);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({ message: "No token, authorization denied" });
    expect(next).not.toHaveBeenCalled();
  });

  it("should return 401 if JWT_SECRET is not defined", () => {
    const req = mockRequest({ Authorization: "Bearer some_token" });
    const res = mockResponse();
    const next = mockNext;
    
    process.env.JWT_SECRET = ""; // Set JWT_SECRET to undefined
    (jwt.verify as jest.Mock).mockImplementation(() => {
      throw new Error("JWT_SECRET is not defined");
    });

    authMiddleware(req, res, next);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({ message: "Token is not valid" });
    expect(next).not.toHaveBeenCalled();
  });

  it("should return 401 if the token is invalid", () => {
    const req = mockRequest({ Authorization: "Bearer invalid_token" });
    const res = mockResponse();
    const next = mockNext;
    
    process.env.JWT_SECRET = "secret_key"; // Set a valid JWT_SECRET
    (jwt.verify as jest.Mock).mockImplementation(() => {
      throw new Error("Token is not valid");
    });

    authMiddleware(req, res, next);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({ message: "Token is not valid" });
    expect(next).not.toHaveBeenCalled();
  });

  it("should call next if the token is valid", () => {
    const req = mockRequest({ Authorization: "Bearer valid_token" });
    const res = mockResponse();
    const next = mockNext;

    process.env.JWT_SECRET = "secret_key"; // Set a valid JWT_SECRET
    const mockDecoded = { id: "user_id", role: "user" };
    (jwt.verify as jest.Mock).mockReturnValue(mockDecoded); // Mock the return value of jwt.verify

    authMiddleware(req, res, next);

    expect(req.user).toEqual(mockDecoded); // Check if req.user is set
    expect(next).toHaveBeenCalled(); // Ensure next is called
  });
});
