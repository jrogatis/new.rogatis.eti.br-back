import { Request, Response } from 'express';
import { User } from './user.model';
import { BadRequestError } from '@rogatis.eti.br/common';
import jwt from 'jsonwebtoken';
import { Password } from '../../services/password';

const currentUser = (req: Request, res: Response) => {
  res.send({ currentUser: req.currentUser || null });
};

const userLogin = async (req: Request, res: Response) => {
  const { email, password } = req.body;

  const existingUser = await User.findOne({ email });
  if (!existingUser) {
    throw new BadRequestError('Invalid credentials');
  }

  const passwordsMatch = await Password.compare(
    existingUser.password,
    password,
  );

  if (!passwordsMatch) {
    throw new BadRequestError('Invalid Credentials 2');
  }

  // Generate JWT
  const userJwt = jwt.sign(
    {
      id: existingUser.id,
      email: existingUser.email,
    },
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    process.env.JWT_KEY!,
  );
  // Store it on session object
  req.session = {
    jwt: userJwt,
  };
  res.status(200).send(existingUser);
};

const newUser = async (req: Request, res: Response) => {
  const { email, password } = req.body;

  const existingUser = await User.findOne({ email });

  if (existingUser) {
    throw new BadRequestError('Email in use');
  }

  const user = User.build({ email, password });
  await user.save();

  // Generate JWT
  const userJwt = jwt.sign(
    {
      id: user.id,
      email: user.email,
    },
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    process.env.JWT_KEY!,
  );

  // Store it on session object
  req.session = {
    jwt: userJwt,
  };

  res.status(201).send(user);
};

export { currentUser, userLogin, newUser };
