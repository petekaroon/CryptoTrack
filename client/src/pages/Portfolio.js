/* eslint-disable prefer-const */
import { useState, useEffect } from 'react';
import axios from 'axios';
import { Navigate, Link, useNavigate } from 'react-router-dom';
// material
import { Container, Typography, Grid, Button } from '@material-ui/core';
// components
import Page from '../components/Page';
import Page404 from './Page404';
import LoadingScreen from '../components/LoadingScreen';
import { CurrentBalance, TotalProfitLoss, Overview, CryptoAssets, AddTransactionButton } from '../components/portfolio';
// api
import { loadPortfolio } from '../api/Main';

// ----------------------------------------------------------------------

function convertCollection(obj) {
  const keys = Object.keys(obj);
  return keys.map((key) => ({ slug: key, ...obj[key] }));
}

export default function Portfolio() {
  const navigate = useNavigate();
  const [mainApiStatusCode, setMainApiStatusCode] = useState();
  const [coinApiStatusCode, setCoinApiStatusCode] = useState();
  const [supportedCryptosStatusCode, setSupportedCryptosStatusCode] = useState();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState();
  const [mainApiData, setMainApiData] = useState();
  const [coinApiData, setCoinApiData] = useState();
  const [supportedCryptos, setSupportedCryptos] = useState();
  const [lastUpdate, setLastUpdate] = useState(new Date().toLocaleString());

  const handleSetLastUpdate = () => {
    setLastUpdate(new Date().toLocaleString());
  };

  useEffect(() => {
    let isMounted = true;
    const fetchData = async () => {
      setError(null);
      setLoading(true);

      try {
        const { mainApiResponse, coinApiResponse, supportedCryptosResponse } = await loadPortfolio();

        if (isMounted) {
          setMainApiData(mainApiResponse.data);
          setCoinApiData(convertCollection(coinApiResponse.data));
          setSupportedCryptos(supportedCryptosResponse.data);
          setMainApiStatusCode(mainApiResponse.status);
          setCoinApiStatusCode(coinApiResponse.status);
          setSupportedCryptosStatusCode(supportedCryptosResponse.status);
        }
      } catch (error) {
        if (isMounted) {
          setError(error.response);
        }
      }

      if (isMounted) setLoading(false);
    };

    fetchData();

    return () => {
      isMounted = false;
    };
  }, [lastUpdate]);

  return (
    <>
      {error && error.status === 401 && <Navigate to="/auth/login" />}
      {error && error.status !== 401 && <Navigate to="/page404" />}
      {(!mainApiData || !coinApiData || !supportedCryptos) && <LoadingScreen />}

      {mainApiStatusCode === 200 && coinApiStatusCode === 200 && supportedCryptosStatusCode === 200 && (
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
                    {`Last update: ${lastUpdate}`}
                  </Typography>
                </Grid>

                <Grid item xs={12}>
                  <Button
                    fullWidth
                    size="medium"
                    variant="contained"
                    onClick={() => setLastUpdate(new Date().toLocaleString())}
                  >
                    Update Latest Price
                  </Button>
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
                  <AddTransactionButton supportedCryptos={supportedCryptos} handleSetLastUpdate={handleSetLastUpdate} />
                </Grid>
              </Grid>

              <Grid item xs={12}>
                <CryptoAssets
                  mainApiData={mainApiData}
                  coinApiData={coinApiData}
                  handleSetLastUpdate={handleSetLastUpdate}
                />
              </Grid>
            </Grid>
          </Container>
        </Page>
      )}
    </>
  );
}
