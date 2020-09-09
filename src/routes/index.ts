import { projectRouter } from '../api/projects';
import { Application } from 'express';
const router = (app: Application): void => {
  app.use('/api/projects', projectRouter);
};

export default router;
