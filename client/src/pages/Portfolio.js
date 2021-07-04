/* eslint-disable prefer-const */
import { Navigate, Link } from 'react-router-dom';
// material
import { Container, Typography, Grid, Button } from '@material-ui/core';
// components
import Page from '../components/Page';
import Page404 from './Page404';
import LoadingScreen from '../components/LoadingScreen';
import { CurrentBalance, TotalProfitLoss, Overview, CryptoAssets, AddTransactionButton } from '../components/portfolio';
// hooks
import { useAPI } from '../hooks/useAPI';

// ----------------------------------------------------------------------

const supportedCryptoList = ['bitcoin', 'ethereum', 'tether'];

function getCoinGeckoUrl(supportedCryptoList) {
  const baseUrl = new URL('https://api.coingecko.com/api/v3/simple/price');
  const cryptoListStr = supportedCryptoList.join('%2C');

  return `${baseUrl}?ids=${cryptoListStr}&vs_currencies=usd`;
}

function convertToArray(obj) {
  return Object.entries(obj).map((key) => ({ ...key[1] }));
}

function convertCollection(obj) {
  let keys = Object.keys(obj);
  return keys.map((key) => ({ slug: key, ...obj[key] }));
}

export default function Portfolio() {
  let {
    statusCode: mainApiStatusCode,
    loading: mainApiLoading,
    error: mainApiError,
    data: mainApiData
  } = useAPI({
    url: 'http://localhost:8000/main-api/',
    method: 'GET',
    contentType: null,
    credentials: 'include',
    body: null
  });

  let {
    statusCode: coinApiStatusCode,
    loading: coinApiLoading,
    error: coinApiError,
    data: coinApiData
  } = useAPI({
    url: getCoinGeckoUrl(supportedCryptoList),
    method: 'GET',
    contentType: null,
    credentials: 'same-origin',
    body: null
  });

  if (mainApiLoading || coinApiLoading) return <LoadingScreen />;

  if ((mainApiError && mainApiError.status === 401) || (coinApiError && coinApiError.status === 401)) {
    return <Navigate to="/auth/login" />;
  }

  if (mainApiStatusCode === 200 && coinApiStatusCode === 200) {
    mainApiData = convertToArray(mainApiData);
    coinApiData = convertCollection(coinApiData);
    console.log(mainApiData);
    console.log(coinApiData);

    return (
      <Page title="Portfolio | CryptoTrack">
        <Container maxWidth="xl">
          <Grid container spacing={3}>
            <Grid item xs={12} sm={8}>
              <Typography variant="h3">Your Portfolio</Typography>
              <Typography sx={{ color: 'text.secondary' }}>Track your crypto assets investment.</Typography>
            </Grid>

            <Grid container item xs={12} sm={4}>
              <Grid item xs={12}>
                <Typography paragraph align="center" variant="subtitle2" sx={{ color: 'text.secondary' }}>
                  {`Last update: ${new Date().toLocaleString()}`}
                </Typography>
              </Grid>

              <Grid item xs={12}>
                <Link to="/1">
                  <Button fullWidth size="medium" variant="contained">
                    Update Latest Price
                  </Button>
                </Link>
              </Grid>
            </Grid>

            <Grid item xs={12} sm={6}>
              <Overview mainApiData={mainApiData} coinApiData={coinApiData} />
            </Grid>

            <Grid container spacing={3} item xs={12} sm={6}>
              <Grid item xs={12}>
                <CurrentBalance mainApiData={mainApiData} coinApiData={coinApiData} />
              </Grid>

              <Grid item xs={12}>
                <TotalProfitLoss mainApiData={mainApiData} coinApiData={coinApiData} />
              </Grid>

              <Grid item xs={12}>
                <AddTransactionButton />
              </Grid>
            </Grid>

            <Grid item xs={12}>
              <CryptoAssets mainApiData={mainApiData} coinApiData={coinApiData} />
            </Grid>
          </Grid>
        </Container>
      </Page>
    );
  }

  return <Page404 />;
}
