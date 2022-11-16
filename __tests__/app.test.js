const pool = require('../lib/utils/pool');
const setup = require('../data/setup');
const request = require('supertest');
const app = require('../lib/app');
const UserService = require('../lib/services/UserService.js');

const newUser = {
  email: 'admin@test.com',
  password: 'password',
};

const login = async (userProps = {}) => {
  const password = userProps.password ?? newUser.password;
  const agent = request.agent(app);

  const user = await UserService.create({ ...newUser, ...userProps });

  const { email } = user;
  await agent.post('/api/v1/users/sessions').send({ email, password });

  return [agent, user];
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

  it('login and returns the current user', async () => {
    const [agent, user] = await login();
    const me = await agent.get('/api/v1/users/me');

    expect(me.body).toEqual({
      ...user,
      exp: expect.any(Number),
      iat: expect.any(Number),
    });
  });
  afterAll(() => {
    pool.end();
  });
});
