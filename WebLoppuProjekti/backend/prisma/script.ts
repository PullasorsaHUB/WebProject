import {prisma} from './prisma'

async function main() {

  //Remove existing data
  await prisma.recipe.deleteMany({})
  await prisma.user.deleteMany({})

  // Create a new recipe
  const recipe = await prisma.recipe.create({
    data: {
        title: 'Spaghetti Bolognese',
        description: 'A classic Italian pasta dish with rich meat sauce.',
        ingredients: 'Spaghetti, ground beef, tomato sauce, onions, garlic, olive oil, salt, pepper, Italian herbs',
        instructions: '1. Cook spaghetti according to package instructions. 2. In a pan, sauté onions and garlic in olive oil until translucent. 3. Add ground beef and cook until browned. 4. Pour in tomato sauce and season with salt, pepper, and Italian herbs. Simmer for 20 minutes. 5. Serve sauce over spaghetti.'
      },
    })
  console.log('Created recipe:', recipe)

  // Create test user

    const user = await prisma.user.create({
        data: {
            userName: 'Test User',
            email: 'test@test.com',
            passwordHash:'password123'
        },
    })
    console.log('Created user:', user)

  // Fetch all recipes
  const allRecipes = await prisma.recipe.findMany({
  })
  console.log('All recipes:', JSON.stringify(allRecipes, null, 2))

  // Fetch all users
  const allUsers = await prisma.user.findMany({
  })
  console.log('All users:', JSON.stringify(allUsers, null, 2))

}

main()
  .then(async () => {
    await prisma.$disconnect()
    console.log('Seeding finished.')
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    console.log('Seeding failed.')
    process.exit(1)
  })