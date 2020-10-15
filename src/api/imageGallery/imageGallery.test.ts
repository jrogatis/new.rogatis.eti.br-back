import request from 'supertest';
import { app } from '../../app';

it('return a list of all images', async () => {
  const result = await request(app).get('/api/imagegallery');
  return expect(result.body.length).toBe(22);
});
