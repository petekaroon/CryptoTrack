/* eslint-disable max-lines-per-function */
const express = require('express');
const router = express.Router();

const { dbQuery } = require('../lib/db-query');
const catchError = require('../lib/catch-error');
const verifyToken = require('../lib/verify-token');

router.get('/', verifyToken,
  catchError(async (req, res) => {
    try {
      res.status(200).json(res.user);
    } catch (error) {
      res.status(500).json(error);
    }
  })
);

// router.post('/add-transaction',
//   catchError(async (req, res) => {
//     const {
//       userId,
//       cryptoId,
//       type,
//       quantity,
//       pricePerCoin,
//       date,
//       total
//     } = req.body;

//     const ADD_TRANSACTION = 'INSERT INTO transactions' +
//       '(user_id, crypto_id, buy_tx, qty, unit_price, date, tx_value) VALUES' +
//       '($1, $2, $3, $4, $5, $6, $7)';

//     try {
//       await dbQuery(ADD_TRANSACTION, userId, cryptoId, type, quantity,
//         pricePerCoin, date, total);
      
//       let result = // Check which page the request was sent from and query accordingly

//       if (result.rowCount > 0) {
//         res.status(200).json({

//         });

//       } else {
//         res.status(400);
//       }
//     } catch (error) {
//       res.status(500).json(error);
//     }
//   })
// );

module.exports = router;