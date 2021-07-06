import PropTypes from 'prop-types';
import { useNavigate, Link as RouterLink } from 'react-router-dom';
// material
import { useTheme } from '@material-ui/core/styles';
import {
  Card,
  Link,
  Table,
  TableRow,
  TableBody,
  TableCell,
  TableHead,
  Typography,
  CardHeader,
  TableContainer
} from '@material-ui/core';
// utils
import { fCurrency, fPercent, fNumber } from '../../utils/formatNumber';
//
import Label from '../Label';
import Scrollbar from '../Scrollbar';
import AssetMoreMenu from './AssetMoreMenu';

// ----------------------------------------------------------------------

CryptoAssets.propTypes = {
  mainApiData: PropTypes.array,
  coinApiData: PropTypes.array,
  handleSetLastUpdate: PropTypes.func
};

export default function CryptoAssets(props) {
  const theme = useTheme();
  const navigate = useNavigate();
  const { mainApiData, coinApiData, handleSetLastUpdate } = props;

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

  function getPercentageProfitLoss(crypto) {
    return 100 * (getProfitLoss(crypto) / (crypto.totalBuyQty * crypto.avgBuyPrice));
  }

  return (
    <Card>
      <CardHeader title="Crypto Assets" sx={{ mb: 3 }} />
      <Scrollbar>
        <TableContainer sx={{ minWidth: 720 }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Asset</TableCell>
                <TableCell align="right">Current Price</TableCell>
                <TableCell align="right">Holdings</TableCell>
                <TableCell align="right">Holdings Value</TableCell>
                <TableCell align="right">Avg. Buy Price</TableCell>
                <TableCell align="right">Profit/Loss</TableCell>
                <TableCell align="right">%</TableCell>
                <TableCell />
              </TableRow>
            </TableHead>
            <TableBody>
              {mainApiData.map((crypto) => (
                <TableRow key={crypto.cryptoId}>
                  <TableCell>
                    <Link color="secondary" component={RouterLink} to={`/${crypto.cryptoId}`}>
                      <Typography fontWeight="fontWeightBold">{`${crypto.name} : ${crypto.symbol}`}</Typography>
                    </Link>
                  </TableCell>
                  <TableCell align="right">{fCurrency(getCurrentPrice(crypto))}</TableCell>
                  <TableCell align="right">{`${fNumber(crypto.holdingQty)} ${crypto.symbol}`}</TableCell>
                  <TableCell align="right">{fCurrency(getHoldingsValue(crypto))}</TableCell>
                  <TableCell align="right">{fCurrency(crypto.avgBuyPrice)}</TableCell>

                  <TableCell align="right">
                    <Label
                      variant={theme.palette.mode === 'light' ? 'ghost' : 'filled'}
                      color={
                        (getProfitLoss(crypto) === 0 && 'warning') ||
                        (getProfitLoss(crypto) < 0 && 'error') ||
                        'success'
                      }
                    >
                      {getProfitLoss(crypto) >= 0
                        ? `+${fCurrency(getProfitLoss(crypto))}`
                        : fCurrency(getProfitLoss(crypto))}
                    </Label>
                  </TableCell>

                  <TableCell align="right">
                    <Label
                      variant={theme.palette.mode === 'light' ? 'ghost' : 'filled'}
                      color={
                        (getPercentageProfitLoss(crypto) === 0 && 'warning') ||
                        (getPercentageProfitLoss(crypto) < 0 && 'error') ||
                        'success'
                      }
                    >
                      {getPercentageProfitLoss(crypto) >= 0
                        ? `+${fPercent(getPercentageProfitLoss(crypto))}`
                        : fPercent(getPercentageProfitLoss(crypto))}
                    </Label>
                  </TableCell>

                  <TableCell align="right">
                    <AssetMoreMenu cryptoId={crypto.cryptoId} handleSetLastUpdate={handleSetLastUpdate} />
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
