'use strict';

import express from 'express';
import { index } from './imageGallery.controller';

const router = express.Router();

router.get('/', index);
// router.post('/signing', signing);
// router.delete('/:id', destroy);

export { router as imageGalleryRouter };
