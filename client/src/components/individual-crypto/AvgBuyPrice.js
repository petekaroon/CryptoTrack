import PropTypes from 'prop-types';
// material
import { Box, Card, Typography } from '@material-ui/core';
// utils
import { fCurrency } from '../../utils/formatNumber';

// ----------------------------------------------------------------------

AvgBuyPrice.propTypes = {
  mainApiData: PropTypes.array
};

export default function AvgBuyPrice(props) {
  const { mainApiData } = props;

  function getAvgBuyPrice(mainApiData) {
    const totalBuyQty = mainApiData.reduce((sum, transaction) => transaction.amount + sum, 0);
    const totalBuyValue = mainApiData.reduce((sum, transaction) => transaction.total + sum, 0);
    return totalBuyValue / totalBuyQty;
  }

  return (
    <Card sx={{ display: 'flex', alignItems: 'center', p: 3 }}>
      <Box sx={{ flexGrow: 1 }}>
        <Typography variant="h6">Avg. Buy Price</Typography>

        <Typography variant="h3" color="secondary">
          {fCurrency(getAvgBuyPrice(mainApiData))}
        </Typography>
      </Box>
    </Card>
  );
}
