import express, { Request, Response } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';


// Lataa .env-tiedoston ympäristömmuutujat prosessiin
dotenv.config();

// Luodaan Express-sovellus
const app = express();

// PORT-muuttuja, jos ei ole asetettuna .env:ssä => täytetään 3000
const PORT = process.env.PORT ?? 3000;  // ?? = "null coalescing operator", käytetään 3000 jos vasen puoli on null tai undefined

// Ota CORS käyttöön
app.use(cors());

// Ota JSON-bodyjen käsittely käyttöön
app.use(express.json());

// Health check reitti
app.get('/health', (req: Request, res: Response) => {
    res.json({ status: 'OK' });
});

// Käynnistetään palvelin
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});