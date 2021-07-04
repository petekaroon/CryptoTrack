import { merge } from 'lodash';
import ReactApexChart from 'react-apexcharts';
import PropTypes from 'prop-types';
// material
import { useTheme, experimentalStyled as styled } from '@material-ui/core/styles';
import { Card, CardHeader } from '@material-ui/core';
// utils
import { fCurrency, fPercent } from '../../utils/formatNumber';
//
import { BaseOptionChart } from '../charts';

// ----------------------------------------------------------------------

const CHART_HEIGHT = 340;
const LEGEND_HEIGHT = 50;

const ChartWrapperStyle = styled('div')(({ theme }) => ({
  height: CHART_HEIGHT,
  marginTop: theme.spacing(1),
  '& .apexcharts-canvas svg': { height: CHART_HEIGHT },
  '& .apexcharts-canvas svg,.apexcharts-canvas foreignObject': {
    overflow: 'visible'
  },
  '& .apexcharts-legend': {
    height: LEGEND_HEIGHT,
    alignContent: 'center',
    position: 'relative !important',
    borderTop: `solid 1px ${theme.palette.divider}`,
    top: `calc(${CHART_HEIGHT - LEGEND_HEIGHT}px) !important`
  }
}));

// ----------------------------------------------------------------------

Overview.propTypes = {
  mainApiData: PropTypes.array,
  coinApiData: PropTypes.array
};

export default function Overview(props) {
  const theme = useTheme();
  const { mainApiData, coinApiData } = props;

  function getCurrentPrice(crypto) {
    return coinApiData.filter((coin) => coin.slug === crypto.name.toLowerCase()).map((coin) => coin.usd);
  }

  function getHoldingsValue(crypto) {
    return crypto.holdingQty * getCurrentPrice(crypto);
  }

  const currentBalance = mainApiData.reduce((sum, crypto) => sum + getHoldingsValue(crypto), 0);
  const labels = mainApiData.map((crypto) => crypto.name);
  const holdingData = mainApiData.map((crypto) => getHoldingsValue(crypto));

  const chartOptions = merge(BaseOptionChart(), {
    labels,
    stroke: { colors: [theme.palette.background.paper] },
    legend: { floating: true, horizontalAlign: 'center' },
    tooltip: {
      fillSeriesColor: false,
      y: {
        formatter: (val) => fPercent(100 * (val / currentBalance)),
        title: {
          formatter: (seriesName) => `${seriesName} :`
        }
      }
    },
    plotOptions: {
      pie: {
        donut: {
          size: '90%',
          labels: {
            value: {
              formatter: (val) => fCurrency(val)
            },
            total: {
              formatter: (w) => {
                const sum = w.globals.seriesTotals.reduce((a, b) => a + b, 0);
                return fCurrency(sum);
              }
            }
          }
        }
      }
    }
  });

  return (
    <Card>
      <CardHeader title="Overview" />
      <ChartWrapperStyle dir="ltr">
        <ReactApexChart type="donut" series={holdingData} options={chartOptions} height={280} />
      </ChartWrapperStyle>
    </Card>
  );
}
