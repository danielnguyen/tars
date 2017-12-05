import * as express from 'express';
import healthRouter from './api/controllers/health/router';

export default function routes(app: express.Application) {
  app.use('/api/v1/health', healthRouter);
}
