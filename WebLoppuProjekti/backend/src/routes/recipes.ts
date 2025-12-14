import { Router, Request, Response } from 'express';
import  prisma  from "../../prisma/prisma";   // <-- tärkeä
import { authMiddleware, AuthRequest } from "../middleware/auth";

const router = Router();

/**
 * @swagger
 * components:
 *   schemas:
 *     Recipe:
 *       type: object
 *       required:
 *         - title
 *         - ingredients
 *         - instructions
 *       properties:
 *         id:
 *           type: integer
 *         title:
 *           type: string
 *         description:
 *           type: string
 *           nullable: true
 *         ingredients:
 *           type: string
 *         instructions:
 *           type: string
 *         imageUrl:
 *           type: string
 *           nullable: true
 *         createdBy:
 *           type: integer
 *           nullable: true
 *         author:
 *           type: object
 *           nullable: true
 *           properties:
 *             id:
 *               type: integer
 *             userName:
 *               type: string
 *             email:
 *               type: string
 *         createdAt:
 *           type: string
 *           format: date-time
 */

/**
 * @swagger
 * /api/recipes:
 *   get:
 *     summary: Hae kaikki reseptit
 *     tags: [Reseptit]
 *     responses:
 *       200:
 *         description: Lista kaikista resepteistä
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Recipe'
 */
router.get("/", async (req: Request, res: Response) => {
    try{
        const recipes = await prisma.recipe.findMany({
            orderBy: { createdAt: 'desc' },  // Uusimmat ensin
            include: {
                author: {
                    select: {
                        id: true,
                        userName: true,
                        email: true
                    }
                }
            }
        });
        res.json(recipes);
    }catch(error){
        console.error("Error fetching recipes:", error);
        res.status(500).json({ error: "Failed to fetch recipes" });
    }
});

/**
 * @swagger
 * /api/recipes/{id}:
 *   get:
 *     summary: Hae yksittäinen resepti
 *     tags: [Reseptit]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: Reseptin tunniste
 *     responses:
 *       200:
 *         description: Reseptin tiedot
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Recipe'
 *       400:
 *         description: Virheellinen tunniste
 *       404:
 *         description: Reseptiä ei löydetty
 */

router.get("/:id", async (req: Request, res: Response) => {
    const id = Number(req.params.id);   // Muutetaan merkkijono numeroksi

    if(isNaN(id)){
        return res.status(400).json({ error: "Invalid Id"});
    }
    try{
        const recipe = await prisma.recipe.findUnique({ 
            where: { id },
            include: {
                author: {
                    select: {
                        id: true,
                        userName: true,
                        email: true
                    }
                }
            }
        });

        if(!recipe){
            return res.status(404).json({ error: "Recipe not found"});
        }

        res.json(recipe);
    }catch(error){
        console.error("Error fetching recipe:", error);
        res.status(500).json({ error: "Failed to fetch recipe" });
    }
});

/**
 * @swagger
 * /api/recipes:
 *   post:
 *     summary: Luo uusi resepti
 *     tags: [Reseptit]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Recipe'
 *     responses:
 *       201:
 *         description: Luotu resepti
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Recipe'
 *       400:
 *         description: Virheellinen syöte
 *       401:
 *         description: Ei valtuutusta
 */

router.post("/", authMiddleware, async (req: AuthRequest, res: Response) => {
    const { title, description, ingredients, instructions, imageUrl } = req.body;
    const userId = req.user?.id;

    if (!userId) {
        return res.status(401).json({ error: "Unauthorized" });
    }

    // Validointi: title, ingredients, instruction pakollisia
    if(
        !title ||
        !ingredients ||
        !instructions ||
        typeof title !== "string" ||
        typeof ingredients !== "string" ||
        typeof instructions !== "string"
    ){
        return res.status(400).json({ error: "Invalid input"});
    }
    
    try{
        const newRecipe = await prisma.recipe.create({
            data: {
                title,
                description,
                ingredients,
                instructions,
                imageUrl,
                createdBy: userId
            },
            include: {
                author: {
                    select: {
                        id: true,
                        userName: true,
                        email: true
                    }
                }
            }
        });
        res.status(201).json(newRecipe);
    }catch(error){
        console.error("Error creating recipe:", error);
        res.status(500).json({ error: "Failed to create recipe" });
    }
});

/**
 * @swagger
 * /api/recipes/{id}:
 *   put:
 *     summary: Päivitä resepti
 *     tags: [Reseptit]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: Reseptin id
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Recipe'
 *     responses:
 *       200:
 *         description: Päivitetty resepti
 *       400:
 *         description: Virheellinen syöte tai id
 *       401:
 *         description: Ei valtuutusta
 *       403:
 *         description: Ei oikeutta muokata tätä reseptiä
 *       404:
 *         description: Reseptiä ei löydy
 */

router.put("/:id", authMiddleware, async (req: AuthRequest, res: Response) => {
    const id = Number(req.params.id);

    if(isNaN(id)){
        return res.status(400).json({ error: "Invalid Id"});
    }

    // Tarkista että resepti on olemassa ja käyttäjä on sen tekijä
    const existingRecipe = await prisma.recipe.findUnique({
        where: { id }
    });

    if (!existingRecipe) {
        return res.status(404).json({ error: "Recipe not found" });
    }

    if (existingRecipe.createdBy !== req.user?.id) {
        return res.status(403).json({ error: "You can only edit your own recipes" });
    }

    const { title, description, ingredients, instructions, imageUrl } = req.body;

    if(
        !title ||
        !ingredients ||
        !instructions ||
        typeof title !== "string" ||
        typeof ingredients !== "string" ||
        typeof instructions !== "string"
    ){
        return res.status(400).json({ error: "Invalid input"});
    }

    try{
        const updated = await prisma.recipe.update({
            where: { id },
            data: {
                title,
                description,
                ingredients,
                instructions,
                imageUrl
            },
        });
            res.json(updated);   
    }catch(error){
        console.error("Error updating recipe:", error);

        // Prisma heittää virheen jos riviä ei löydy
        return res.status(404).json({ error: "Recipe not found"});
    }
});

/**
 * @swagger
 * /api/recipes/{id}:
 *   delete:
 *     summary: Poista resepti
 *     tags: [Reseptit]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: Reseptin id
 *     responses:
 *       204:
 *         description: Poistettu
 *       400:
 *         description: Virheellinen id
 *       401:
 *         description: Ei valtuutusta
 *       403:
 *         description: Ei oikeutta poistaa tätä reseptiä
 *       404:
 *         description: Reseptiä ei löydy
 */
router.delete("/:id", authMiddleware, async (req: AuthRequest, res: Response) => {
    const id = Number(req.params.id);

    if(isNaN(id)){
        return res.status(400).json({ error: "Invalid Id"});
    }

    // Tarkista että resepti on olemassa ja käyttäjä on sen tekijä
    const existingRecipe = await prisma.recipe.findUnique({
        where: { id }
    });

    if (!existingRecipe) {
        return res.status(404).json({ error: "Recipe not found" });
    }

    if (existingRecipe.createdBy !== req.user?.id) {
        return res.status(403).json({ error: "You can only delete your own recipes" });
    }
    
    try{
        await prisma.recipe.delete({ where: { id }});
        res.status(204).send();
    }catch(error){
        console.error("Error deleting recipe:", error);
        return res.status(404).json({ error: "Recipe not found"});
    }
});

export default router;