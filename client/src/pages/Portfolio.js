import { useNavigate, Navigate } from 'react-router-dom';
// material
import { Container, Typography, Grid, Button } from '@material-ui/core';
// components
import Page from '../components/Page';
import { CurrentBalance, TotalProfitLoss, Overview, CryptoAssets } from '../components/portfolio';
// hooks
import { useVerifyUser } from '../hooks/useVerifyUser';

// ----------------------------------------------------------------------

export default function Portfolio() {
  const navigate = useNavigate();
  const { statusCode, loading, error, user } = useVerifyUser({
    url: 'http://localhost:8000/main-api'
  });

  if (loading) return <div />;

  if (error && error.status === 401) {
    return <Navigate to="/auth/login" />;
  }

  if (statusCode === 200) {
    console.log(user);

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
                <Button
                  fullWidth
                  size="medium"
                  variant="contained"
                  onClick={() => {
                    navigate('/auth/register');
                  }}
                >
                  Update Latest Price
                </Button>
              </Grid>
            </Grid>

            <Grid item xs={12} sm={6}>
              <Overview />
            </Grid>

            <Grid container item xs={12} sm={6}>
              <Grid item xs={12}>
                <CurrentBalance />
              </Grid>

              <Grid item xs={12}>
                <TotalProfitLoss />
              </Grid>

              <Grid item xs={12}>
                <Button
                  fullWidth
                  size="large"
                  variant="contained"
                  onClick={() => {
                    navigate('/auth/register');
                  }}
                >
                  + Add Transaction
                </Button>
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
  return <div />;
}
