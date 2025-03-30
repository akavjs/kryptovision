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
  CircularProgress
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import { fetchTVLByChain, formatChainsData } from '../utils/api';

const Chains = () => {
  const theme = useTheme();
  const [order, setOrder] = useState('desc');
  const [orderBy, setOrderBy] = useState('tvl');
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [chainsData, setChainsData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await fetchTVLByChain();
        const formattedData = formatChainsData(response);
        setChainsData(formattedData);
        setLoading(false);
      } catch (err) {
        console.error('Erreur lors de la récupération des données des chaînes:', err);
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

  const filteredData = chainsData.filter(chain => 
    chain.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const sortedData = React.useMemo(() => {
    const comparator = (a, b) => {
      if (orderBy === 'name') {
        return order === 'asc'
          ? a.name.localeCompare(b.name)
          : b.name.localeCompare(a.name);
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
          Chaînes
        </Typography>
        <Paper
          component="form"
          sx={{ p: '2px 4px', display: 'flex', alignItems: 'center', width: 300, backgroundColor: theme.palette.background.paper }}
        >
          <InputBase
            sx={{ ml: 1, flex: 1 }}
            placeholder="Rechercher une chaîne..."
            inputProps={{ 'aria-label': 'rechercher une chaîne' }}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <IconButton type="button" sx={{ p: '10px' }} aria-label="search">
            <SearchIcon />
          </IconButton>
        </Paper>
      </Box>

      <Paper sx={{ p: 2, backgroundColor: theme.palette.background.paper }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Typography variant="h6">Toutes les chaînes par TVL</Typography>
          <Box>
            <Chip 
              label="Protocoles" 
              variant="outlined" 
              color="primary" 
              sx={{ mr: 1 }}
              onClick={() => {
                setOrderBy('protocols');
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
                  <TableCell align="right">
                    <TableSortLabel
                      active={orderBy === 'protocols'}
                      direction={orderBy === 'protocols' ? order : 'asc'}
                      onClick={createSortHandler('protocols')}
                    >
                      Protocoles
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
                    <TableCell align="right">{row.protocols}</TableCell>
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

export default Chains;
