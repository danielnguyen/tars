import * as SwaggerTools from 'swagger-tools';
import * as express from 'express';
import * as path from 'path';
import { Config } from '../config';

export function swagger(app: express.Application) {

    // swaggerRouter configuration
    const options = {
        controllers: path.join(__dirname, '../api/controllers'),
        useStubs: Config.__DEVELOPMENT__ ? true : false // Conditionally turn on stubs (mock mode)
    };

    const swaggerDoc = require('../api/swagger.json');

    // Initialize the Swagger middleware
    SwaggerTools.initializeMiddleware(swaggerDoc, function (middleware) {
        // Interpret Swagger resources and attach metadata to request - must be first in swagger-tools middleware chain
        app.use(middleware.swaggerMetadata());
    
        // Validate Swagger requests
        app.use(middleware.swaggerValidator());
    
        // Route validated requests to appropriate controller
        app.use(middleware.swaggerRouter(options));
    
        // Serve the Swagger documents and Swagger UI
        app.use(middleware.swaggerUi());
    
    });
}

