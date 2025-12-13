import prisma from './prisma'
import bcrypt from 'bcryptjs';

async function main() {

  //Remove existing data
  await prisma.recipe.deleteMany({})
  await prisma.user.deleteMany({})

  // Create multiple test recipes
  const recipes = [
    {
      title: 'Spaghetti Bolognese',
      description: 'A classic Italian pasta dish with rich meat sauce.',
      ingredients: 'Spaghetti, ground beef, tomato sauce, onions, garlic, olive oil, salt, pepper, Italian herbs',
      instructions: '1. Cook spaghetti according to package instructions. 2. In a pan, sauté onions and garlic in olive oil until translucent. 3. Add ground beef and cook until browned. 4. Pour in tomato sauce and season with salt, pepper, and Italian herbs. Simmer for 20 minutes. 5. Serve sauce over spaghetti.',
      imageUrl: 'https://images.unsplash.com/photo-1551892374-ecf8754cf8b0?w=500'
    },
    {
      title: 'Chicken Tikka Masala',
      description: 'Creamy Indian curry with tender chicken pieces.',
      ingredients: 'Chicken breast, yogurt, tomatoes, cream, onion, garlic, ginger, garam masala, turmeric, cumin',
      instructions: '1. Marinate chicken in yogurt and spices. 2. Cook chicken until golden. 3. Make sauce with onions, tomatoes, and spices. 4. Add cream and cooked chicken. 5. Simmer until thick.',
      imageUrl: 'https://images.unsplash.com/photo-1565557623262-b51c2513a641?w=500'
    },
    {
      title: 'Caesar Salad',
      description: 'Fresh romaine lettuce with creamy Caesar dressing.',
      ingredients: 'Romaine lettuce, parmesan cheese, croutons, anchovies, garlic, lemon juice, olive oil, egg yolk',
      instructions: '1. Wash and chop romaine lettuce. 2. Make dressing with garlic, anchovies, lemon, and egg. 3. Toss lettuce with dressing. 4. Top with parmesan and croutons.',
      imageUrl: 'https://images.unsplash.com/photo-1546793665-c74683f339c1?w=500'
    },
    {
      title: 'Chocolate Chip Cookies',
      description: 'Soft and chewy cookies with chocolate chips.',
      ingredients: 'Flour, butter, brown sugar, white sugar, eggs, vanilla, baking soda, salt, chocolate chips',
      instructions: '1. Cream butter and sugars. 2. Add eggs and vanilla. 3. Mix in dry ingredients. 4. Fold in chocolate chips. 5. Bake at 350°F for 10-12 minutes.',
      imageUrl: 'https://images.unsplash.com/photo-1499636136210-6f4ee915583e?w=500'
    },
    {
      title: 'Thai Green Curry',
      description: 'Spicy and aromatic Thai curry with coconut milk.',
      ingredients: 'Green curry paste, coconut milk, chicken, eggplant, bamboo shoots, basil, fish sauce, palm sugar',
      instructions: '1. Heat curry paste in oil. 2. Add coconut milk gradually. 3. Add chicken and vegetables. 4. Season with fish sauce and sugar. 5. Garnish with basil.',
      imageUrl: 'https://images.unsplash.com/photo-1455619452474-d2be8b1e70cd?w=500'
    },
    {
      title: 'Margherita Pizza',
      description: 'Classic Italian pizza with tomato, mozzarella, and basil.',
      ingredients: 'Pizza dough, tomato sauce, mozzarella cheese, fresh basil, olive oil, salt',
      instructions: '1. Roll out pizza dough. 2. Spread tomato sauce. 3. Add mozzarella cheese. 4. Bake at 475°F for 12-15 minutes. 5. Garnish with fresh basil.',
      imageUrl: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?w=500'
    },
    {
      title: 'Beef Tacos',
      description: 'Mexican-style tacos with seasoned ground beef.',
      ingredients: 'Ground beef, taco shells, lettuce, tomatoes, cheese, onion, sour cream, taco seasoning',
      instructions: '1. Cook ground beef with taco seasoning. 2. Warm taco shells. 3. Fill shells with meat. 4. Top with lettuce, tomatoes, cheese, and sour cream.',
      imageUrl: 'https://images.unsplash.com/photo-1551504734-5ee1c4a1479b?w=500'
    },
    {
      title: 'Salmon Teriyaki',
      description: 'Glazed salmon with sweet and savory teriyaki sauce.',
      ingredients: 'Salmon fillets, soy sauce, mirin, sake, sugar, ginger, garlic, sesame seeds',
      instructions: '1. Make teriyaki sauce by reducing soy sauce, mirin, sake, and sugar. 2. Season salmon with salt and pepper. 3. Pan-fry salmon. 4. Glaze with teriyaki sauce.',
      imageUrl: 'https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?w=500'
    },
    {
      title: 'Greek Salad',
      description: 'Fresh Mediterranean salad with feta and olives.',
      ingredients: 'Tomatoes, cucumber, red onion, feta cheese, kalamata olives, olive oil, red wine vinegar, oregano',
      instructions: '1. Chop vegetables into chunks. 2. Add feta cheese and olives. 3. Dress with olive oil and vinegar. 4. Season with oregano and salt.',
      imageUrl: 'https://images.unsplash.com/photo-1540420773420-3366772f4999?w=500'
    },
    {
      title: 'Mushroom Risotto',
      description: 'Creamy Italian rice dish with wild mushrooms.',
      ingredients: 'Arborio rice, mixed mushrooms, vegetable stock, white wine, onion, garlic, parmesan, butter',
      instructions: '1. Sauté mushrooms separately. 2. Cook onion and garlic. 3. Add rice and toast. 4. Add wine and stock gradually. 5. Stir in mushrooms and parmesan.',
      imageUrl: 'https://images.unsplash.com/photo-1476124369491-e7addf5db371?w=500'
    },
    {
      title: 'Chicken Noodle Soup',
      description: 'Comforting soup with tender chicken and egg noodles.',
      ingredients: 'Chicken breast, egg noodles, carrots, celery, onion, chicken broth, bay leaves, thyme, parsley',
      instructions: '1. Simmer chicken in broth until cooked. 2. Remove and shred chicken. 3. Cook vegetables in broth. 4. Add noodles and shredded chicken. 5. Season and garnish.',
      imageUrl: 'https://images.unsplash.com/photo-1547592180-85f173990554?w=500'
    },
    {
      title: 'Banana Bread',
      description: 'Moist and sweet bread made with ripe bananas.',
      ingredients: 'Ripe bananas, flour, sugar, butter, eggs, baking soda, salt, vanilla, walnuts (optional)',
      instructions: '1. Mash ripe bananas. 2. Cream butter and sugar. 3. Add eggs and banana. 4. Mix in dry ingredients. 5. Bake at 350°F for 60 minutes.',
      imageUrl: 'https://images.unsplash.com/photo-1586444248902-2f64eddc13df?w=500'
    },
    {
      title: 'Pad Thai',
      description: 'Thai stir-fried noodles with sweet and tangy sauce.',
      ingredients: 'Rice noodles, shrimp, eggs, bean sprouts, peanuts, lime, fish sauce, palm sugar, tamarind paste',
      instructions: '1. Soak rice noodles until soft. 2. Make sauce with fish sauce, sugar, and tamarind. 3. Stir-fry shrimp and eggs. 4. Add noodles and sauce. 5. Toss with bean sprouts.',
      imageUrl: 'https://images.unsplash.com/photo-1582878826629-29b7ad1cdc43?w=500'
    },
    {
      title: 'Caprese Salad',
      description: 'Simple Italian salad with tomatoes, mozzarella, and basil.',
      ingredients: 'Fresh tomatoes, mozzarella cheese, fresh basil, extra virgin olive oil, balsamic vinegar, salt, pepper',
      instructions: '1. Slice tomatoes and mozzarella. 2. Arrange alternately with basil leaves. 3. Drizzle with olive oil and balsamic. 4. Season with salt and pepper.',
      imageUrl: 'https://images.unsplash.com/photo-1608897013039-887f21d8c804?w=500'
    },
    {
      title: 'Beef Stir Fry',
      description: 'Quick and healthy stir-fry with tender beef and vegetables.',
      ingredients: 'Beef strips, broccoli, bell peppers, snap peas, soy sauce, oyster sauce, garlic, ginger, sesame oil',
      instructions: '1. Marinate beef in soy sauce. 2. Heat oil in wok. 3. Stir-fry beef until browned. 4. Add vegetables and cook until crisp-tender. 5. Toss with sauce.',
      imageUrl: 'https://images.unsplash.com/photo-1603360946369-dc9bb6258143?w=500'
    }
  ];

  // Create test user first to get the userId
  console.log('Creating test user...');
  const hashedPassword = await bcrypt.hash('password123', 10);
  
  const user = await prisma.user.create({
    data: {
      email: 'test@test.com',
      userName: 'TestiKokki',
      passwordHash: hashedPassword
    },
  })
  console.log('Created user:', { id: user.id, email: user.email, userName: user.userName });

  console.log('Creating recipes...');
  for (const recipeData of recipes) {
    const recipe = await prisma.recipe.create({ 
      data: {
        ...recipeData,
        createdBy: user.id // Lisää käyttäjä reseptin luojaksi
      }
    });
    console.log(`Created recipe: ${recipe.title} by ${user.userName}`);
  }



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