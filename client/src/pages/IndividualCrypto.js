import { useNavigate, Navigate } from 'react-router-dom';
import React, { useState, useEffect } from 'react';
import axios from 'axios';
// material
import { Container, Typography, Grid, Button } from '@material-ui/core';
// components
import Page from '../components/Page';
import LoadingScreen from '../components/LoadingScreen';
import { CurrentBalance, TotalProfitLoss, Transactions } from '../components/individual-crypto';
// hooks
import { useAPI } from '../hooks/useAPI';

// ----------------------------------------------------------------------

export default function IndividualCrypto() {
  const navigate = useNavigate();
  const { statusCode, loading, error, data } = useAPI({
    url: 'http://localhost:8000/main-api',
    method: 'GET',
    contentType: null,
    credentials: 'include',
    body: null
  });

  if (loading) return <LoadingScreen />;

  if (error && error.status === 401) {
    return <Navigate to="/auth/login" />;
  }

  if (statusCode === 200) {
    console.log(data);

    return (
      <Page title="BTC | CryptoTrack">
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
              <Typography variant="h3">Crypto Name</Typography>
              <Typography sx={{ color: 'text.secondary' }}>Latest Market Price</Typography>
            </Grid>

            <Grid container item xs={12} sm={4}>
              <Grid item xs={12}>
                <Typography paragraph align="center" variant="subtitle2" sx={{ color: 'text.secondary' }}>
                  Last update: 30 Jun 2021 at 20:12
                </Typography>
              </Grid>
              <Grid item xs={12}>
                <Button fullWidth size="medium" variant="contained">
                  Update Latest Price
                </Button>
              </Grid>
            </Grid>

            <Grid container item spacing={3} xs={12} md={3}>
              <Grid item xs={12}>
                <Button
                  fullWidth
                  size="medium"
                  variant="contained"
                  onClick={() => {
                    navigate('/auth/register');
                  }}
                >
                  + Add Transaction
                </Button>
              </Grid>

              <Grid item xs={12}>
                <CurrentBalance />
              </Grid>

              <Grid item xs={12}>
                <TotalProfitLoss />
              </Grid>
            </Grid>

            <Grid item xs={12} md={9}>
              <Transactions />
            </Grid>
          </Grid>
        </Container>
      </Page>
    );
  }
}
