import { Router, Request, Response } from 'express';
import prisma from "../../prisma/prisma";
import { authMiddleware, AuthRequest } from "../middleware/auth";

const router = Router();

// Post /api/recipes/:id/favorite
// Lisää resepti käyttäjän suosikkeihin

router.post(
    "/recipes/:id/favorite",
    authMiddleware,
    async(req: AuthRequest, res: Response) => {
        const recipeId = parseInt(req.params.id);
        //const userId = (req as any).user.id;    // tyypitetty req.user auth-middlewaresta

        if(isNaN(recipeId)){
            return res.status(400).json({ error: "Invalid ID" });
        }

        // authMiddleware on toisena parametrina jokaisessa reitissä reitti on JWT:llä suojattu
        // Käytetään req: AuthRequest jotta TypeScript tietää että req.user voi olla olemassa
        // Tarkistetaan if(!userId) varmuuden vuoksi, vaikka authMiddleware hoitaa sen
        const userId = req.user?.id;
        if(!userId){
            return res.status(401).json({ error: "Unauthorized" });
        }
        
        try{
            // Tarkista että resepti on olemassa
            const recipe = await prisma.recipe.findUnique({
                where: { id: recipeId },
            });

            if(!recipe){
                return res.status(404).json({ error: "Recipe not found" });
            }

            // Luo suosikki jos ei vielä ole (uniikki userId + recipeId) (upsert, ettei tule duplikaattia)
            await prisma.favorite.upsert({
                where:{
                    userId_recipeId:{
                        userId,
                        recipeId
                    },
                },
                update:{},  // ei tarvitse päivittää mitään
                create:{
                    userId,
                    recipeId,
                },
            });
            return res.status(200).json({ message: "Recipe favorited successfully" });
        }
        catch(error)
        {
            console.error("Error favoriting recipe:", error);
            return res.status(500).json({ error: "Failed to add favorite" });
        }
    }
);

// DELETE /api/recipes/:id/favorite
// Poista resepti käyttäjän suosikeista
router.delete(
    "/recipes/:id/favorite",
    authMiddleware,
    async(req: AuthRequest, res: Response) =>{
        const recipeId = Number(req.params.id);
        //const userId = (req as any).user.id;

        if(isNaN(recipeId)){
            return res.status(400).json({ error: "Invalid recipe ID" });
        }

        const userId = req.user?.id;
        if(!userId){
            return res.status(401).json({ error: "Unauthorized" });
        }

        try{
            await prisma.favorite.delete({
                where:{
                    userId_recipeId:{
                        userId,
                        recipeId,
                    },
                },
            });

            // 204 = No Content
            return res.status(204).send();
        }
        catch(error){
            console.error("Error removing favorite:", error);
            return res.status(404).json({ error: "Favorite not found" });
        }
    }
);

// GET /api/users/me/favorites
// Hakee kirjautuneen käyttäjän suosikit (reseptit mukana)

router.get(
    "/users/me/favorites",
    authMiddleware,
    async(req: AuthRequest, res: Response) =>{
        const userId = req.user?.id;
        if(!userId){
            return res.status(401).json({ error: "Unauthorized" });
        }

        try{
            const favorites = await prisma.favorite.findMany({
                where:{ userId },
                include:{
                    recipe:true,    // palautetaan resepti mukana
                },
                orderBy:{
                    createdAt: "desc",
                },
            });
            return res.json(favorites);
        }
        catch(error)
        {
            console.error("Error fetching favorites:", error);
            return res.status(500).json({ error: "Failed to fetch favorites" });
        }
    }
);

export default router;