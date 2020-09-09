'use strict';

import express from 'express';
import { index, destroy, show, create } from './projects.controller';
import { validateRequest, requireAuth } from '@rogatis.eti.br/common';

const router = express.Router();

router.get('/', [], validateRequest, index);
router.get('/:id', [], validateRequest, show);
router.post('/', requireAuth, [], validateRequest, create);
//router.put('/:id', controller.upsert);
//router.patch('/:id', controller.patch);
router.delete('/:id', requireAuth, [], validateRequest, destroy);
export { router as projectRouter };
