import faker from 'faker';
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
import { fCurrency } from '../../utils/formatNumber';
//
import Label from '../Label';
import Scrollbar from '../Scrollbar';
import AssetMoreMenu from '../portfolio/AssetMoreMenu';

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

export default function Transactions() {
  const theme = useTheme();

  return (
    <Card>
      <CardHeader title="Transactions" sx={{ mb: 3 }} />
      <Scrollbar>
        <TableContainer sx={{ minWidth: 720 }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Date & Time</TableCell>
                <TableCell>Type</TableCell>
                <TableCell>Price</TableCell>
                <TableCell>Amount</TableCell>
                <TableCell>Total</TableCell>
                <TableCell />
              </TableRow>
            </TableHead>
            <TableBody>
              {INVOICES.map((row) => (
                <TableRow key={row.id}>
                  <TableCell>{`INV-${row.id}`}</TableCell>
                  <TableCell>
                    <Label
                      variant={theme.palette.mode === 'light' ? 'ghost' : 'filled'}
                      color={
                        (row.status === 'in_progress' && 'warning') ||
                        (row.status === 'out_of_date' && 'error') ||
                        'success'
                      }
                    >
                      {sentenceCase(row.status)}
                    </Label>
                  </TableCell>
                  <TableCell>{fCurrency(row.price)}</TableCell>
                  <TableCell>{fCurrency(row.price)}</TableCell>
                  <TableCell>{fCurrency(row.price)}</TableCell>
                  <TableCell align="right">
                    <AssetMoreMenu />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Scrollbar>

      <Divider />

      <Box sx={{ p: 2, textAlign: 'right' }}>
        <Button
          to="#"
          size="small"
          color="inherit"
          component={RouterLink}
          endIcon={<Icon icon={arrowIosForwardFill} />}
        >
          View All
        </Button>
      </Box>
    </Card>
  );
}
