import { Router, Request, Response } from 'express';
import  prisma  from "../../prisma/prisma";   // <-- tärkeä

const router = Router();

/**
 * @swagger
 * components:
 *   schemas:
 *     Recipe:
 *       type: object
 *       required:
 *         - titleS
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
 *         createdAt:
 *           type: string
 *           format: date-time
 */

/**
 * @swagger
 * /api/recipes:
 *   get:
 *     summary: Hae kaikki reseptit
 *     tags: [Recipes]
 *     responses:
 *       200:
 *         description: Lista resepteistä
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
            orderBy: { createdAt: 'desc' }  // Uusimmat ensin
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
 *     summary: Hae resepti id:n perusteella
 *     tags: [Recipes]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: Reseptin id
 *     responses:
 *       200:
 *         description: Yksittäinen resepti
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Recipe'
 *       400:
 *         description: Virheellinen id
 *       404:
 *         description: Reseptiä ei löydy
 */

router.get("/:id", async (req: Request, res: Response) => {
    const id = Number(req.params.id);   // Muutetaan merkkijono numeroksi

    if(isNaN(id)){
        return res.status(400).json({ error: "Invalid Id"});
    }
    try{
        const recipe = await prisma.recipe.findUnique({ where: { id }});

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
 *     tags: [Recipes]
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
 */

router.post("/", async (req: Request, res: Response) => {
    const { title, description, ingredients, instructions, imageUrl } = req.body;

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
                imageUrl
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
 *     tags: [Recipes]
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
 *       404:
 *         description: Reseptiä ei löydy
 */

router.put("/:id", async (req: Request, res: Response) => {
    const id = Number(req.params.id);

    if(isNaN(id)){
        return res.status(400).json({ error: "Invalid Id"});
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
 *     tags: [Recipes]
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
 *       404:
 *         description: Reseptiä ei löydy
 */
router.delete("/:id", async (req: Request, res: Response) => {
    const id = Number(req.params.id);

    if(isNaN(id)){
        return res.status(400).json({ error: "Invalid Id"});
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