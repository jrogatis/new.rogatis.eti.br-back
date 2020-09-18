import express from 'express';
import {
  index,
  destroy,
  show,
  create,
  patch,
  upsert,
  indexFrontPage,
} from './projects.controller';
import { validateRequest, requireAuth } from '@rogatis.eti.br/common';

const router = express.Router();

router.get('/', [], validateRequest, index);
router.get('/frontpage', [], validateRequest, indexFrontPage);
router.get('/:id', [], validateRequest, show);
router.post('/', requireAuth, [], validateRequest, create);
router.put('/:id', requireAuth, [], validateRequest, upsert);
router.patch('/:id', requireAuth, [], validateRequest, patch);
router.delete('/:id', requireAuth, [], validateRequest, destroy);
export { router as projectRouter };
