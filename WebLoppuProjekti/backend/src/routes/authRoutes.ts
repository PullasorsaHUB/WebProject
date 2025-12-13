import { Router } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import prisma from "../../prisma/prisma";

// Varmista että .env-tiedosto on ladattu
dotenv.config();

const router = Router();

/**
 * @swagger
 * tags:
 *   name: Auth
 *   description: User authentication
 */

/**
 * @swagger
 * components:
 *   securitySchemes:
 *     bearerAuth:
 *       type: http
 *       scheme: bearer
 *       bearerFormat: JWT
 */

/**
 * @swagger
 * /api/auth/register:
 *   post:
 *     tags: [Auth]
 *     summary: Register a new user
 *     description: Creates a new user, hashes password, and returns a JWT token.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 example: user@example.com
 *               password:
 *                 type: string
 *                 example: secret123
 *     responses:
 *       200:
 *         description: User successfully registered
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 token:
 *                   type: string
 *                 user:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: integer
 *                     email:
 *                       type: string
 *       400:
 *         description: Email taken or validation error
 */
router.post("/register", async (req, res) => {
  const { email, password, userName } = req.body;

  if (!email || !password)
    return res.status(400).json({ error: "Email and password are required." });

  if (!userName || userName.trim().length < 2)
    return res.status(400).json({ error: "Username is required and must be at least 2 characters." });

  if (password.length < 6)
    return res.status(400).json({ error: "Password must be at least 6 characters long." });

  const existingUser = await prisma.user.findUnique({ where: { email } });
  if (existingUser)
    return res.status(400).json({ error: "Email is already taken." });

  const hashedPassword = await bcrypt.hash(password, 10);

  const user = await prisma.user.create({
    data: { email, userName: userName.trim(), passwordHash: hashedPassword },
  });

  // Tarkista että JWT_SECRET on olemassa
  if (!process.env.JWT_SECRET) {
    return res.status(500).json({ error: "Server configuration error" });
  }

  const token = jwt.sign(
    { userId: user.id },
    process.env.JWT_SECRET,
    { expiresIn: "7d" }
  );

  return res.json({ token, user: { id: user.id, email: user.email, userName: user.userName } });
});

/**
 * @swagger
 * /api/auth/login:
 *   post:
 *     tags: [Auth]
 *     summary: Login a user
 *     description: Validates credentials and returns a JWT token.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 example: user@example.com
 *               password:
 *                 type: string
 *                 example: secret123
 *     responses:
 *       200:
 *         description: Login successful
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 token:
 *                   type: string
 *       401:
 *         description: Invalid email or password
 */
router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password)
    return res.status(400).json({ error: "Email and password are required." });

  const user = await prisma.user.findUnique({ where: { email } });

  if (!user)
    return res.status(401).json({ error: "Invalid email or password." });

  const isMatch = await bcrypt.compare(password, user.passwordHash);
  if (!isMatch)
    return res.status(401).json({ error: "Invalid email or password." });

  // Tarkista että JWT_SECRET on olemassa
  if (!process.env.JWT_SECRET) {
    return res.status(500).json({ error: "Server configuration error" });
  }

  const token = jwt.sign(
    { userId: user.id },
    process.env.JWT_SECRET,
    { expiresIn: "7d" }
  );

  return res.json({ token });
});

export default router;
