import {prisma} from './prisma'

async function main() {
  // Create a new user with a post
  const recipe = await prisma.recipe.create({
    data: {
        title: 'Spaghetti Bolognese',
        description: 'A classic Italian pasta dish with rich meat sauce.',
        ingredients: 'Spaghetti, ground beef, tomato sauce, onions, garlic, olive oil, salt, pepper, Italian herbs',
        instructions: '1. Cook spaghetti according to package instructions. 2. In a pan, sauté onions and garlic in olive oil until translucent. 3. Add ground beef and cook until browned. 4. Pour in tomato sauce and season with salt, pepper, and Italian herbs. Simmer for 20 minutes. 5. Serve sauce over spaghetti.'
      },
    })
  console.log('Created recipe:', recipe)

  // Fetch all users with their posts
  const allUsers = await prisma.recipe.findMany({
  })
  console.log('All recipes:', JSON.stringify(allUsers, null, 2))
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })