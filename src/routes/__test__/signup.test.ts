import request from 'supertest';
import { app } from '../../app';

it('return a 201 on sucessful signup', async () => {
  const result = await request(app)
    .post('/api/users/signup')
    .send({
      email: 'test@test.com',
      password: 'password',
    })
    .expect(201);

  return result;
});

it('returns a 400 with a invalid email', async () => {
  const result = await request(app)
    .post('/api/users/signup')
    .send({
      email: 'test.com',
      password: 'password',
    })
    .expect(400);
  return result;
});

it('returns a 400 with a invalid password', async () => {
  return request(app)
    .post('/api/users/signup')
    .send({
      email: 'teste@test.com',
      password: 'pas',
    })
    .expect(400);
});

it('returns a 400 with missing email or password', async () => {
  await request(app)
    .post('/api/users/signup')
    .send({ email: 'test@test.com' })
    .expect(400);
  return request(app)
    .post('/api/users/signup')
    .send({ password: '1224' })
    .expect(400);
});

it('disallows duplicate emails', async () => {
  await request(app)
    .post('/api/users/signup')
    .send({ email: 'test@test.com', password: '1234' })
    .expect(201);
  await request(app)
    .post('/api/users/signup')
    .send({ email: 'test@test.com', password: '1234' })
    .expect(400);
});

it('sets a cookie after a sucessful signup', async () => {
  const response = await request(app)
    .post('/api/users/signup')
    .send({ email: 'test@test.com', password: '1234' })
    .expect(201);
  expect(response.get('Set-Cookie')).toBeDefined();
});
