jest.mock('bcrypt', () => require('bcryptjs')); // reemplazo para evitar errores nativos

const { registerUser, logoutUser, getUserProfile, verifyToken } = require('../config/checkAuth');
const User = require('../models/user');
const jwt = require('jsonwebtoken');

jest.mock('../models/user');
jest.mock('jsonwebtoken');

const req = { body: {}, user: {}, cookies: {}, headers: {} };
const res = {
  status: jest.fn().mockReturnThis(),
  json: jest.fn(),
  clearCookie: jest.fn(),
  cookie: jest.fn()
};

beforeEach(() => {
  jest.clearAllMocks();
});

// 1 test
test("registers a new user successfully", async () => {
  req.body = {
    name: "Nuevo Usuario",
    email: "nuevo@email.com",
    password: "123456"
  };

  // Simula que no existe usuario previo
  User.findOne.mockResolvedValue(null);

  // Simula token generado
  const token = "mocked-token";
  jwt.sign.mockReturnValue(token);

  // Mock del constructor de User para devolver una instancia falsa
  const mockSave = jest.fn().mockResolvedValue(true);

  const mockUserInstance = {
    name: "Nuevo Usuario",
    email: "nuevo@email.com",
    password: "hashed-password",
    plan: "free",
    _id: "abc123",
    save: mockSave
  };

  // Sobrescribimos la llamada a new User(...)
  User.mockImplementation(() => mockUserInstance);

  await registerUser(req, res);

  expect(mockSave).toHaveBeenCalled();
  expect(res.status).toHaveBeenCalledWith(201);
  expect(res.json).toHaveBeenCalledWith({
    message: 'Usuario registrado exitosamente',
    token,
    user: {
      name: "Nuevo Usuario",
      email: "nuevo@email.com",
      plan: "free"
    }
  });
});


// 2 test
test("logs out the user", () => {
  logoutUser(req, res);
  expect(res.clearCookie).toHaveBeenCalledWith('token');
  expect(res.json).toHaveBeenCalledWith({ message: 'Sesión cerrada exitosamente' });
});

// 3 test
test("gets user profile successfully", async () => {
  req.user = { userId: "user123" };

  const mockUser = {
    _id: "user123",
    name: "Test User",
    email: "test@email.com",
    plan: "free",
    select: jest.fn().mockResolvedValue({
      _id: "user123",
      name: "Test User",
      email: "test@email.com",
      plan: "free"
    })
  };

  User.findById = jest.fn().mockReturnValue(mockUser);

  await getUserProfile(req, res);

  expect(res.json).toHaveBeenCalledWith({
    _id: "user123",
    name: "Test User",
    email: "test@email.com",
    plan: "free"
  });
});


// 4 test
test("fails to get profile when user is not found", async () => {
  req.user = { userId: "nonexistent" };
  User.findById = jest.fn().mockReturnValue({ select: jest.fn().mockResolvedValue(null) });

  await getUserProfile(req, res);

  expect(res.status).toHaveBeenCalledWith(404);
  expect(res.json).toHaveBeenCalledWith({ error: "Usuario no encontrado" });
});


// 5 test
test("verifies token successfully", () => {
  req.user = {
    name: "Test",
    email: "test@email.com"
  };

  verifyToken(req, res);

  expect(res.json).toHaveBeenCalledWith({
    valid: true,
    user: {
      name: "Test",
      email: "test@email.com"
    }
  });
});
