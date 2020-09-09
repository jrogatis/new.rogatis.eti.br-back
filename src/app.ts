import express from 'express';
import 'express-async-errors';
import { json } from 'body-parser';
import { currentUserRouter } from './routes/users/current-user';
import { postsRouter } from './routes/posts';
// import { projectsRouter } from './routes/projects';
import {
  NotFoundError,
  errorHandler,
  currentUser,
} from '@rogatis.eti.br/common';
import { signinRouter } from './routes/users/signin';
import { signoutRouter } from './routes/users/signout';
import { signupRouter } from './routes/users/signup';
// import { projectRouter } from './api/projects';
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
app.use(currentUserRouter);
app.use(postsRouter);
// app.use(projectRouter);
// app.use(projectsRouter);
app.use(signinRouter);
app.use(signoutRouter);
app.use(signupRouter);
routes(app);
app.all('*', async () => {
  console.log('vai');
  throw new NotFoundError();
});

app.use(errorHandler);

export { app };
