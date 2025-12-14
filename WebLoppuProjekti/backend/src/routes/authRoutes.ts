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
 *   description: Käyttäjän autentikointi
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
 *     summary: Rekisteröi uusi käyttäjä
 *     description: Luo uuden käyttäjän, salaa salasanan ja palauttaa JWT-tokenin.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *               - userName
 *             properties:
 *               email:
 *                 type: string
 *                 example: käyttäjä@esimerkki.fi
 *               password:
 *                 type: string
 *                 example: salasana123
 *               userName:
 *                 type: string
 *                 example: MattMeikä
 *     responses:
 *       201:
 *         description: Käyttäjä rekisteröity onnistuneesti
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 token:
 *                   type: string
 *                   description: JWT-token
 *                 user:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: integer
 *                       description: Käyttäjän ID
 *                     email:
 *                       type: string
 *                       description: Sähköpostiosoite
 *                     userName:
 *                       type: string
 *                       description: Käyttäjänimi
 *       400:
 *         description: Sähköposti käytössä tai validointivirhe
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
 *     summary: Kirjaudu sisään
 *     description: Tarkistaa tunnukset ja palauttaa JWT-tokenin.
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
 *                 example: käyttäjä@esimerkki.fi
 *               password:
 *                 type: string
 *                 example: salasana123
 *     responses:
 *       200:
 *         description: Kirjautuminen onnistui
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 token:
 *                   type: string
 *                   description: JWT-token
 *                 user:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: integer
 *                       description: Käyttäjän ID
 *                     email:
 *                       type: string
 *                       description: Sähköpostiosoite
 *                     userName:
 *                       type: string
 *                       description: Käyttäjänimi
 *       401:
 *         description: Virheellinen sähköposti tai salasana
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

  return res.json({ token, user: { id: user.id, email: user.email, userName: user.userName } });
});

export default router;
