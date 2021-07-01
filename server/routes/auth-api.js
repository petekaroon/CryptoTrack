/* eslint-disable max-lines-per-function */
const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');

const { dbQuery } = require('../lib/db-query');
const catchError = require('../lib/catch-error');
const verifyToken = require('../lib/verify-token');
const config = require('../lib/config');

const jwt = require('jsonwebtoken');
const tokenSecret = config.JWT_TOKEN_SECRET;

// @api {post} /register : Add a new user
router.post('/register',
  catchError(async (req, res) => {
    let newUsername = req.body.username;
    let newPassword = req.body.password;

    const REGISTER = `INSERT INTO users (username, password) VALUES ($1, $2)`;
    const FIND_USERNAME = `SELECT * FROM users WHERE username = $1`;

    try {
      let hashedPassword = await bcrypt.hash(newPassword, 10);
      await dbQuery(REGISTER, newUsername, hashedPassword);
      let result = await dbQuery(FIND_USERNAME , newUsername);

      if (result.rowCount > 0) {
        let user = result.rows[0];
        generateToken(res, user.id, user.username);
        res.status(200).json({
          id: user.id,
          username: user.username
        });
      }

    } catch (error) {
      if (isUniqueConstraintViolation(error)) {
        res.status(404).json({ message: 'Username is already taken.' });
      } else {
        res.status(500).json(error);
      }
    }
  })
);

// @api {post} /login : Login user
router.post('/login',
  catchError(async (req, res) => {
    let loginUsername = req.body.username;
    let loginPassword = req.body.password;

    const FIND_USERNAME = `SELECT * FROM users WHERE username = $1`;

    try {
      let result = await dbQuery(FIND_USERNAME, loginUsername);

      if (result.rowCount === 0) {
        res.status(403).json({ message: 'Invalid Username' });
      }

      let user = result.rows[0];
      let match = await bcrypt.compare(loginPassword, user.password);

      if (match) {
        generateToken(res, user.id, user.username);
        res.status(200).json({
          id: user.id,
          username: user.username
        });

      } else {
        res.status(403).json({ message: 'Incorrect Password' });
      }

    } catch (error) {
      res.status(500).json(error);
    }
  })
);

// @api {delete} /logout : Delete token cookie and logout
router.delete('/logout',
  catchError(async (req, res) => {
    try {
      await res.clearCookie('token');
      res.status(200).json({ successMsg: 'Successfully logged out.' });

    } catch (error) {
      res.status(500).json(error);
    }
  })
);

router.get('/', verifyToken,
  catchError((req, res) => {
    try {
      res.status(200).json(res.user);
    } catch (error) {
      res.status(500).json(error);
    }
  })
);

function isUniqueConstraintViolation(error) {
  return /duplicate key value violates unique constraint/.test(String(error));
}

function generateToken(res, id ,username) {
  let token = jwt.sign({ id, username }, tokenSecret, { expiresIn: '24h' });
  return res.cookie('token', token, {
    expires: new Date(Date.now() + 86400000),
    secure: false,  // set to true if using https
    httpOnly: true,
    // sameSite: true
  });
}

module.exports = router;