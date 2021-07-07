import { useNavigate, Navigate, useParams } from 'react-router-dom';
import React, { useState, useEffect } from 'react';
// material
import { Container, Typography, Grid, Button } from '@material-ui/core';
// components
import Page from '../components/Page';
import LoadingScreen from '../components/LoadingScreen';
import {
  CurrentBalance,
  TotalProfitLoss,
  Transactions,
  AvgBuyPrice,
  AddTransactionButton
} from '../components/individual-crypto';
import Label from '../components/Label';
// api
import { loadIndividualCrypto } from '../api/Main';
import { fCurrency } from '../utils/formatNumber';

// ----------------------------------------------------------------------
function convertCollection(obj) {
  const keys = Object.keys(obj);
  return keys.map((key) => ({ slug: key, ...obj[key] }));
}

function getCurrentTime() {
  const inputDateStr = new Date().toLocaleString('en-CA');
  const dateArr = inputDateStr.split(' ');
  const dateStr = dateArr[0].slice();
  const timeStr = dateArr[1].slice();
  const amPmStr = `${dateArr[2][0].toUpperCase()}${dateArr[2][2].toUpperCase()}`;

  return `${dateStr} ${timeStr} ${amPmStr}`;
}

export default function IndividualCrypto() {
  const navigate = useNavigate();
  const params = useParams();

  const [mainApiStatusCode, setMainApiStatusCode] = useState();
  const [coinApiStatusCode, setCoinApiStatusCode] = useState();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState();
  const [mainApiData, setMainApiData] = useState();
  const [coinApiData, setCoinApiData] = useState();
  const [cryptoName, setCryptoName] = useState();
  const [cryptoSymbol, setCryptoSymbol] = useState();
  const [currentPrice, setCurrentPrice] = useState();
  const [lastUpdate, setLastUpdate] = useState(getCurrentTime());

  const cryptoId = +params.crypto_id;

  const handleSetLastUpdate = () => {
    setLastUpdate(getCurrentTime());
  };

  useEffect(() => {
    let isMounted = true;
    const fetchData = async () => {
      setError(null);
      setLoading(true);

      try {
        const { mainApiResponse, coinApiResponse } = await loadIndividualCrypto(cryptoId);

        if (isMounted) {
          setMainApiData(mainApiResponse.data);
          setCoinApiData(convertCollection(coinApiResponse.data));
          setMainApiStatusCode(mainApiResponse.status);
          setCoinApiStatusCode(coinApiResponse.status);
          setCryptoName(mainApiResponse.data[0].cryptoName);
          setCryptoSymbol(mainApiResponse.data[0].cryptoSymbol);
          setCurrentPrice(convertCollection(coinApiResponse.data)[0].usd);
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
      {(!mainApiData || !coinApiData) && <LoadingScreen />}
      {error && error.status === 401 && <Navigate to="/auth/login" />}
      {error && error.status !== 401 && <Navigate to="/page404" />}

      {mainApiStatusCode === 200 && coinApiStatusCode === 200 && (
        <Page title={`${cryptoSymbol} | CryptoTrack`}>
          <Container maxWidth="xl">
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <Button size="small" variant="text" onClick={() => navigate('/')}>
                  &lt; Back to Portfolio
                </Button>
              </Grid>
            </Grid>

            <Grid container alignItems="flex-start" spacing={3}>
              <Grid item xs={12} sm={8}>
                <Typography variant="h3">{cryptoName}</Typography>
                <Typography sx={{ color: 'text.secondary' }} style={{ display: 'inline-block' }}>
                  {cryptoSymbol} &nbsp; Price: &nbsp;
                </Typography>
                <Label variant="ghost" color="secondary">
                  {fCurrency(currentPrice)}
                </Label>
              </Grid>

              <Grid container item xs={12} sm={4}>
                <Grid item xs={12}>
                  <Typography paragraph align="center" variant="subtitle2" sx={{ color: 'text.secondary' }}>
                    Last update: &nbsp; {lastUpdate}
                  </Typography>
                </Grid>
                <Grid item xs={12}>
                  <Button fullWidth size="medium" variant="contained" onClick={handleSetLastUpdate}>
                    Update Latest Price
                  </Button>
                </Grid>
              </Grid>

              <Grid container item spacing={3} xs={12} md={3}>
                <Grid item xs={12}>
                  <AddTransactionButton
                    cryptoId={cryptoId}
                    cryptoName={cryptoName}
                    cryptoSymbol={cryptoSymbol}
                    handleSetLastUpdate={handleSetLastUpdate}
                  />
                </Grid>

                <Grid item xs={12}>
                  <CurrentBalance cryptoSymbol={cryptoSymbol} mainApiData={mainApiData} currentPrice={currentPrice} />
                </Grid>

                <Grid item xs={12}>
                  <TotalProfitLoss mainApiData={mainApiData} currentPrice={currentPrice} />
                </Grid>

                <Grid item xs={12}>
                  <AvgBuyPrice mainApiData={mainApiData} />
                </Grid>
              </Grid>

              <Grid item xs={12} md={9}>
                <Transactions
                  mainApiData={mainApiData}
                  cryptoId={cryptoId}
                  cryptoName={cryptoName}
                  cryptoSymbol={cryptoSymbol}
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
