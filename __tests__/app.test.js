const pool = require('../lib/utils/pool');
const setup = require('../data/setup');
const request = require('supertest');
const app = require('../lib/app');
const User = require('../lib/models/User.js');
const UserService = require('../lib/services/UserService.js');

const newUser = {
  email: 'admin@test.com',
  password: 'password',
};

describe('backend-express-template routes', () => {
  beforeEach(() => {
    return setup(pool);
  });
  it('creates a new user', async () => {
    const res = await request(app).post('/api/v1/users').send(newUser);
    const { email } = newUser;

    expect(res.body).toEqual({
      id: expect.any(String),
      email,
    });
  });

  it('POST /api/v1/sessions signs in and returns user', async () => {
    await request(app).post('/api/v1/users').send(newUser);
    const res = await request(app)
      .post('/api/v1/users/sessions')
      .send({ email: 'admin@test.com', password: 'password' });
    expect(res.status).toEqual(200);
  });

  it('DELETE /sessions deletes the user session', async () => {
    const agent = request.agent(app);
    await UserService.create({ ...newUser });
    await agent
      .post('/api/v1/users/sessions')
      .send({ email: 'admin@test.com', password: 'password' });

    const resp = await agent.delete('/api/v1/users/sessions');
    expect(resp.status).toBe(204);
  });

  it('/secrets should have a list of secrets', async () => {
    const resp = await request(app).get('/api/v1/secrets');
    expect(resp.body).toEqual([
      {
        id: expect.any(String),
        title: expect.any(String),
        description: expect.any(String),
        created_at: expect.any(String),
      },
      {
        id: expect.any(String),
        title: expect.any(String),
        description: expect.any(String),
        created_at: expect.any(String),
      },
    ]);
  });

  afterAll(() => {
    pool.end();
  });
});
