'use strict';

import { Router } from 'express';
import { currentUser as curUser, userLogin, newUser } from './user.controller';
import { body } from 'express-validator';
import { currentUser, validateRequest } from '@rogatis.eti.br/common';
const router = Router();

router.get('/currentuser', currentUser, curUser);
router.post(
  '/signin',
  [
    body('email').isEmail().withMessage('Email must be valid'),
    body('password')
      .trim()
      .notEmpty()
      .withMessage('You must supply a password'),
  ],
  validateRequest,
  userLogin,
);
router.post(
  '/signup',
  [
    body('email').isEmail().withMessage('Email must be valid'),
    body('password')
      .trim()
      .isLength({ min: 4, max: 20 })
      .withMessage('Password must be between 4 and 20 characters'),
  ],
  validateRequest,
  newUser,
);

router.post('/signout', (req, res) => {
  req.session = null;
  res.send({});
});

export { router as usersRouter };
