import express, { Request, Response } from 'express';
import {
  BadRequestError,
  validateRequest,
  requireAuth,
} from '@rogatis.eti.br/common';

import { Posts } from '../models/posts';

const router = express.Router();

router.get(
  '/api/posts',
  requireAuth,
  [],
  validateRequest,
  async (req: Request, res: Response) => {
    const posts = await Posts.find();
    res.send(posts);
  },
);
router.get(
  '/api/posts/:id',
  requireAuth,
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
