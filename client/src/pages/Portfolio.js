import { Navigate, Link } from 'react-router-dom';
// material
import { Container, Typography, Grid, Button } from '@material-ui/core';
// components
import Page from '../components/Page';
import LoadingScreen from '../components/LoadingScreen';
import { CurrentBalance, TotalProfitLoss, Overview, CryptoAssets, AddTransactionButton } from '../components/portfolio';
// hooks
import { useAPI } from '../hooks/useAPI';

// ----------------------------------------------------------------------

export default function Portfolio() {
  const { statusCode, loading, error, data } = useAPI({
    url: 'http://localhost:8000/auth-api', // Need to change to main-api
    method: 'GET',
    contentType: null,
    body: null
  });

  if (loading) return <LoadingScreen />;

  if (error && error.status === 401) {
    return <Navigate to="/auth/login" />;
  }

  if (statusCode === 200) {
    console.log(data);

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
                  Last update: 30 Jun 2021 at 20:12
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
              <Overview />
            </Grid>

            <Grid container spacing={3} item xs={12} sm={6}>
              <Grid item xs={12}>
                <CurrentBalance />
              </Grid>

              <Grid item xs={12}>
                <TotalProfitLoss />
              </Grid>

              <Grid item xs={12}>
                {/* <Button fullWidth size="large" variant="contained" onClick={() => <AddTransactionModal />}>
                  + Add Transaction
                </Button> */}
                <AddTransactionButton />
              </Grid>
            </Grid>

            <Grid item xs={12}>
              <CryptoAssets />
            </Grid>
          </Grid>
        </Container>
      </Page>
    );
  }
}
