import express, { Request, Response } from 'express';
import { body } from 'express-validator';
import { BadRequestError } from '../errors/bad-request-error';
import { validateRequest } from '../middlewares/validate-request';
import { NotFoundError } from '../errors/not-found-error';
import { Projects } from '../models/projects';

const router = express.Router();

router.get(
  '/api/projects',
  [],
  validateRequest,
  async (req: Request, res: Response) => {
    const projects = await Projects.find();
    res.send(projects);
  },
);

router.get(
  '/api/projects/:id',
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
