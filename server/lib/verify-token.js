const config = require('../lib/config');
const jwt = require('jsonwebtoken');
const tokenSecret = config.JWT_TOKEN_SECRET;

function verifyToken (req, res, next) {
  const token = req.cookies.token;

  try {
    if (!token) {
      res.status(401).json({ errorMsg: 'No token provided' });
    } else {
      let decrypt = jwt.verify(token, tokenSecret);
      res.user = {
        id: decrypt.id,
        username: decrypt.username
      };
      next();
    }
  } catch (error) {
    res.status(500).json({ errorMsg: 'Failed to authenticate token' });
  }
}

module.exports = verifyToken;