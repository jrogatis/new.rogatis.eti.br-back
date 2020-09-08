import request from 'supertest';
import faker from 'faker';
import { app } from '../../app';
import { Posts } from '../../models/posts';

const postComments = {
  from: faker.name.findName(),
  message: faker.lorem.lines(4),
  date: faker.date.recent(),
};

const postBuild = () =>
  Posts.build({
    title: faker.lorem.lines(1),
    text: faker.lorem.slug(40),
    postImage: faker.internet.url(),
    snipet: faker.lorem.lines(1),
    slug: faker.lorem.slug(4),
    active: faker.random.boolean(),
    date: faker.date.recent(),
    author: faker.name.findName(),
    coments: [postComments],
  });

it('return a list of all posts', async () => {
  for (let i = 0; i < 3; i++) {
    const post = postBuild();
    await post.save();
  }
  const result = await request(app)
    .get('/api/posts')
    .set('Cookie', global.signin());

  return expect(result.body.length).toBe(3);
});

it('return especific post', async () => {
  const post = postBuild();
  await post.save();
  const result = await request(app)
    .get(`/api/posts/${post._id}`)
    .set('Cookie', global.signin());
  return expect(result.body.id.toString()).toEqual(post._id.toString());
});

it('return 422 when especific post its not found', async () => {
  const post = postBuild();
  await post.save();
  const result = await request(app)
    .get(`/api/posts/${1}`)
    .set('Cookie', global.signin())
    .expect(400);
  expect(result.body.errors[0].message).toEqual('I cant find this post id');
});
