import React, { useState, useEffect } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { Box, CircularProgress, Typography } from '@mui/material';

// Pages
import Dashboard from './pages/Dashboard';
import Cryptocurrencies from './pages/Cryptocurrencies';
import Chains from './pages/Chains';
import Protocols from './pages/Protocols';
import Yields from './pages/Yields';
import Analysis from './pages/Analysis';
import Strategies from './pages/Strategies';
import Exchanges from './pages/Exchanges';
import Settings from './pages/Settings';

// Components
import Layout from './components/Layout';

// Thème sombre personnalisé
const darkTheme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#3772ff',
    },
    secondary: {
      main: '#00c853',
    },
    error: {
      main: '#ff3d71',
    },
    warning: {
      main: '#ffaa00',
    },
    success: {
      main: '#00c853',
    },
    background: {
      default: '#121212',
      paper: '#1e1e1e',
    },
    text: {
      primary: '#ffffff',
      secondary: '#b3b3b3',
    },
  },
  typography: {
    fontFamily: '"Inter", "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          scrollbarColor: "#6b6b6b #2b2b2b",
          "&::-webkit-scrollbar, & *::-webkit-scrollbar": {
            backgroundColor: "#2b2b2b",
            width: "8px",
          },
          "&::-webkit-scrollbar-thumb, & *::-webkit-scrollbar-thumb": {
            borderRadius: 8,
            backgroundColor: "#6b6b6b",
            minHeight: 24,
          },
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
        },
      },
    },
    MuiTableCell: {
      styleOverrides: {
        root: {
          borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
        },
        head: {
          fontWeight: 600,
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          fontSize: '0.75rem',
        },
      },
    },
  },
});

// Composant de page de chargement
const LoadingPage = () => (
  <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
    <CircularProgress />
  </Box>
);

// Composant de page d'erreur
const ErrorPage = ({ message }) => (
  <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', flexDirection: 'column' }}>
    <Typography variant="h5" color="error" gutterBottom>
      Erreur
    </Typography>
    <Typography variant="body1">
      {message || "Une erreur s'est produite. Veuillez réessayer plus tard."}
    </Typography>
  </Box>
);

// Composant de page non trouvée
const NotFoundPage = () => (
  <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', flexDirection: 'column' }}>
    <Typography variant="h5" gutterBottom>
      Page non trouvée
    </Typography>
    <Typography variant="body1">
      La page que vous recherchez n'existe pas.
    </Typography>
  </Box>
);

// Pages temporaires pour les sections non encore implémentées
const TemporaryPage = ({ title }) => (
  <Box sx={{ p: 3 }}>
    <Typography variant="h4" gutterBottom>
      {title}
    </Typography>
    <Typography variant="body1">
      Cette section est en cours de développement et sera disponible prochainement.
    </Typography>
  </Box>
);

function App() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const location = useLocation();

  // Effet pour simuler le chargement lors des changements de page
  useEffect(() => {
    setLoading(true);
    setError(null);
    
    const timer = setTimeout(() => {
      setLoading(false);
    }, 500);
    
    return () => clearTimeout(timer);
  }, [location.pathname]);

  // Gestion des erreurs globales
  useEffect(() => {
    const handleError = (event) => {
      console.error('Erreur globale:', event.error);
      setError("Une erreur inattendue s'est produite. Veuillez rafraîchir la page.");
    };
    
    window.addEventListener('error', handleError);
    
    return () => {
      window.removeEventListener('error', handleError);
    };
  }, []);

  if (error) {
    return (
      <ThemeProvider theme={darkTheme}>
        <CssBaseline />
        <ErrorPage message={error} />
      </ThemeProvider>
    );
  }

  return (
    <ThemeProvider theme={darkTheme}>
      <CssBaseline />
      <Layout>
        {loading ? (
          <LoadingPage />
        ) : (
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/cryptocurrencies" element={<TemporaryPage title="Cryptomonnaies" />} />
            <Route path="/chains" element={<Chains />} />
            <Route path="/protocols" element={<Protocols />} />
            <Route path="/yields" element={<Yields />} />
            <Route path="/analysis" element={<TemporaryPage title="Analyses" />} />
            <Route path="/strategies" element={<TemporaryPage title="Stratégies" />} />
            <Route path="/exchanges" element={<TemporaryPage title="Échanges" />} />
            <Route path="/settings" element={<TemporaryPage title="Paramètres" />} />
            <Route path="/test" element={<TestPage />} />
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        )}
      </Layout>
    </ThemeProvider>
  );
}

export default App;
