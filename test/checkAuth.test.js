import { loginUser } from "../config/checkAuth";
import connectDB from "../config/database";
import mongoose from "mongoose";
const User = require("../models/user");

const jwt = require("jsonwebtoken");

jest.mock("../models/user");
jest.mock("bcrypt");
const bcrypt = require("bcrypt");
jest.mock("jsonwebtoken");



describe("Login User tests", () => {
    let req, res;

    beforeEach(() => {
        req = {
            body: { email: "", password: "" },
        };

        res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
            cookie: jest.fn(),
        };
    });

    test("fails to login due to non existing user", async () => {
        req.body = { email: "bademail@email.com", password: "badpassword" };

        User.findOne.mockResolvedValue(null);

        await loginUser(req, res);

        expect(res.status).toHaveBeenCalledWith(401);
        expect(res.json).toHaveBeenCalledWith({ error: "Credenciales inválidas" });
    });

    test("fails to login due to incorrect password", async () => {
        req.body = { email: "user@email.com", password: "wrongpassword" };

        User.findOne.mockResolvedValue({
            email: "user@email.com",
            password: "hashedPassword",
        });

        bcrypt.compare.mockResolvedValue(false);

        await loginUser(req, res);

        expect(res.status).toHaveBeenCalledWith(401);
        expect(res.json).toHaveBeenCalledWith({ error: "Credenciales inválidas" });
    });

    test("successful login with test credentials", async () => {
        req.body = { email: "testuser@email.com", password: "correctpassword" };
        res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
            cookie: jest.fn()
        };
    
        User.findOne.mockResolvedValue({
            _id: "123456",
            name: "Test User",
            email: "testuser@email.com",
            password: "hashedPassword",
            plan: "pro",
        });
    
        jwt.sign.mockReturnValue("mocked-jwt-token");
        bcrypt.compare.mockResolvedValue(true);

        await loginUser(req, res);
    
        expect(res.json).toHaveBeenCalledWith({
            message: "Login exitoso",
            token: "mocked-jwt-token",
            user: {
                name: "Test User",
                email: "testuser@email.com",
                plan: "pro",
            },
        });
    });

    
});
