import faker from 'faker';
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
  Typography,
  CardHeader,
  TableContainer
} from '@material-ui/core';
// utils
import { fCurrency } from '../../utils/formatNumber';
//
import Label from '../Label';
import Scrollbar from '../Scrollbar';
import AssetMoreMenu from './AssetMoreMenu';

// ----------------------------------------------------------------------

const INVOICES = [
  {
    id: faker.datatype.uuid(),
    category: 'Android',
    price: faker.finance.amount(),
    status: 'in_progress'
  },
  {
    id: faker.datatype.uuid(),
    category: 'Windows',
    price: faker.finance.amount(),
    status: 'paid'
  },
  {
    id: faker.datatype.uuid(),
    category: 'Mac',
    price: faker.finance.amount(),
    status: 'out_of_date'
  },
  {
    id: faker.datatype.uuid(),
    category: 'Windows',
    price: faker.finance.amount(),
    status: 'paid'
  },
  {
    id: faker.datatype.uuid(),
    category: 'Windows',
    price: faker.finance.amount(),
    status: 'in_progress'
  }
];

// ----------------------------------------------------------------------

CryptoAssets.propTypes = {
  mainApiData: PropTypes.array
};

export default function CryptoAssets(props) {
  const theme = useTheme();
  const { mainApiData, coinApiData } = props;

  return (
    <Card>
      <CardHeader title="Crypto Assets" sx={{ mb: 3 }} />
      <Scrollbar>
        <TableContainer sx={{ minWidth: 720 }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Asset</TableCell>
                <TableCell>Current Price</TableCell>
                <TableCell>Holdings</TableCell>
                <TableCell>Current Value</TableCell>
                <TableCell>Avg. Buy Price</TableCell>
                <TableCell>Profit/Loss</TableCell>
                <TableCell>%</TableCell>
                <TableCell />
              </TableRow>
            </TableHead>
            <TableBody>
              {mainApiData.map((crypto) => (
                <TableRow key={crypto.cryptoId}>
                  <TableCell>
                    <Typography fontWeight="fontWeightBold">{`${crypto.name} : ${crypto.symbol}`}</Typography>
                  </TableCell>
                  <TableCell>{fCurrency(crypto.cryptoId)}</TableCell>
                  <TableCell>{`${crypto.cryptoId} ${crypto.symbol}`}</TableCell>
                  <TableCell>{fCurrency(crypto.holdingQty)}</TableCell>
                  <TableCell>{fCurrency(crypto.avgBuyPrice)}</TableCell>
                  <TableCell>{fCurrency(crypto.cryptoId)}</TableCell>
                  <TableCell>{`${crypto.cryptoId} %`}</TableCell>
                  {/* <TableCell>
                    <Label
                      variant={theme.palette.mode === 'light' ? 'ghost' : 'filled'}
                      color={
                        (crypto.status === 'in_progress' && 'warning') ||
                        (crypto.status === 'out_of_date' && 'error') ||
                        'success'
                      }
                    >
                      {sentenceCase(crypto.status)}
                    </Label>
                  </TableCell> */}
                  <TableCell align="right">
                    <AssetMoreMenu />
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
