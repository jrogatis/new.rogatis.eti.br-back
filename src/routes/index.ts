import { projectRouter } from '../api/projects';
import { postsRouter } from '../api/posts/';
import { Application } from 'express';
import { usersRouter } from '../api/user';
import { imageGalleryRouter } from '../api/imageGallery';
const router = (app: Application): void => {
  app.use('/api/projects', projectRouter);
  app.use('/api/posts', postsRouter);
  app.use('/api/users', usersRouter);
  app.use('/api/imagegallery', imageGalleryRouter);
};

export default router;
