import PropTypes from 'prop-types';
// material
import { Box, Card, Typography, Stack } from '@material-ui/core';
// utils
import { fNumber, fCurrency } from '../../utils/formatNumber';

// ----------------------------------------------------------------------

CurrentBalance.propTypes = {
  cryptoSymbol: PropTypes.string,
  mainApiData: PropTypes.array,
  currentPrice: PropTypes.number
};

export default function CurrentBalance(props) {
  const { cryptoSymbol, mainApiData, currentPrice } = props;

  const currentHoldings = mainApiData.reduce((sum, transaction) => {
    if (transaction.type === 'buy') return (sum += transaction.amount);
    return sum - transaction.amount;
  }, 0);

  const currentBalance = currentHoldings * currentPrice;

  return (
    <Card sx={{ display: 'flex', alignItems: 'center', p: 3 }}>
      <Box sx={{ flexGrow: 1 }}>
        <Typography variant="h6">{`${cryptoSymbol} Balance`}</Typography>

        <Stack direction="row" alignItems="center" spacing={1} sx={{ mt: 2, mb: 1 }}>
          <Typography component="span" variant="subtitle2" sx={{ color: 'text.secondary' }}>
            {`${fNumber(currentHoldings)} ${cryptoSymbol}`}
          </Typography>
        </Stack>

        <Typography variant="h3" color="secondary">
          {fCurrency(currentBalance)}
        </Typography>
      </Box>
    </Card>
  );
}
