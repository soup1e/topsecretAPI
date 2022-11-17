const pool = require('../lib/utils/pool');
const setup = require('../data/setup');
const request = require('supertest');
const app = require('../lib/app');

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

  afterAll(() => {
    pool.end();
  });
});
