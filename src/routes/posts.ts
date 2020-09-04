import express, { Request, Response } from 'express';
import { body } from 'express-validator';
import { BadRequestError } from '../errors/bad-request-error';
import { validateRequest } from '../middlewares/validate-request';
import { NotFoundError } from '../errors/not-found-error';
import { Posts } from '../models/posts';

const router = express.Router();

router.get(
  '/api/posts',
  [],
  validateRequest,
  async (req: Request, res: Response) => {
    const posts = await Posts.find();
    res.send(posts);
  },
);
router.get(
  '/api/posts/:id',
  [],
  validateRequest,
  async (req: Request, res: Response) => {
    try {
      const post = await Posts.findById(req.params.id);
      res.send(post);
    } catch (err) {
      throw new BadRequestError('I cant find this post id');
    }
  },
);

export { router as postsRouter };
