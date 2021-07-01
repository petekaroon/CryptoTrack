import { useNavigate } from 'react-router-dom';
// material
import { alpha, experimentalStyled as styled } from '@material-ui/core/styles';
import { Box, AppBar, Toolbar, Button } from '@material-ui/core';

// ----------------------------------------------------------------------

const DRAWER_WIDTH = 280;
const APPBAR_MOBILE = 64;
const APPBAR_DESKTOP = 92;

const RootStyle = styled(AppBar)(({ theme }) => ({
  boxShadow: 'none',
  backdropFilter: 'blur(6px)',
  WebkitBackdropFilter: 'blur(6px)', // Fix on Mobile
  backgroundColor: alpha(theme.palette.background.default, 0.72),
  [theme.breakpoints.up('lg')]: {
    width: `calc(100% - ${DRAWER_WIDTH + 1}px)`
  }
}));

const ToolbarStyle = styled(Toolbar)(({ theme }) => ({
  minHeight: APPBAR_MOBILE,
  backgroundColor: '#00AB55',
  [theme.breakpoints.up('lg')]: {
    minHeight: APPBAR_DESKTOP,
    padding: theme.spacing(0, 5)
  }
}));

// ----------------------------------------------------------------------

export default function DashboardNavbar() {
  const navigate = useNavigate();

  const handleLogout = () => {
    fetch('http://localhost:8000/auth-api/logout', {
      method: 'DELETE',
      credentials: 'include'
    }).then((response) => {
      if (response.ok) {
        navigate('/auth/login');
      }
    });
  };

  return (
    <RootStyle>
      <ToolbarStyle>
        <h1>CryptoTrack</h1>
        <Box sx={{ flexGrow: 1 }} />

        <Button size="large" color="inherit" variant="outlined" onClick={handleLogout}>
          Logout
        </Button>
      </ToolbarStyle>
    </RootStyle>
  );
}
