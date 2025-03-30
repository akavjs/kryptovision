import React, { useState, useEffect } from 'react';
import { 
  Box, 
  Typography, 
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
  Chip,
  TableSortLabel,
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Slider,
  Tooltip,
  CircularProgress
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import InfoIcon from '@mui/icons-material/Info';
import { fetchYieldsData, formatYieldsData } from '../utils/api';

const Yields = () => {
  const theme = useTheme();
  const [order, setOrder] = useState('desc');
  const [orderBy, setOrderBy] = useState('apy');
  const [searchTerm, setSearchTerm] = useState('');
  const [projectFilter, setProjectFilter] = useState('');
  const [chainFilter, setChainFilter] = useState('');
  const [poolFilter, setPoolFilter] = useState('');
  const [tvlRange, setTvlRange] = useState([0, 20]);
  const [apyRange, setApyRange] = useState([0, 15]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [yieldsData, setYieldsData] = useState([]);
  const [projects, setProjects] = useState([]);
  const [chains, setChains] = useState([]);
  const [pools, setPools] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await fetchYieldsData();
        const formattedData = formatYieldsData(response);
        setYieldsData(formattedData);
        
        // Extraire les projets, chaînes et pools uniques
        const uniqueProjects = [...new Set(formattedData.map(item => item.project))];
        const uniqueChains = [...new Set(formattedData.map(item => item.chain))];
        const uniquePools = [...new Set(formattedData.map(item => item.pool))];
        
        setProjects(uniqueProjects);
        setChains(uniqueChains);
        setPools(uniquePools);
        
        // Déterminer les plages de TVL et APY
        const maxTvl = Math.max(...formattedData.map(item => item.tvl));
        const maxApy = Math.max(...formattedData.map(item => item.apy));
        
        setTvlRange([0, Math.ceil(maxTvl)]);
        setApyRange([0, Math.ceil(maxApy > 15 ? 15 : maxApy)]);
        
        setLoading(false);
      } catch (err) {
        console.error('Erreur lors de la récupération des données de rendement:', err);
        setError('Impossible de charger les données. Veuillez réessayer plus tard.');
        setLoading(false);
      }
    };
    
    fetchData();
  }, []);

  const handleRequestSort = (property) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  const createSortHandler = (property) => () => {
    handleRequestSort(property);
  };

  const filteredData = yieldsData.filter(yieldItem => 
    (yieldItem.pool.toLowerCase().includes(searchTerm.toLowerCase()) ||
     yieldItem.project.toLowerCase().includes(searchTerm.toLowerCase())) &&
    (projectFilter === '' || yieldItem.project === projectFilter) &&
    (chainFilter === '' || yieldItem.chain === chainFilter) &&
    (poolFilter === '' || yieldItem.pool === poolFilter) &&
    (yieldItem.tvl >= tvlRange[0] && yieldItem.tvl <= tvlRange[1]) &&
    (yieldItem.apy >= apyRange[0] && yieldItem.apy <= apyRange[1])
  );

  const sortedData = React.useMemo(() => {
    const comparator = (a, b) => {
      if (orderBy === 'pool' || orderBy === 'project' || orderBy === 'chain' || orderBy === 'risk') {
        return order === 'asc'
          ? a[orderBy].localeCompare(b[orderBy])
          : b[orderBy].localeCompare(a[orderBy]);
      } else {
        return order === 'asc'
          ? a[orderBy] - b[orderBy]
          : b[orderBy] - a[orderBy];
      }
    };
    return [...filteredData].sort(comparator);
  }, [filteredData, order, orderBy]);

  const handleTvlRangeChange = (event, newValue) => {
    setTvlRange(newValue);
  };

  const handleApyRangeChange = (event, newValue) => {
    setApyRange(newValue);
  };

  const getRiskColor = (risk) => {
    switch(risk) {
      case 'Faible':
        return theme.palette.success.main;
      case 'Moyen':
        return theme.palette.warning.main;
      case 'Élevé':
        return theme.palette.error.main;
      default:
        return theme.palette.text.primary;
    }
  };

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Rendements
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

      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
          <CircularProgress />
        </Box>
      ) : error ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
          <Typography color="error">{error}</Typography>
        </Box>
      ) : (
        <>
          <Grid container spacing={2} sx={{ mb: 3 }}>
            <Grid item xs={12} md={4}>
              <FormControl fullWidth variant="outlined" size="small">
                <InputLabel id="project-filter-label">Projet</InputLabel>
                <Select
                  labelId="project-filter-label"
                  id="project-filter"
                  value={projectFilter}
                  onChange={(e) => setProjectFilter(e.target.value)}
                  label="Projet"
                >
                  <MenuItem value="">Tous les projets</MenuItem>
                  {projects.map(project => (
                    <MenuItem key={project} value={project}>{project}</MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={4}>
              <FormControl fullWidth variant="outlined" size="small">
                <InputLabel id="chain-filter-label">Chaîne</InputLabel>
                <Select
                  labelId="chain-filter-label"
                  id="chain-filter"
                  value={chainFilter}
                  onChange={(e) => setChainFilter(e.target.value)}
                  label="Chaîne"
                >
                  <MenuItem value="">Toutes les chaînes</MenuItem>
                  {chains.map(chain => (
                    <MenuItem key={chain} value={chain}>{chain}</MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={4}>
              <FormControl fullWidth variant="outlined" size="small">
                <InputLabel id="pool-filter-label">Pool</InputLabel>
                <Select
                  labelId="pool-filter-label"
                  id="pool-filter"
                  value={poolFilter}
                  onChange={(e) => setPoolFilter(e.target.value)}
                  label="Pool"
                >
                  <MenuItem value="">Tous les pools</MenuItem>
                  {pools.map(pool => (
                    <MenuItem key={pool} value={pool}>{pool}</MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
          </Grid>

          <Grid container spacing={2} sx={{ mb: 3 }}>
            <Grid item xs={12} md={6}>
              <Paper sx={{ p: 2, backgroundColor: theme.palette.background.paper }}>
                <Typography variant="subtitle1" gutterBottom>
                  TVL Range (en milliards $)
                </Typography>
                <Box sx={{ px: 2 }}>
                  <Slider
                    value={tvlRange}
                    onChange={handleTvlRangeChange}
                    valueLabelDisplay="auto"
                    min={0}
                    max={Math.max(20, tvlRange[1])}
                    step={0.5}
                  />
                  <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Typography variant="body2">${tvlRange[0]}b</Typography>
                    <Typography variant="body2">${tvlRange[1]}b</Typography>
                  </Box>
                </Box>
              </Paper>
            </Grid>
            <Grid item xs={12} md={6}>
              <Paper sx={{ p: 2, backgroundColor: theme.palette.background.paper }}>
                <Typography variant="subtitle1" gutterBottom>
                  APY Range (%)
                </Typography>
                <Box sx={{ px: 2 }}>
                  <Slider
                    value={apyRange}
                    onChange={handleApyRangeChange}
                    valueLabelDisplay="auto"
                    min={0}
                    max={Math.max(15, apyRange[1])}
                    step={0.5}
                  />
                  <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Typography variant="body2">{apyRange[0]}%</Typography>
                    <Typography variant="body2">{apyRange[1]}%</Typography>
                  </Box>
                </Box>
              </Paper>
            </Grid>
          </Grid>

          <Paper sx={{ p: 2, backgroundColor: theme.palette.background.paper }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
              <Typography variant="h6">Classement des pools par rendement</Typography>
              <Box>
                <Chip 
                  label="APY" 
                  variant="outlined" 
                  color="primary" 
                  sx={{ mr: 1 }}
                  onClick={() => {
                    setOrderBy('apy');
                    setOrder('desc');
                  }}
                />
                <Chip 
                  label="TVL" 
                  variant="outlined" 
                  color="primary"
                  onClick={() => {
                    setOrderBy('tvl');
                    setOrder('desc');
                  }}
                />
              </Box>
            </Box>
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>#</TableCell>
                    <TableCell>
                      <TableSortLabel
                        active={orderBy === 'pool'}
                        direction={orderBy === 'pool' ? order : 'asc'}
                        onClick={createSortHandler('pool')}
                      >
                        Pool
                      </TableSortLabel>
                    </TableCell>
                    <TableCell>
                      <TableSortLabel
                        active={orderBy === 'project'}
                        direction={orderBy === 'project' ? order : 'asc'}
                        onClick={createSortHandler('project')}
                      >
                        Projet
                      </TableSortLabel>
                    </TableCell>
                    <TableCell>
                      <TableSortLabel
                        active={orderBy === 'chain'}
                        direction={orderBy === 'chain' ? order : 'asc'}
                        onClick={createSortHandler('chain')}
                      >
                        Chaîne
                      </TableSortLabel>
                    </TableCell>
                    <TableCell align="right">
                      <TableSortLabel
                        active={orderBy === 'tvl'}
                        direction={orderBy === 'tvl' ? order : 'asc'}
                        onClick={createSortHandler('tvl')}
                      >
                        TVL
                      </TableSortLabel>
                    </TableCell>
                    <TableCell align="right">
                      <TableSortLabel
                        active={orderBy === 'apy'}
                        direction={orderBy === 'apy' ? order : 'asc'}
                        onClick={createSortHandler('apy')}
                      >
                        APY
                      </TableSortLabel>
                    </TableCell>
                    <TableCell align="center">
                      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <TableSortLabel
                          active={orderBy === 'risk'}
                          direction={orderBy === 'risk' ? order : 'asc'}
                          onClick={createSortHandler('risk')}
                        >
                          Risque
                        </TableSortLabel>
                        <Tooltip title="Évaluation du niveau de risque basée sur l'audit du protocole, l'historique et la complexité">
                          <IconButton size="small">
                            <InfoIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                      </Box>
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {sortedData.map((row, index) => (
                    <TableRow key={row.id} hover>
                      <TableCell>{index + 1}</TableCell>
                      <TableCell>{row.pool}</TableCell>
                      <TableCell>{row.project}</TableCell>
                      <TableCell>{row.chain}</TableCell>
                      <TableCell align="right">${row.tvl.toFixed(3)}b</TableCell>
                      <TableCell 
                        align="right"
                        sx={{ color: row.apy > 0 ? theme.palette.success.main : theme.palette.text.secondary }}
                      >
                        {row.apy.toFixed(2)}%
                      </TableCell>
                      <TableCell align="center">
                        <Chip 
                          label={row.risk} 
                          size="small" 
                          sx={{ 
                            backgroundColor: `${getRiskColor(row.risk)}20`,
                            color: getRiskColor(row.risk),
                            borderColor: getRiskColor(row.risk)
                          }}
                          variant="outlined"
                        />
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Paper>
        </>
      )}
    </Box>
  );
};

export default Yields;
