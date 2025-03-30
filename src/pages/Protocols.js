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
  CircularProgress
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import { fetchTVLData, formatProtocolsData } from '../utils/api';

const Protocols = () => {
  const theme = useTheme();
  const [order, setOrder] = useState('desc');
  const [orderBy, setOrderBy] = useState('tvl');
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [chainFilter, setChainFilter] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [protocolsData, setProtocolsData] = useState([]);
  const [categories, setCategories] = useState([]);
  const [chains, setChains] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await fetchTVLData();
        const formattedData = formatProtocolsData(response);
        setProtocolsData(formattedData);
        
        // Extraire les catégories et chaînes uniques
        const uniqueCategories = [...new Set(formattedData.map(protocol => protocol.category))];
        const uniqueChains = [...new Set(formattedData.map(protocol => protocol.chain))];
        
        setCategories(uniqueCategories);
        setChains(uniqueChains);
        setLoading(false);
      } catch (err) {
        console.error('Erreur lors de la récupération des données des protocoles:', err);
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

  const filteredData = protocolsData.filter(protocol => 
    protocol.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
    (categoryFilter === '' || protocol.category === categoryFilter) &&
    (chainFilter === '' || protocol.chain === chainFilter)
  );

  const sortedData = React.useMemo(() => {
    const comparator = (a, b) => {
      if (orderBy === 'name' || orderBy === 'category' || orderBy === 'chain') {
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

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Protocoles
        </Typography>
        <Paper
          component="form"
          sx={{ p: '2px 4px', display: 'flex', alignItems: 'center', width: 300, backgroundColor: theme.palette.background.paper }}
        >
          <InputBase
            sx={{ ml: 1, flex: 1 }}
            placeholder="Rechercher un protocole..."
            inputProps={{ 'aria-label': 'rechercher un protocole' }}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <IconButton type="button" sx={{ p: '10px' }} aria-label="search">
            <SearchIcon />
          </IconButton>
        </Paper>
      </Box>

      <Grid container spacing={2} sx={{ mb: 3 }}>
        <Grid item xs={12} md={6}>
          <FormControl fullWidth variant="outlined" size="small">
            <InputLabel id="category-filter-label">Catégorie</InputLabel>
            <Select
              labelId="category-filter-label"
              id="category-filter"
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              label="Catégorie"
            >
              <MenuItem value="">Toutes les catégories</MenuItem>
              {categories.map(category => (
                <MenuItem key={category} value={category}>{category}</MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>
        <Grid item xs={12} md={6}>
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
      </Grid>

      <Paper sx={{ p: 2, backgroundColor: theme.palette.background.paper }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Typography variant="h6">Classement des protocoles par TVL</Typography>
          <Box>
            <Chip 
              label="TVL" 
              variant="outlined" 
              color="primary" 
              sx={{ mr: 1 }}
              onClick={() => {
                setOrderBy('tvl');
                setOrder('desc');
              }}
            />
            <Chip 
              label="Variation 24h" 
              variant="outlined" 
              color="primary"
              onClick={() => {
                setOrderBy('change1d');
                setOrder('desc');
              }}
            />
          </Box>
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
                  <TableCell>
                    <TableSortLabel
                      active={orderBy === 'name'}
                      direction={orderBy === 'name' ? order : 'asc'}
                      onClick={createSortHandler('name')}
                    >
                      Nom
                    </TableSortLabel>
                  </TableCell>
                  <TableCell>
                    <TableSortLabel
                      active={orderBy === 'category'}
                      direction={orderBy === 'category' ? order : 'asc'}
                      onClick={createSortHandler('category')}
                    >
                      Catégorie
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
                      active={orderBy === 'change1d'}
                      direction={orderBy === 'change1d' ? order : 'asc'}
                      onClick={createSortHandler('change1d')}
                    >
                      Variation 1j
                    </TableSortLabel>
                  </TableCell>
                  <TableCell align="right">
                    <TableSortLabel
                      active={orderBy === 'change7d'}
                      direction={orderBy === 'change7d' ? order : 'asc'}
                      onClick={createSortHandler('change7d')}
                    >
                      Variation 7j
                    </TableSortLabel>
                  </TableCell>
                  <TableCell align="right">
                    <TableSortLabel
                      active={orderBy === 'change1m'}
                      direction={orderBy === 'change1m' ? order : 'asc'}
                      onClick={createSortHandler('change1m')}
                    >
                      Variation 1m
                    </TableSortLabel>
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {sortedData.map((row, index) => (
                  <TableRow key={row.id} hover>
                    <TableCell>{index + 1}</TableCell>
                    <TableCell>{row.name}</TableCell>
                    <TableCell>
                      <Chip 
                        label={row.category} 
                        size="small" 
                        variant="outlined"
                      />
                    </TableCell>
                    <TableCell>{row.chain}</TableCell>
                    <TableCell align="right">${row.tvl.toFixed(3)}b</TableCell>
                    <TableCell 
                      align="right"
                      sx={{ color: row.change1d >= 0 ? theme.palette.success.main : theme.palette.error.main }}
                    >
                      {row.change1d >= 0 ? '+' : ''}{row.change1d?.toFixed(2) || '0.00'}%
                    </TableCell>
                    <TableCell 
                      align="right"
                      sx={{ color: row.change7d >= 0 ? theme.palette.success.main : theme.palette.error.main }}
                    >
                      {row.change7d >= 0 ? '+' : ''}{row.change7d?.toFixed(2) || '0.00'}%
                    </TableCell>
                    <TableCell 
                      align="right"
                      sx={{ color: row.change1m >= 0 ? theme.palette.success.main : theme.palette.error.main }}
                    >
                      {row.change1m >= 0 ? '+' : ''}{row.change1m?.toFixed(2) || '0.00'}%
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

export default Protocols;
