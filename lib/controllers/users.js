const { Router } = require('express');
const UserService = require('../services/UserService.js');

module.exports = Router().post('/', async (req, res, next) => {
  try {
    const newUser = await UserService.create(req.body);
    res.json(newUser);
  } catch (error) {
    next(error);
  }
});
