import { projectRouter } from '../api/projects';
import { postsRouter } from '../api/posts/';
import { Application } from 'express';
const router = (app: Application): void => {
  app.use('/api/projects', projectRouter);
  app.use('/api/posts', postsRouter);
};

export default router;
