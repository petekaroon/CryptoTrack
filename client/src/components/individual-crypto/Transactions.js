import PropTypes from 'prop-types';
import { sentenceCase } from 'change-case';
// material
import { Card, Table, TableRow, TableBody, TableCell, TableHead, CardHeader, TableContainer } from '@material-ui/core';
// utils
import { fCurrency, fNumber, fCurrencyPrice } from '../../utils/formatNumber';
//
import Label from '../Label';
import Scrollbar from '../Scrollbar';
import TransactionMoreMenu from './TransactionMoreMenu';

// ----------------------------------------------------------------------
Transactions.propTypes = {
  cryptoId: PropTypes.number,
  cryptoName: PropTypes.string,
  cryptoSymbol: PropTypes.string,
  mainApiData: PropTypes.array,
  handleSetLastUpdate: PropTypes.func
};

export default function Transactions(props) {
  const { cryptoId, cryptoName, cryptoSymbol, mainApiData, handleSetLastUpdate } = props;

  function convertDate(inputDate) {
    const inputDateStr = new Date(inputDate).toLocaleString('en-CA');
    const dateArr = inputDateStr.split(' ');
    const dateStr = dateArr[0].slice();
    const timeStr = dateArr[1].slice(0, 5);
    const amPmStr = `${dateArr[2][0].toUpperCase()}${dateArr[2][2].toUpperCase()}`;

    return `${dateStr} ${timeStr} ${amPmStr}`;
  }

  return (
    <Card>
      <CardHeader title="Transactions" sx={{ mb: 3 }} />
      <Scrollbar>
        <TableContainer sx={{ minWidth: 720 }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Transaction Date</TableCell>
                <TableCell align="right">Type</TableCell>
                <TableCell align="right">Price</TableCell>
                <TableCell align="right">Amount</TableCell>
                <TableCell align="right">Total Value</TableCell>
                <TableCell />
              </TableRow>
            </TableHead>
            <TableBody>
              {mainApiData.map((transaction) => (
                <TableRow key={transaction.transactionId}>
                  <TableCell>{convertDate(transaction.date)}</TableCell>

                  <TableCell align="right">
                    <Label variant="ghost" color={(transaction.type === 'buy' && 'success') || 'error'}>
                      {sentenceCase(transaction.type)}
                    </Label>
                  </TableCell>

                  <TableCell align="right">{fCurrencyPrice(transaction.price)}</TableCell>

                  <TableCell align="right">
                    <Label variant="ghost" color={(transaction.type === 'buy' && 'success') || 'error'}>
                      {transaction.type === 'buy'
                        ? `+${fNumber(transaction.amount)} ${cryptoSymbol}`
                        : `- ${fNumber(transaction.amount)} ${cryptoSymbol}`}
                    </Label>
                  </TableCell>

                  <TableCell align="right">
                    {transaction.type === 'buy'
                      ? `+${fCurrency(transaction.total)}`
                      : `- ${fCurrency(transaction.total)}`}
                  </TableCell>

                  <TableCell align="right">
                    <TransactionMoreMenu
                      cryptoId={cryptoId}
                      cryptoName={cryptoName}
                      cryptoSymbol={cryptoSymbol}
                      transactionId={transaction.transactionId}
                      handleSetLastUpdate={handleSetLastUpdate}
                      currentTransaction={transaction}
                    />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Scrollbar>
    </Card>
  );
}
