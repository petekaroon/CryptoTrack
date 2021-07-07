import * as Yup from 'yup';
import { Form, FormikProvider, useFormik } from 'formik';
import PropTypes from 'prop-types';
import { useState, useEffect } from 'react';
import { LoadingButton, MobileDateTimePicker } from '@material-ui/lab';
import closeFill from '@iconify/icons-eva/close-fill';
import { Icon } from '@iconify/react';
import {
  Card,
  Chip,
  Grid,
  Button,
  Stack,
  Radio,
  Switch,
  Select,
  TextField,
  InputLabel,
  Typography,
  RadioGroup,
  FormControl,
  Autocomplete,
  InputAdornment,
  FormHelperText,
  FormControlLabel,
  ToggleButton,
  ToggleButtonGroup
} from '@material-ui/core';
import { MIconButton } from '../@material-extend';
// Components
import { BuySellToggle } from './modal';
// Api
import { addTransaction } from '../../api/Main';

// ----------------------------------------------------------------------

AddTransactionModal.propTypes = {
  supportedCryptos: PropTypes.array,
  handleSetLastUpdate: PropTypes.func,
  onClose: PropTypes.func,
  onCancel: PropTypes.func
};

export default function AddTransactionModal(props) {
  const { supportedCryptos, handleSetLastUpdate, onClose, isEdit, currentTransaction, onCancel } = props;

  const [transactionType, setTransactionType] = useState('buy');
  const [transactionCrypto, setTransactionCrypto] = useState();
  const [transactionQuantity, setTransactionQuantity] = useState();
  const [transactionPrice, setTransactionPrice] = useState();
  const [transactionTotal, setTransactionTotal] = useState(transactionQuantity * transactionPrice || 0);

  const handleTransactionTypeToggle = (event, newTransactionType) => {
    if (newTransactionType !== null) {
      setTransactionType(newTransactionType);
      setFieldValue('type', newTransactionType);
    }
  };

  const handleQuantityChange = (event) => {
    setTransactionQuantity(+event.target.value);
    setTransactionTotal(+event.target.value * transactionPrice);
    setFieldValue('quantity', +event.target.value);
    setFieldValue('total', +event.target.value * transactionPrice);
  };

  const handlePriceChange = (event) => {
    setTransactionPrice(+event.target.value);
    setTransactionTotal(+event.target.value * transactionQuantity);
    setFieldValue('pricePerCoin', +event.target.value);
    setFieldValue('total', +event.target.value * transactionQuantity);
  };

  const AddTransactionModalSchema = Yup.object().shape({
    quantity: Yup.number().positive().required('Quantity is required'),
    pricePerCoin: Yup.number().positive().required('Price Per Coin is required'),
    cryptoId: Yup.number().positive().required('cryptoId is required'),
    date: Yup.date()
  });

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: {
      type: currentTransaction?.type || 'buy',
      cryptoId: currentTransaction?.cryptoId || 1,
      quantity: currentTransaction?.quantity || '',
      pricePerCoin: currentTransaction?.pricePerCoin || '',
      date: currentTransaction?.date || '',
      total: currentTransaction?.total || '' // Need to calculate
    },
    validationSchema: AddTransactionModalSchema,
    onSubmit: async (values, { setSubmitting, resetForm, setErrors }) => {
      try {
        const { cryptoId, type, quantity, pricePerCoin, date, total } = values;
        await addTransaction(cryptoId, type, quantity, pricePerCoin, date, total);
        resetForm();
        setSubmitting(false);
        onClose();
        handleSetLastUpdate();
      } catch (error) {
        setSubmitting(false);
        setErrors(error);
      }
    }
  });

  const { errors, values, touched, handleSubmit, isSubmitting, setFieldValue, getFieldProps } = formik;

  // Example Code from ProductNewForm, CalendarForm, and UserNewForm
  return (
    <FormikProvider value={formik}>
      <Form noValidate autoComplete="off" onSubmit={handleSubmit}>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <Typography variant="h4">Add Transaction</Typography>
          </Grid>

          <Grid item xs={12}>
            <ToggleButtonGroup
              fullWidth
              size="small"
              color="primary"
              value={transactionType}
              exclusive
              onChange={handleTransactionTypeToggle}
            >
              <ToggleButton value="buy">Buy</ToggleButton>
              <ToggleButton value="sell">Sell</ToggleButton>
            </ToggleButtonGroup>
          </Grid>

          <Grid item xs={12}>
            <FormControl fullWidth>
              <InputLabel>Cryptocurrency</InputLabel>
              <Select label="Cryptocurrency" native {...getFieldProps('cryptoId')}>
                {supportedCryptos.map((crypto) => (
                  <option key={crypto.name} value={crypto.id}>
                    {`${crypto.name} (${crypto.symbol})`}
                  </option>
                ))}
              </Select>
            </FormControl>
          </Grid>

          <Grid item xs={6}>
            <TextField
              fullWidth
              label="Quantity"
              {...getFieldProps('quantity')}
              InputProps={{ type: 'number' }}
              onChange={handleQuantityChange}
              value={transactionQuantity}
              error={Boolean(touched.quantity && errors.quantity)}
              helperText={touched.quantity && errors.quantity}
            />
          </Grid>

          <Grid item xs={6}>
            <TextField
              fullWidth
              label="Price Per Coin"
              {...getFieldProps('pricePerCoin')}
              InputProps={{
                startAdornment: <InputAdornment position="start">$</InputAdornment>,
                type: 'number'
              }}
              onChange={handlePriceChange}
              value={transactionPrice}
              error={Boolean(touched.pricePerCoin && errors.pricePerCoin)}
              helperText={touched.pricePerCoin && errors.pricePerCoin}
            />
          </Grid>

          <Grid item xs={12}>
            <MobileDateTimePicker // Code from CalendarForm
              label="Date"
              value={values.start}
              inputFormat="dd/MM/yyyy hh:mm a"
              onChange={(date) => setFieldValue('date', date)}
              renderInput={(params) => <TextField {...params} fullWidth />}
            />
          </Grid>

          <Grid item xs={12}>
            <TextField
              disabled
              fullWidth
              label="Total"
              {...getFieldProps('total')}
              InputProps={{
                startAdornment: <InputAdornment position="start">$</InputAdornment>,
                type: 'number'
              }}
              value={transactionTotal}
              error={Boolean(touched.total && errors.total)}
              helperText={touched.total && errors.total}
            />
          </Grid>

          <Grid item xs={8}>
            <LoadingButton
              fullWidth
              size="large"
              type="submit"
              variant="contained"
              loading={isSubmitting}
              loadingIndicator="Loading..."
            >
              Add Transaction
            </LoadingButton>
          </Grid>

          <Grid item xs={4}>
            <Button fullWidth size="large" type="button" variant="outlined" color="primary" onClick={onCancel}>
              Cancel
            </Button>
          </Grid>
        </Grid>
      </Form>
    </FormikProvider>
  );
}
