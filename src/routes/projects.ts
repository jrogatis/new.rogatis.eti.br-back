import express, { Request, Response } from 'express';
import {
  BadRequestError,
  validateRequest,
  requireAuth,
} from '@rogatis.eti.br/common';
import { Projects } from '../models/projects';

const router = express.Router();

router.get(
  '/api/projects',
  requireAuth,
  [],
  validateRequest,
  async (req: Request, res: Response) => {
    const projects = await Projects.find();
    res.send(projects);
  },
);

router.get(
  '/api/projects/:id',
  requireAuth,
  [],
  validateRequest,
  async (req: Request, res: Response) => {
    try {
      const project = await Projects.findById(req.params.id);
      res.send(project);
    } catch (err) {
      throw new BadRequestError('I cant find this project id');
    }
  },
);

export { router as projectsRouter };
