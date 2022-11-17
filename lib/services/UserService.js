const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

module.exports = class UserService {
  static async create({ email, password }) {
    const passwordHash = await bcrypt.hash(
      password,
      Number(process.env.SALT_ROUNDS)
    );

    const user = await User.insert({
      email,
      passwordHash,
    });

    return user;
  }

  static async signIn({ email, password }) {
    try {
      const user = await User.getUserByEmail(email);
      console.log('123213', user.passwordHash);

      if (!user) throw new Error('Invalid email');

      const filter = bcrypt.compareSync(password, user.passwordHash);
      if (filter === false) {
        throw new Error('Invalid password');
      }

      const token = jwt.sign({ ...user }, process.env.JWT_SECRET, {
        expiresIn: '1 day',
      });

      console.log(token);

      return token;
    } catch (error) {
      error.status = 401;
      throw error;
    }
  }
};
