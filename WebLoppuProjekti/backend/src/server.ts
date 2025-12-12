import express, { Request, Response } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import swaggerUI from 'swagger-ui-express'; // Swagger UI
import { swaggerSpec } from './swagger'; // Swaggerin konfiguraatio
import recipesRouter from './routes/recipes'; // Reseptireitit
import authRoutes from "./routes/authRoutes"; // Auth-reitit


// Lataa .env-tiedoston ympäristömmuutujat prosessiin
dotenv.config();

// Luodaan Express-sovellus
const app = express();

// PORT-muuttuja, jos ei ole asetettuna .env:ssä => täytetään 3000
const PORT = process.env.PORT ?? 3000;  // ?? = "null coalescing operator", käytetään 3000 jos vasen puoli on null tai undefined

// Ota CORS käyttöön
app.use(cors());    // sallii pyynnöt esim. frontendistä

// Ota JSON-bodyjen käsittely käyttöön
app.use(express.json());

// Auth-reitit
app.use("/api/auth", authRoutes);

// Health check reitti
app.get('/health', (req: Request, res: Response) => {
    res.json({ status: 'OK' });
});

// Swagger UI (API-dokumentaatio osoitteessa /api-docs)
app.use("/api-docs", swaggerUI.serve, swaggerUI.setup(swaggerSpec))

// Reseptireitit
app.use('/api/recipes', recipesRouter);


// Käynnistetään palvelin
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});