import PropTypes from 'prop-types';
import { Icon } from '@iconify/react';
import { sentenceCase } from 'change-case';
import { Link as RouterLink } from 'react-router-dom';
// material
import { useTheme } from '@material-ui/core/styles';
import arrowIosForwardFill from '@iconify/icons-eva/arrow-ios-forward-fill';
import {
  Box,
  Card,
  Table,
  Button,
  Divider,
  TableRow,
  TableBody,
  TableCell,
  TableHead,
  CardHeader,
  TableContainer
} from '@material-ui/core';
// utils
import { fCurrency, fNumber } from '../../utils/formatNumber';
//
import Label from '../Label';
import Scrollbar from '../Scrollbar';
import TransactionMoreMenu from './TransactionMoreMenu';

// ----------------------------------------------------------------------
Transactions.propTypes = {
  cryptoSymbol: PropTypes.string,
  mainApiData: PropTypes.array,
  handleSetLastUpdate: PropTypes.func
};

export default function Transactions(props) {
  const theme = useTheme();
  const { cryptoSymbol, mainApiData, handleSetLastUpdate } = props;

  function convertDate(dateInputString) {
    return dateInputString.slice(0, 10);
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
                    <Label
                      variant={theme.palette.mode === 'light' ? 'ghost' : 'filled'}
                      color={(transaction.type === 'buy' && 'success') || 'error'}
                    >
                      {sentenceCase(transaction.type)}
                    </Label>
                  </TableCell>

                  <TableCell align="right">{fCurrency(transaction.price)}</TableCell>

                  <TableCell align="right">
                    <Label
                      variant={theme.palette.mode === 'light' ? 'ghost' : 'filled'}
                      color={(transaction.type === 'buy' && 'success') || 'error'}
                    >
                      {transaction.type === 'buy'
                        ? `+ ${fNumber(transaction.amount)} ${cryptoSymbol}`
                        : `- ${fNumber(transaction.amount)} ${cryptoSymbol}`}
                    </Label>
                  </TableCell>

                  <TableCell align="right">
                    {transaction.type === 'buy'
                      ? `+ ${fCurrency(transaction.total)}`
                      : `- ${fCurrency(transaction.total)}`}
                  </TableCell>

                  <TableCell align="right">
                    <TransactionMoreMenu
                      transactionId={transaction.transactionId}
                      handleSetLastUpdate={handleSetLastUpdate}
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
