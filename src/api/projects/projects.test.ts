import request from 'supertest';
import faker from 'faker';
import { app } from '../../app';
import { Projects } from '../../models/projects';

const postImages = {
  imagePath: faker.internet.url(),
};

const projectToBuild = () =>
  Projects.build({
    title: faker.name.findName(),
    type: faker.lorem.slug(),
    desc: faker.lorem.slug(),
    imgUrl: faker.internet.url(),
    siteUrl: faker.internet.url(),
    displayFront: faker.random.boolean(),
    hasDesc: faker.random.boolean(),
    slug: faker.lorem.slug(),
    text: faker.lorem.lines(5),
    doneDate: faker.date.recent(1),
    challengeText: faker.lorem.lines(5),
    images: [postImages],
  });

it('return a list of all posts', async () => {
  for (let i = 0; i < 3; i++) {
    const project = projectToBuild();
    await project.save();
  }
  const result = await request(app).get('/api/projects');
  return expect(result.body.length).toBe(3);
});

it('return especific project', async () => {
  const project = projectToBuild();
  await project.save();
  const result = await request(app).get(`/api/projects/${project._id}`);
  return expect(result.body.id.toString()).toEqual(project._id.toString());
});

it('return 404 when especific project id its not found', async () => {
  const project = projectToBuild();
  await project.save();
  await request(app).get(`/api/projects/580a80d2dcba0f490c7298b4`).expect(404);
});

it('creates a project and return it with 201', async () => {
  const project = projectToBuild().toJSON();

  await request(app)
    .post(`/api/projects`)
    .set('Cookie', global.signin())
    .send({ ...project })
    .expect(201);
});
