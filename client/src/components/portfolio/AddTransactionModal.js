import * as Yup from 'yup';
import { Form, FormikProvider, useFormik } from 'formik';
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

// ----------------------------------------------------------------------

const GENDER_OPTION = ['Men', 'Women', 'Kids'];

const CATEGORY_OPTION = [
  { group: 'Clothing', classify: ['Shirts', 'T-shirts', 'Jeans', 'Leather'] },
  { group: 'Tailored', classify: ['Suits', 'Blazers', 'Trousers', 'Waistcoats'] },
  { group: 'Accessories', classify: ['Shoes', 'Backpacks and bags', 'Bracelets', 'Face masks'] }
];

// ----------------------------------------------------------------------

export default function AddTransactionModal({ isEdit, currentUser, onCancel }) {
  const AddTransactionModalSchema = Yup.object().shape({
    quantity: Yup.number().positive().required('Quantity is required'),
    pricePerCoin: Yup.number().positive().required('Price Per Coin is required'),
    cryptocurrency: Yup.string().required('cryptocurrency is required'),
    date: Yup.date()
  });

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: {
      type: 'buy',
      cryptocurrency: currentUser?.cryptocurrency || '',
      quantity: currentUser?.quantity || '',
      pricePerCoin: currentUser?.pricePerCoin || '',
      date: currentUser?.date || '',
      total: currentUser?.total || '' // Need to calculate
    },
    validationSchema: AddTransactionModalSchema,
    onSubmit: async (values, { setSubmitting, resetForm, setErrors }) => {
      try {
        console.log('success');
      } catch (error) {
        console.log(error);
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
              // value={alignment}
              exclusive
              // onChange={handleChange}
            >
              <ToggleButton value="buy">Buy</ToggleButton>
              <ToggleButton value="sell">Sell</ToggleButton>
            </ToggleButtonGroup>
          </Grid>

          <Grid item xs={12}>
            <FormControl fullWidth>
              <InputLabel>Cryptocurrency</InputLabel>
              <Select label="Cryptocurrency" native {...getFieldProps('cryptocurrency')} value={values.category}>
                {CATEGORY_OPTION.map((category) => (
                  <optgroup key={category.group} label={category.group}>
                    {category.classify.map((classify) => (
                      <option key={classify} value={classify}>
                        {classify}
                      </option>
                    ))}
                  </optgroup>
                ))}
              </Select>
            </FormControl>
          </Grid>

          <Grid item xs={6}>
            <TextField fullWidth label="Quantity" {...getFieldProps('quantity')} />
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
              fullWidth
              label="Total"
              {...getFieldProps('total')}
              InputProps={{
                startAdornment: <InputAdornment position="start">$</InputAdornment>,
                type: 'number'
              }}
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
