import PropTypes from 'prop-types';
import { Icon } from '@iconify/react';
import trendingUpFill from '@iconify/icons-eva/trending-up-fill';
import trendingDownFill from '@iconify/icons-eva/trending-down-fill';
// material
import { alpha, useTheme, experimentalStyled as styled } from '@material-ui/core/styles';
import { Box, Card, Typography, Stack } from '@material-ui/core';
// utils
import { fPercent, fCurrency } from '../../utils/formatNumber';

// ----------------------------------------------------------------------

const IconWrapperStyle = styled('div')(({ theme }) => ({
  width: 24,
  height: 24,
  display: 'flex',
  borderRadius: '50%',
  alignItems: 'center',
  justifyContent: 'center',
  color: theme.palette.success.main,
  backgroundColor: alpha(theme.palette.success.main, 0.16)
}));

// ----------------------------------------------------------------------

TotalProfitLoss.propTypes = {
  mainApiData: PropTypes.array,
  coinApiData: PropTypes.array
};

export default function TotalProfitLoss(props) {
  const theme = useTheme();
  const { mainApiData, coinApiData } = props;

  function getCurrentPrice(crypto) {
    return coinApiData.filter((coin) => coin.slug === crypto.name.toLowerCase()).map((coin) => coin.usd);
  }

  function getHoldingsValue(crypto) {
    return crypto.holdingQty * getCurrentPrice(crypto);
  }

  function getProfitLoss(crypto) {
    // eslint-disable-next-line prettier/prettier
    return getHoldingsValue(crypto) + (crypto.totalSellQty * crypto.avgSellPrice) -
      (crypto.totalBuyQty * crypto.avgBuyPrice);
  }

  // eslint-disable-next-line prettier/prettier
  const totalBuyValue = mainApiData.reduce((sum, crypto) => sum + (crypto.totalBuyQty * crypto.avgBuyPrice), 0);

  const totalProfitLoss = mainApiData.reduce((sum, crypto) => sum + getProfitLoss(crypto), 0);
  const percentageTotalProfitLoss = 100 * (totalProfitLoss / totalBuyValue);

  return (
    <Card sx={{ display: 'flex', alignItems: 'center', p: 3 }}>
      <Box sx={{ flexGrow: 1 }}>
        <Typography variant="h6">Total Profit/Loss</Typography>

        <Stack direction="row" alignItems="center" spacing={1} sx={{ mt: 2, mb: 1 }}>
          <IconWrapperStyle
            sx={{
              ...(percentageTotalProfitLoss < 0 && {
                color: 'error.main',
                bgcolor: alpha(theme.palette.error.main, 0.16)
              })
            }}
          >
            <Icon width={16} height={16} icon={percentageTotalProfitLoss >= 0 ? trendingUpFill : trendingDownFill} />
          </IconWrapperStyle>
          <Typography component="span" variant="subtitle2" color={percentageTotalProfitLoss >= 0 ? 'primary' : 'error'}>
            {percentageTotalProfitLoss > 0 && '+'}
            {fPercent(percentageTotalProfitLoss)}
          </Typography>
        </Stack>

        <Typography variant="h3" color={totalProfitLoss >= 0 ? 'primary' : 'error'}>
          {totalProfitLoss >= 0 ? `+${fCurrency(totalProfitLoss)}` : fCurrency(totalProfitLoss)}
        </Typography>
      </Box>
    </Card>
  );
}
