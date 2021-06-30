import { Navigate } from 'react-router-dom';
// material
import { experimentalStyled as styled } from '@material-ui/core/styles';
// components
import Page from '../components/Page';
import {
  LandingHero,
  LandingMinimal,
  LandingDarkMode,
  LandingAdvertisement,
  LandingCleanInterfaces,
  LandingHugePackElements
} from '../components/_external-pages/landing';
// hooks
import { useQuery } from '../hooks/useQuery';

// ----------------------------------------------------------------------

const RootStyle = styled(Page)({
  height: '100%'
});

const ContentStyle = styled('div')(({ theme }) => ({
  overflow: 'hidden',
  position: 'relative',
  backgroundColor: theme.palette.background.default
}));

// ----------------------------------------------------------------------

export default function LandingPage() {
  const { statusCode, loading, data } = useQuery({
    url: 'http://localhost:8000/main-api'
  });

  if (loading) return <div />;

  if (statusCode === 401) {
    return <Navigate to="/auth/login" />;
  }

  if (statusCode === 200) {
    console.log(data);
    return (
      <RootStyle title="The starting point for your next project | Minimal-UI" id="move_top">
        <LandingHero />
        <ContentStyle>
          <LandingMinimal />
          <LandingHugePackElements />
          <LandingDarkMode />
          <LandingCleanInterfaces />
          <LandingAdvertisement />
        </ContentStyle>
      </RootStyle>
    );
  }
  return <div />;
}
