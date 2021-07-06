import { replace } from 'lodash';
import numeral from 'numeral';

// ----------------------------------------------------------------------

export function fCurrency(number) {
  if (number === 0) return numeral(number).format('$ 0');
  if (Math.abs(number) < 10) return numeral(number).format('$ 0,0.0000');
  if (Math.abs(number) < 10000) return numeral(number).format('$ 0,0.00');
  return numeral(number).format('$ 0,0');
}

export function fPercent(number) {
  return numeral(number / 100).format('0.0 %');
}

export function fNumber(number) {
  if (number === 0) return numeral(number).format('$ 0');
  if (Math.abs(number) < 0.01) return numeral(number).format('0,0.000000');
  if (Math.abs(number) < 1) return numeral(number).format('0,0.0000');
  if (Math.abs(number) < 1000) return numeral(number).format('0,0.00');
  return numeral(number).format('0,0');
}

export function fShortenNumber(number) {
  return replace(numeral(number).format('0.00a'), '.00', '');
}

export function fData(number) {
  return numeral(number).format('0.0 b');
}
