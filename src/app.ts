import * as dotenv from 'dotenv';
import * as path from 'path';

// Need to load env before importing anything else.
loadEnv().catch(err => {
    console.error('Cannot load environment settings.', err);
    process.exit(1);
});

// Need to come after load env.
import { Server } from './common/server';
import { swagger } from './common/swagger';
import { RegisterRoutes } from './routes/routes';

main().catch(err => {
    console.error('Cannot start Mavis.', err);
    process.exit(1);
});
  
async function loadEnv(): Promise<void> {
    const dotenvFile = process.env.DOTENV || path.join(__dirname, '.env');
    const dotenvConfig = await dotenv.config({path: dotenvFile});
    if (dotenvConfig.error) console.error('Error: ', dotenvConfig.error);
    if (process.env.NODE_ENV !== 'production') console.log(dotenvConfig);
}

async function main(): Promise<void> {    
    const server = new Server();

    const app = server.getExpressApp();

    RegisterRoutes(app);
    swagger(app);

    await server.start((webserver: Server) => {
        console.log('** TARS is online!');
    });
}