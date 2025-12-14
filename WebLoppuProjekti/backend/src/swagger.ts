import swaggerJSDoc from "swagger-jsdoc"

const swaggerDefinitions = {
    openapi: '3.0.0',
    info: {
        title: 'SimpleChef API',
        version: '1.0.0',
        description: 'SimpleChef reseptisovelluksen REST API -dokumentaatio. Kaikki autentikointia vaativat reitit käyttävät JWT Bearer -tokenia.',
    },
    servers:[
        {
            url: 'http://localhost:3000',
            description: 'Kehityspalvelin (localhost)',
        },
    ],
    components:{
        securitySchemes:{
            bearerAuth:{
                type: 'http',
                scheme: 'bearer',
                bearerFormat: 'JWT',
            },
        },
    },
};

const options: swaggerJSDoc.Options = {
    definition: swaggerDefinitions,
    apis: ['./src/routes/*.ts'], // Mistä etsitään @swagger kommentit
};

export const swaggerSpec = swaggerJSDoc(options);