const express = require('express');
const router = express.Router();

const { dbQuery } = require('../lib/db-query');
const catchError = require('../lib/catch-error');
const verifyToken = require('../lib/verify-token');
const config = require('../lib/config');

const jwt = require('jsonwebtoken');
const tokenSecret = config.JWT_TOKEN_SECRET;

router.get('/', verifyToken,
  catchError(async (req, res) => {
    try {
      res.status(200).json(res.user);
    } catch (error) {
      res.status(500).json(error);
    }
  })
);

module.exports = router;