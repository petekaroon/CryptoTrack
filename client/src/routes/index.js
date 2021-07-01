import { Suspense, lazy } from 'react';
import { Navigate, useRoutes, useLocation } from 'react-router-dom';
// layouts
import PortfolioLayout from '../layouts/portfolio';
// components
import LoadingScreen from '../components/LoadingScreen';

// ----------------------------------------------------------------------

const Loadable = (Component) => (props) => {
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const { pathname } = useLocation();
  const isDashboard = pathname.includes('/dashboard');

  return (
    <Suspense
      fallback={
        <LoadingScreen
          sx={{
            ...(!isDashboard && {
              top: 0,
              left: 0,
              width: 1,
              zIndex: 9999,
              position: 'fixed'
            })
          }}
        />
      }
    >
      <Component {...props} />
    </Suspense>
  );
};

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
        { path: '404', element: <NotFound /> },
        { path: '*', element: <Navigate to="/404" replace /> }
      ]
    }
  ]);
}

// IMPORT COMPONENTS

// Auth
const Login = Loadable(lazy(() => import('../pages/authentication/Login')));
const Register = Loadable(lazy(() => import('../pages/authentication/Register')));

// Portfolio
const Portfolio = Loadable(lazy(() => import('../pages/Portfolio')));
const NotFound = Loadable(lazy(() => import('../pages/Page404')));
