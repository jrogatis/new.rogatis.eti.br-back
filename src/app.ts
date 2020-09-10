import express from 'express';
import 'express-async-errors';
import { json } from 'body-parser';

import {
  NotFoundError,
  errorHandler,
  currentUser,
} from '@rogatis.eti.br/common';

import cookieSession from 'cookie-session';
import routes from './routes';

const app = express();
app.set('trust proxy', true);

app.use(json());
app.use(
  cookieSession({
    signed: false,
    secure: process.env.NODE_ENV !== 'test',
  }),
);

app.use(currentUser);
routes(app);
app.all('*', async () => {
  throw new NotFoundError();
});

app.use(errorHandler);

export { app };
