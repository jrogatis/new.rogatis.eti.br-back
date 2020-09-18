import request from 'supertest';
import faker from 'faker';
import { app } from '../../app';
import { Project } from './projects.model';

const postImages = {
  imagePath: faker.internet.url(),
};

const projectToBuild = (displayFront?: boolean) =>
  Project.build({
    title: faker.name.findName(),
    type: faker.lorem.slug(),
    desc: faker.lorem.slug(),
    imgUrl: faker.internet.url(),
    siteUrl: faker.internet.url(),
    displayFront: displayFront || faker.random.boolean(),
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

it('denied a project creation without proper authorization and return 401', async () => {
  const project = projectToBuild().toJSON();
  await request(app)
    .post(`/api/projects`)
    .send({ ...project })
    .expect(401);
});

it('delete a existing project', async () => {
  const project = projectToBuild();
  const result = await project.save();
  await request(app)
    .delete(`/api/projects/${result._id}`)
    .set('Cookie', global.signin())
    .expect(204);
  const check = await Project.findById(result._id);
  return expect(check).toBe(null);
});

it('patch a existing project', async () => {
  const project = projectToBuild();
  const result = await project.save();

  await request(app)
    .patch(`/api/projects/${result._id}`)
    .set('Cookie', global.signin())
    .send([{ op: 'replace', path: '/title', value: 'TESTE' }])
    .expect(200);

  const check = await Project.findById(result._id);
  return expect(check?.title).toBe('TESTE');
});

it('upsert a existing project', async () => {
  const project = projectToBuild();
  const result = await project.save();

  await request(app)
    .put(`/api/projects/${result._id}`)
    .set('Cookie', global.signin())
    .send({ title: 'TESTE' })
    .expect(200);

  const check = await Project.findById(result._id);
  return expect(check?.title).toBe('TESTE');
});

it('return onnly projects with displayFront: true', async () => {
  for (let i = 0; i < 4; i++) {
    const project = projectToBuild(i % 2 === 0);
    await project.save();
  }
  const result = await request(app).get(`/api/projects/frontpage`);
  result.body.forEach((element: unknown) => {
    expect(element).toMatchObject({ displayFront: true });
  });
});
