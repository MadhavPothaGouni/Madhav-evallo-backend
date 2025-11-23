const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { Organisation, User, Log } = require('../db');

const registerOrganisation = async (req, res, next) => {
  try {
    const { orgName, adminName, email, password } = req.body;

    if (!orgName || !email || !password) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    const existing = await User.findOne({ where: { email } });
    if (existing) {
      return res.status(400).json({ message: 'Email already in use' });
    }

    const organisation = await Organisation.create({ name: orgName });

    const password_hash = await bcrypt.hash(password, 10);
    const user = await User.create({
      organisation_id: organisation.id,
      email,
      password_hash,
      name: adminName || 'Admin'
    });

    await Log.create({
      organisation_id: organisation.id,
      user_id: user.id,
      action: 'organisation_created',
      meta: { orgName, adminName }
    });

    const token = jwt.sign(
      { userId: user.id, orgId: organisation.id },
      process.env.JWT_SECRET,
      { expiresIn: '8h' }
    );

    res.status(201).json({
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email
      },
      organisation: {
        id: organisation.id,
        name: organisation.name
      }
    });
  } catch (err) {
    next(err);
  }
};

const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ where: { email } });

    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const match = await bcrypt.compare(password, user.password_hash);
    if (!match) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const token = jwt.sign(
      { userId: user.id, orgId: user.organisation_id },
      process.env.JWT_SECRET,
      { expiresIn: '8h' }
    );

    await Log.create({
      organisation_id: user.organisation_id,
      user_id: user.id,
      action: 'user_login',
      meta: { email: user.email }
    });

    res.json({
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email
      },
      organisation_id: user.organisation_id
    });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  registerOrganisation,
  login
};
