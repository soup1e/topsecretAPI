const { Router } = require('express');
const Secret = require('../models/Secret.js');

module.exports = Router().get('/', async (req, res) => {
  const secrets = await Secret.getAll();
  res.json(secrets);
});
