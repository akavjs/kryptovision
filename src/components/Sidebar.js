import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  Box, 
  Drawer, 
  List, 
  ListItem, 
  ListItemIcon, 
  ListItemText,
  Typography,
  useTheme,
  useMediaQuery
} from '@mui/material';
import DashboardIcon from '@mui/icons-material/Dashboard';
import CurrencyBitcoinIcon from '@mui/icons-material/CurrencyBitcoin';
import AccountTreeIcon from '@mui/icons-material/AccountTree';
import AppsIcon from '@mui/icons-material/Apps';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import AssessmentIcon from '@mui/icons-material/Assessment';
import StrategyIcon from '@mui/icons-material/Lightbulb';
import SwapHorizIcon from '@mui/icons-material/SwapHoriz';
import SettingsIcon from '@mui/icons-material/Settings';

const drawerWidth = 240;

const menuItems = [
  { text: 'Portfolio', icon: <DashboardIcon />, path: '/' },
  { text: 'Cryptomonnaies', icon: <CurrencyBitcoinIcon />, path: '/cryptocurrencies' },
  { text: 'Chaînes', icon: <AccountTreeIcon />, path: '/chains' },
  { text: 'Protocoles', icon: <AppsIcon />, path: '/protocols' },
  { text: 'Rendements', icon: <TrendingUpIcon />, path: '/yields' },
  { text: 'Analyses', icon: <AssessmentIcon />, path: '/analysis' },
  { text: 'Stratégies', icon: <StrategyIcon />, path: '/strategies' },
  { text: 'Échanges', icon: <SwapHorizIcon />, path: '/exchanges' },
  { text: 'Paramètres', icon: <SettingsIcon />, path: '/settings' },
];

const Sidebar = () => {
  const theme = useTheme();
  const location = useLocation();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const drawer = (
    <>
      <Box sx={{ 
        display: 'flex', 
        alignItems: 'center', 
        padding: 2,
        borderBottom: `1px solid ${theme.palette.divider}`
      }}>
        <Typography variant="h6" component="div" sx={{ 
          color: theme.palette.primary.main,
          fontWeight: 'bold',
          fontSize: isMobile ? '1.2rem' : '1.5rem'
        }}>
          CryptoVision
        </Typography>
      </Box>
      <List>
        {menuItems.map((item) => (
          <ListItem 
            button 
            key={item.text} 
            component={Link} 
            to={item.path}
            sx={{
              backgroundColor: location.pathname === item.path 
                ? `${theme.palette.primary.main}20` 
                : 'transparent',
              borderLeft: location.pathname === item.path 
                ? `4px solid ${theme.palette.primary.main}` 
                : '4px solid transparent',
              '&:hover': {
                backgroundColor: `${theme.palette.primary.main}10`,
              },
              paddingLeft: isMobile ? 1 : 2
            }}
          >
            <ListItemIcon sx={{ 
              minWidth: isMobile ? 36 : 48,
              color: location.pathname === item.path 
                ? theme.palette.primary.main 
                : theme.palette.text.secondary
            }}>
              {item.icon}
            </ListItemIcon>
            {!isMobile && (
              <ListItemText 
                primary={item.text} 
                sx={{ 
                  color: location.pathname === item.path 
                    ? theme.palette.text.primary 
                    : theme.palette.text.secondary
                }}
              />
            )}
          </ListItem>
        ))}
      </List>
    </>
  );

  return (
    <Box
      component="nav"
      sx={{ width: { md: drawerWidth }, flexShrink: { md: 0 } }}
    >
      <Drawer
        variant="permanent"
        sx={{
          display: { xs: 'block', md: 'block' },
          '& .MuiDrawer-paper': {
            boxSizing: 'border-box',
            width: isMobile ? 72 : drawerWidth,
            borderRight: `1px solid ${theme.palette.divider}`,
            backgroundColor: theme.palette.background.paper,
          },
        }}
        open
      >
        {drawer}
      </Drawer>
    </Box>
  );
};

export default Sidebar;
