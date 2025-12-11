import swaggerJSDoc from "swagger-jsdoc"

const swaggerDefinitions = {
    openapi: '3.0.0',
    info: {
        title: 'SimpleChef API',
        version: '1.0.0',
        description: 'SimpleChef reseptisovelluksen API-dokumentaatio',
    },
    servers:[
        {
            url: 'http://localhost:3000',
            description: 'Development server',
        },
    ],
};

const options: swaggerJSDoc.Options = {
    definition: swaggerDefinitions,
    apis: ['./src/routes/*.ts'], // Mistä etsitään @swagger kommentit
};

export const swaggerSpec = swaggerJSDoc(options);