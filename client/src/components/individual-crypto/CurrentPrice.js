import PropTypes from 'prop-types';
// material
import { Box, Card, Typography } from '@material-ui/core';
// utils
import { fCurrency } from '../../utils/formatNumber';

// ----------------------------------------------------------------------

CurrentPrice.propTypes = {
  cryptoSymbol: PropTypes.string,
  currentPrice: PropTypes.number
};

export default function CurrentPrice(props) {
  const { cryptoSymbol, currentPrice } = props;

  return (
    <Card sx={{ display: 'flex', alignItems: 'center', p: 3 }}>
      <Box sx={{ flexGrow: 1 }}>
        <Typography variant="h6">{`${cryptoSymbol} Price`}</Typography>

        <Typography variant="h3" color="secondary">
          {fCurrency(currentPrice)}
        </Typography>
      </Box>
    </Card>
  );
}
