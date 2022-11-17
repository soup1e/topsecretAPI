const { Router } = require('express');
const authenticate = require('../middleware/authenticate');
const UserService = require('../services/UserService.js');

module.exports = Router()
  .post('/sessions', async (req, res, next) => {
    try {
      const { email, password } = req.body;
      const sessionToken = await UserService.signIn({ email, password });
      res
        .cookie(process.env.COOKIE_NAME, sessionToken, {
          httpOnly: true,
        })
        .json({ message: 'Signed in!' });
    } catch (e) {
      next(e);
    }
  })
  .post('/', async (req, res, next) => {
    try {
      const newUser = await UserService.create(req.body);
      res.json(newUser);
    } catch (e) {
      next(e);
    }
  })
  .get('/me', [authenticate], async (req, res) => {
    res.json(req.user);
  });
