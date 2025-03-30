import React, { useState, useEffect } from 'react';
import { fetchTVLData, fetchHistoricalTVLData, formatTVLChartData, formatProtocolsData } from '../utils/api';
import { 
  Box, 
  Typography, 
  Grid, 
  Paper, 
  useTheme,
  InputBase,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  ButtonGroup,
  Button,
  CircularProgress
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import { 
  AreaChart,
  Area,
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer
} from 'recharts';

const Dashboard = () => {
  const theme = useTheme();
  const [timeRange, setTimeRange] = useState('1W');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [tvlData, setTvlData] = useState([]);
  const [protocolsData, setProtocolsData] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [globalStats, setGlobalStats] = useState({
    totalTvl: 0,
    totalChange24h: 0,
    stablecoins: 0,
    dexVolume: 0
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        // Récupérer les données historiques de TVL
        const historicalData = await fetchHistoricalTVLData();
        const formattedChartData = formatTVLChartData(historicalData);
        
        // Filtrer les données en fonction de la plage de temps sélectionnée
        let filteredData = formattedChartData;
        if (timeRange === '1D') {
          filteredData = formattedChartData.slice(-1);
        } else if (timeRange === '1W') {
          filteredData = formattedChartData.slice(-7);
        } else if (timeRange === '1M') {
          filteredData = formattedChartData.slice(-30);
        } else if (timeRange === '1Y') {
          filteredData = formattedChartData.slice(-365);
        }
        
        setTvlData(filteredData);
        
        // Récupérer les données des protocoles
        const protocolsResponse = await fetchTVLData();
        const formattedProtocols = formatProtocolsData(protocolsResponse);
        setProtocolsData(formattedProtocols);
        
        // Calculer les statistiques globales
        const totalTvl = formattedChartData.length > 0 ? formattedChartData[formattedChartData.length - 1].tvl : 0;
        const previousDayTvl = formattedChartData.length > 1 ? formattedChartData[formattedChartData.length - 2].tvl : 0;
        const change24h = previousDayTvl ? ((totalTvl - previousDayTvl) / previousDayTvl) * 100 : 0;
        
        // Estimer les valeurs pour les stablecoins et le volume DEX (données fictives pour l'instant)
        const stablecoins = totalTvl * 2.5; // Estimation
        const dexVolume = totalTvl * 0.1; // Estimation
        
        setGlobalStats({
          totalTvl,
          totalChange24h: change24h,
          stablecoins,
          dexVolume
        });
        
        setLoading(false);
      } catch (err) {
        console.error('Erreur lors de la récupération des données:', err);
        setError('Impossible de charger les données. Veuillez réessayer plus tard.');
        setLoading(false);
      }
    };
    
    fetchData();
  }, [timeRange]);

  // Filtrer les protocoles en fonction du terme de recherche
  const filteredProtocols = protocolsData.filter(protocol => 
    protocol.name.toLowerCase().includes(searchTerm.toLowerCase())
  ).slice(0, 10); // Limiter à 10 protocoles pour la page d'accueil

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Portfolio
        </Typography>
        <Paper
          component="form"
          sx={{ p: '2px 4px', display: 'flex', alignItems: 'center', width: 300, backgroundColor: theme.palette.background.paper }}
        >
          <InputBase
            sx={{ ml: 1, flex: 1 }}
            placeholder="Rechercher..."
            inputProps={{ 'aria-label': 'rechercher' }}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <IconButton type="button" sx={{ p: '10px' }} aria-label="search">
            <SearchIcon />
          </IconButton>
        </Paper>
      </Box>

      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 2, backgroundColor: theme.palette.background.paper }}>
            <Typography variant="subtitle1" color="text.secondary">
              Valeur Totale
            </Typography>
            {loading ? (
              <Box sx={{ display: 'flex', justifyContent: 'center', my: 2 }}>
                <CircularProgress size={24} />
              </Box>
            ) : (
              <>
                <Typography variant="h4" sx={{ my: 1 }}>
                  ${globalStats.totalTvl.toFixed(3)}b
                </Typography>
                <Typography 
                  variant="body2" 
                  color={globalStats.totalChange24h >= 0 ? 'success.main' : 'error.main'}
                >
                  {globalStats.totalChange24h >= 0 ? '+' : ''}{globalStats.totalChange24h.toFixed(2)}% (24h)
                </Typography>
              </>
            )}
          </Paper>
        </Grid>
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 2, backgroundColor: theme.palette.background.paper }}>
            <Typography variant="subtitle1" color="text.secondary">
              Stablecoins
            </Typography>
            {loading ? (
              <Box sx={{ display: 'flex', justifyContent: 'center', my: 2 }}>
                <CircularProgress size={24} />
              </Box>
            ) : (
              <>
                <Typography variant="h4" sx={{ my: 1 }}>
                  ${globalStats.stablecoins.toFixed(3)}b
                </Typography>
                <Typography variant="body2" color="success.main">
                  +1.2% (24h)
                </Typography>
              </>
            )}
          </Paper>
        </Grid>
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 2, backgroundColor: theme.palette.background.paper }}>
            <Typography variant="subtitle1" color="text.secondary">
              Volume DEX (24h)
            </Typography>
            {loading ? (
              <Box sx={{ display: 'flex', justifyContent: 'center', my: 2 }}>
                <CircularProgress size={24} />
              </Box>
            ) : (
              <>
                <Typography variant="h4" sx={{ my: 1 }}>
                  ${globalStats.dexVolume.toFixed(3)}b
                </Typography>
                <Typography variant="body2" color="error.main">
                  -3.4% (24h)
                </Typography>
              </>
            )}
          </Paper>
        </Grid>
      </Grid>

      <Paper sx={{ p: 2, mb: 4, backgroundColor: theme.palette.background.paper }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Typography variant="h6">Évolution de la TVL</Typography>
          <ButtonGroup variant="outlined" size="small">
            <Button 
              onClick={() => setTimeRange('1D')}
              variant={timeRange === '1D' ? 'contained' : 'outlined'}
            >
              1D
            </Button>
            <Button 
              onClick={() => setTimeRange('1W')}
              variant={timeRange === '1W' ? 'contained' : 'outlined'}
            >
              1S
            </Button>
            <Button 
              onClick={() => setTimeRange('1M')}
              variant={timeRange === '1M' ? 'contained' : 'outlined'}
            >
              1M
            </Button>
            <Button 
              onClick={() => setTimeRange('1Y')}
              variant={timeRange === '1Y' ? 'contained' : 'outlined'}
            >
              1A
            </Button>
            <Button 
              onClick={() => setTimeRange('MAX')}
              variant={timeRange === 'MAX' ? 'contained' : 'outlined'}
            >
              MAX
            </Button>
          </ButtonGroup>
        </Box>
        <Box sx={{ height: 300 }}>
          {loading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
              <CircularProgress />
            </Box>
          ) : error ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
              <Typography color="error">{error}</Typography>
            </Box>
          ) : (
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart
                data={tvlData}
                margin={{
                  top: 10,
                  right: 30,
                  left: 0,
                  bottom: 0,
                }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke={theme.palette.divider} />
                <XAxis 
                  dataKey="date" 
                  stroke={theme.palette.text.secondary}
                  tick={{ fill: theme.palette.text.secondary }}
                />
                <YAxis 
                  stroke={theme.palette.text.secondary}
                  tick={{ fill: theme.palette.text.secondary }}
                  tickFormatter={(value) => `$${value}b`}
                />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: theme.palette.background.paper,
                    border: `1px solid ${theme.palette.divider}`,
                    borderRadius: '4px'
                  }}
                  formatter={(value) => [`$${value}b`, 'TVL']}
                />
                <Area 
                  type="monotone" 
                  dataKey="tvl" 
                  stroke={theme.palette.primary.main} 
                  fill={`${theme.palette.primary.main}20`}
                />
              </AreaChart>
            </ResponsiveContainer>
          )}
        </Box>
      </Paper>

      <Paper sx={{ p: 2, backgroundColor: theme.palette.background.paper }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Typography variant="h6">Top Protocoles</Typography>
        </Box>
        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
            <CircularProgress />
          </Box>
        ) : error ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
            <Typography color="error">{error}</Typography>
          </Box>
        ) : (
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>#</TableCell>
                  <TableCell>Nom</TableCell>
                  <TableCell>Catégorie</TableCell>
                  <TableCell align="right">TVL</TableCell>
                  <TableCell align="right">Variation 1j</TableCell>
                  <TableCell align="right">Variation 7j</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredProtocols.map((row, index) => (
                  <TableRow key={row.id} hover>
                    <TableCell>{index + 1}</TableCell>
                    <TableCell>{row.name}</TableCell>
                    <TableCell>{row.category}</TableCell>
                    <TableCell align="right">${row.tvl.toFixed(3)}b</TableCell>
                    <TableCell 
                      align="right"
                      sx={{ color: row.change1d >= 0 ? theme.palette.success.main : theme.palette.error.main }}
                    >
                      {row.change1d >= 0 ? '+' : ''}{row.change1d.toFixed(2)}%
                    </TableCell>
                    <TableCell 
                      align="right"
                      sx={{ color: row.change7d >= 0 ? theme.palette.success.main : theme.palette.error.main }}
                    >
                      {row.change7d >= 0 ? '+' : ''}{row.change7d.toFixed(2)}%
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </Paper>
    </Box>
  );
};

export default Dashboard;
