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
        <Router />
      </ThemePrimaryColor>
    </ThemeConfig>
  );
}
