import React from 'react';
import { Box, Container, useTheme } from '@mui/material';
import Sidebar from './Sidebar';

const Layout = ({ children }) => {
  const theme = useTheme();
  
  return (
    <Box sx={{ display: 'flex', minHeight: '100vh' }}>
      <Sidebar />
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          width: { sm: `calc(100% - 240px)` },
          ml: { xs: '72px', md: '240px' },
          backgroundColor: theme.palette.background.default,
          overflow: 'auto'
        }}
      >
        <Container maxWidth="xl" sx={{ mt: 2 }}>
          {children}
        </Container>
      </Box>
    </Box>
  );
};

export default Layout;
