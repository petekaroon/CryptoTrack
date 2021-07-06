/* eslint-disable max-lines-per-function */
const express = require('express');
const router = express.Router();

const { dbQuery } = require('../lib/db-query');
const catchError = require('../lib/catch-error');
const verifyToken = require('../lib/verify-token');


// @api {get} / : Load portfolio page after user logged in
router.get('/', verifyToken,
  catchError(async (req, res) => {
    const QUERY_PORTFOLIO =
      `SELECT t.crypto_id, c.name, c.symbol, t.buy_tx, 
        sum(t.qty) as sum_qty, sum(t.tx_value) as sum_tx_value 
        FROM transactions AS t
        INNER JOIN cryptos AS c ON (t.crypto_id = c.id) 
        WHERE t.user_id = $1 
        GROUP BY t.crypto_id, c.name, c.symbol, t.buy_tx`;

    let outputCryptoArr = [];

    function isUniqueCrypto(resultObj) {
      return outputCryptoArr.every(outputObj =>
        outputObj.cryptoId !== resultObj['crypto_id']);
    }

    try {
      const queryResult = await dbQuery(QUERY_PORTFOLIO, res.user.id);

      queryResult.rows.forEach(resultObj => {
        if (isUniqueCrypto(resultObj)) {
          outputCryptoArr.push({
            cryptoId: resultObj['crypto_id'],
            name: resultObj['name'],
            symbol: resultObj['symbol'],
            holdingQty: 0,
            totalBuyQty: 0,
            totalSellQty: 0,
            avgBuyPrice: null,
            avgSellPrice: null
          });
        }

        outputCryptoArr.forEach(outputObj => {
          if ((resultObj['crypto_id'] === outputObj.cryptoId) && resultObj['buy_tx']) {
            outputObj.holdingQty += +resultObj['sum_qty'];
            outputObj.totalBuyQty = +resultObj['sum_qty'];
            outputObj.avgBuyPrice = +resultObj['sum_tx_value'] / +resultObj['sum_qty'];

          } else if ((resultObj['crypto_id'] === outputObj.cryptoId) && !resultObj['buy_tx']) {
            outputObj.holdingQty -= +resultObj['sum_qty'];
            outputObj.totalSellQty = +resultObj['sum_qty'];
            outputObj.avgSellPrice = +resultObj['sum_tx_value'] / +resultObj['sum_qty'];
          }
        });
      });

      res.status(200).json(outputCryptoArr);

    } catch (error) {
      res.status(500).json(error);
    }
  })
);


// @api {get} /:cryptoId : Load transaction page for the selected cryptocurrency
router.get('/:cryptoId', verifyToken,
  catchError(async (req, res) => {
    const QUERY_TRANSACTIONS =
      `SELECT t.id, c.name, c. symbol, t.date, t.buy_tx, t.unit_price, t.qty, t.tx_value
        FROM transactions AS t
        INNER JOIN cryptos AS c ON (t.crypto_id = c.id) 
        WHERE t.user_id = $1 AND crypto_id = $2 
        ORDER BY date DESC`;

    try {
      const queryResult = await dbQuery(QUERY_TRANSACTIONS,
        res.user.id, +req.params.cryptoId);

      if (queryResult.rowCount > 0) {
        const outpuCrytoListArr = queryResult.rows.map(resultObj => {
          return {
            transactionId: +resultObj['id'],
            cryptoName: resultObj['name'],
            cryptoSymbol: resultObj['symbol'],
            date: resultObj['date'],
            type: resultObj['buy_tx'] ? 'buy' : 'sell',
            price: +resultObj['unit_price'],
            amount: +resultObj['qty'],
            total: +resultObj['tx_value']
          };
        });

        res.status(200).json(outpuCrytoListArr);

      } else {
        res.status(400).json({ message: 'No transaction with this cryptocurrency.' });
      }

    } catch (error) {
      res.status(500).json(error);
    }
  })
);


// @api {delete} /:cryptoId : Delete all transactions of the
//    selected cryptocurrency
router.delete('/:cryptoId', verifyToken,
  catchError(async (req, res) => {
    const DELETE_TRANSACTION =
      `DELETE FROM transactions
        WHERE user_id = $1 AND crypto_id = $2`;

    try {
      let queryResult = await dbQuery(DELETE_TRANSACTION, res.user.id,
        +req.params.cryptoId);

      if (queryResult.rowCount > 0) {
        res.status(200).json({ message: 'Transactions deleted' });

      } else {
        res.status(400).json({ message: 'Bad Request' });
      }
    } catch (error) {
      res.status(500).json(error);
    }
  })
);


// @api {post} /transactions : Create a new transaction
router.post('/transactions', verifyToken,
  catchError(async (req, res) => {
    let {
      cryptoId,
      type,
      quantity,
      pricePerCoin,
      date,
      total
    } = req.body;

    type = type === 'buy';
    date = JSON.stringify(new Date());  // For testing only, to be removed

    const ADD_TRANSACTION =
      `INSERT INTO transactions (user_id, crypto_id, buy_tx, qty, 
        unit_price, date, tx_value) 
        VALUES ($1, $2, $3, $4, $5, $6, $7)`;

    try {
      let queryResult = await dbQuery(ADD_TRANSACTION, res.user.id, cryptoId,
        type, quantity, pricePerCoin, date, total);

      if (queryResult.rowCount > 0) {
        res.status(200).json({ message: 'Transaction added' });

      } else {
        res.status(400).json({ message: 'Bad Request' });
      }
    } catch (error) {
      res.status(500).json(error);
    }
  })
);


// @api {put} /transactions/:transactionId : Update a transaction
router.put('/transactions/:transactionId', verifyToken,
  catchError(async (req, res) => {
    let {
      cryptoId,
      type,
      quantity,
      pricePerCoin,
      date,
      total
    } = req.body;

    type = type === 'buy';
    date = JSON.stringify(new Date());  // For testing only, to be removed

    const EDIT_TRANSACTION =
      `UPDATE transactions SET 
        user_id = $1, 
        crypto_id = $2,
        buy_tx = $3,
        qty = $4,
        unit_price = $5,
        date = $6,
        tx_value = $7
        WHERE id = $8`;

    try {
      let queryResult = await dbQuery(EDIT_TRANSACTION, res.user.id, cryptoId,
        type, quantity, pricePerCoin, date, total, +req.params.transactionId);

      if (queryResult.rowCount > 0) {
        console.log(queryResult.rowCount);
        res.status(200).json({ message: 'Transaction edited' });

      } else {
        res.status(400).json({ message: 'Bad Request' });
      }
    } catch (error) {
      res.status(500).json(error);
    }
  })
);


// @api {delete} /transactions/:transactionId : Delete a transaction
router.delete('/transactions/:transactionId', verifyToken,
  catchError(async (req, res) => {
    const DELETE_TRANSACTION =
      `DELETE FROM transactions
        WHERE user_id = $1 AND id = $2`;

    try {
      let queryResult = await dbQuery(DELETE_TRANSACTION, res.user.id,
        +req.params.transactionId);

      if (queryResult.rowCount > 0) {
        res.status(200).json({ message: 'Transaction deleted' });

      } else {
        res.status(400).json({ message: 'Bad Request' });
      }
    } catch (error) {
      res.status(500).json(error);
    }
  })
);

// @api {get} / : Load list of supported cryptocurrencies
router.get('/cryptoList/all', verifyToken,
  catchError(async (req, res) => {
    const QUERY_TRANSACTIONS = `SELECT id, name, symbol FROM cryptos`;

    try {
      const queryResult = await dbQuery(QUERY_TRANSACTIONS);
      console.log(queryResult);

      if (queryResult.rowCount > 0) {
        res.status(200).json(queryResult.rows);

      } else {
        res.status(400).json({ message: 'Bad request' });
      }

    } catch (error) {
      res.status(500).json(error);
    }
  })
);

module.exports = router;