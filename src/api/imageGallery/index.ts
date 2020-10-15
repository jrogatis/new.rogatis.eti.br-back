import express from 'express';
import { index } from './imageGallery.controller';

const router = express.Router();

router.get('/', index);

export { router as imageGalleryRouter };
