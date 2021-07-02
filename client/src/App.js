import AdapterDateFns from '@material-ui/lab/AdapterDateFns';
import LocalizationProvider from '@material-ui/lab/LocalizationProvider';
// routes
import Router from './routes';
// theme
import ThemeConfig from './theme';
// components
import ThemePrimaryColor from './components/ThemePrimaryColor';

// ----------------------------------------------------------------------

export default function App() {
  return (
    <ThemeConfig>
      <ThemePrimaryColor>
        <LocalizationProvider dateAdapter={AdapterDateFns}>
          <Router />
        </LocalizationProvider>
      </ThemePrimaryColor>
    </ThemeConfig>
  );
}
