import { Navigate, useRoutes } from 'react-router-dom';
// layouts
import PortfolioLayout from '../layouts/portfolio';

// Pages
import Login from '../pages/authentication/Login';
import Register from '../pages/authentication/Register';
import Portfolio from '../pages/Portfolio';
import IndividualCrypto from '../pages/IndividualCrypto';
import NotFound from '../pages/Page404';

// ----------------------------------------------------------------------

export default function Router() {
  return useRoutes([
    // Auth Routes
    {
      path: 'auth',
      children: [
        { path: 'login', element: <Login /> },
        { path: 'register', element: <Register /> }
      ]
    },

    // Portfolio Routes
    {
      path: '/',
      element: <PortfolioLayout />,
      children: [
        { path: '/', element: <Portfolio /> },
        { path: '/:crypto_id', element: <IndividualCrypto /> },
        { path: '404', element: <NotFound /> },
        { path: '*', element: <Navigate to="/404" replace /> }
      ]
    }
  ]);
}
