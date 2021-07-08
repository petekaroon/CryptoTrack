import axios from 'axios';
import { useNavigate } from 'react-router-dom';
// material
import { alpha, experimentalStyled as styled } from '@material-ui/core/styles';
import { Box, AppBar, Toolbar, Button } from '@material-ui/core';

// ----------------------------------------------------------------------

const RootStyle = styled(AppBar)(({ theme }) => ({
  boxShadow: 'none',
  backdropFilter: 'blur(6px)',
  WebkitBackdropFilter: 'blur(6px)', // Fix on Mobile
  backgroundColor: alpha(theme.palette.background.default, 0.72)
}));

const ToolbarStyle = styled(Toolbar)(() => ({
  backgroundColor: '#00AB55'
}));

// ----------------------------------------------------------------------

export default function DashboardNavbar() {
  const navigate = useNavigate();

  const handleLogout = async () => {
    const response = await axios.delete('http://localhost:8000/auth-api/logout', { withCredentials: true });
    if (response) navigate('/auth/login');
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
