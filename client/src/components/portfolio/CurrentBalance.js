import PropTypes from 'prop-types';
// material
import { Box, Card, Typography } from '@material-ui/core';
// utils
import { fCurrency } from '../../utils/formatNumber';

// ----------------------------------------------------------------------

PortfolioBalance.propTypes = {
  mainApiData: PropTypes.array,
  coinApiData: PropTypes.array
};

export default function PortfolioBalance(props) {
  const { mainApiData, coinApiData } = props;

  function getCurrentPrice(crypto) {
    return coinApiData.filter((coin) => coin.slug === crypto.name.toLowerCase()).map((coin) => coin.usd);
  }

  function getHoldingsValue(crypto) {
    return crypto.holdingQty * getCurrentPrice(crypto);
  }

  const currentBalance = mainApiData.reduce((sum, crypto) => sum + getHoldingsValue(crypto), 0);

  return (
    <Card sx={{ display: 'flex', alignItems: 'center', p: 3 }}>
      <Box sx={{ flexGrow: 1 }}>
        <Typography variant="h6">Current Balance</Typography>
        <Typography variant="h3" color={currentBalance >= 0 ? 'primary' : 'error'}>
          {fCurrency(currentBalance)}
        </Typography>
      </Box>
    </Card>
  );
}
