// Fichier pour gérer les appels API et le traitement des données
import axios from 'axios';

// URL de base pour l'API CoinGecko
const COINGECKO_API_URL = 'https://api.coingecko.com/api/v3';

// Fonction pour récupérer les données globales du marché
export const fetchGlobalMarketData = async () => {
  try {
    const response = await axios.get(`${COINGECKO_API_URL}/global`);
    return response.data;
  } catch (error) {
    console.error('Erreur lors de la récupération des données globales:', error);
    throw error;
  }
};

// Fonction pour récupérer la liste des cryptomonnaies
export const fetchCryptocurrencies = async (page = 1, perPage = 100) => {
  try {
    const response = await axios.get(`${COINGECKO_API_URL}/coins/markets`, {
      params: {
        vs_currency: 'usd',
        order: 'market_cap_desc',
        per_page: perPage,
        page: page,
        sparkline: false,
        price_change_percentage: '1h,24h,7d,30d'
      }
    });
    return response.data;
  } catch (error) {
    console.error('Erreur lors de la récupération des cryptomonnaies:', error);
    throw error;
  }
};

// Fonction pour récupérer les détails d'une cryptomonnaie spécifique
export const fetchCryptoDetails = async (id) => {
  try {
    const response = await axios.get(`${COINGECKO_API_URL}/coins/${id}`, {
      params: {
        localization: false,
        tickers: false,
        market_data: true,
        community_data: false,
        developer_data: false,
        sparkline: false
      }
    });
    return response.data;
  } catch (error) {
    console.error(`Erreur lors de la récupération des détails pour ${id}:`, error);
    throw error;
  }
};

// Fonction pour récupérer l'historique des prix d'une cryptomonnaie
export const fetchCryptoHistory = async (id, days = 30) => {
  try {
    const response = await axios.get(`${COINGECKO_API_URL}/coins/${id}/market_chart`, {
      params: {
        vs_currency: 'usd',
        days: days
      }
    });
    return response.data;
  } catch (error) {
    console.error(`Erreur lors de la récupération de l'historique pour ${id}:`, error);
    throw error;
  }
};

// Fonction pour récupérer les données de TVL (Total Value Locked) depuis DefiLlama API
export const fetchTVLData = async () => {
  try {
    const response = await axios.get('https://api.llama.fi/protocols');
    return response.data;
  } catch (error) {
    console.error('Erreur lors de la récupération des données TVL:', error);
    throw error;
  }
};

// Fonction pour récupérer les données de TVL par chaîne
export const fetchTVLByChain = async () => {
  try {
    const response = await axios.get('https://api.llama.fi/chains');
    return response.data;
  } catch (error) {
    console.error('Erreur lors de la récupération des données TVL par chaîne:', error);
    throw error;
  }
};

// Fonction pour récupérer les données de rendement (yields) depuis DefiLlama API
export const fetchYieldsData = async () => {
  try {
    const response = await axios.get('https://yields.llama.fi/pools');
    return response.data;
  } catch (error) {
    console.error('Erreur lors de la récupération des données de rendement:', error);
    throw error;
  }
};

// Fonction pour formater les données TVL pour le graphique
export const formatTVLChartData = (data) => {
  if (!data || !data.tvl) return [];
  
  return data.tvl.map(item => ({
    date: new Date(item.date * 1000).toLocaleDateString(),
    tvl: parseFloat((item.totalLiquidityUSD / 1e9).toFixed(2)) // Convertir en milliards
  }));
};

// Fonction pour formater les données de protocoles
export const formatProtocolsData = (data) => {
  if (!data) return [];
  
  return data.map(protocol => ({
    id: protocol.id,
    name: protocol.name,
    category: protocol.category,
    chain: protocol.chain,
    tvl: parseFloat((protocol.tvl / 1e9).toFixed(3)), // Convertir en milliards
    change1d: protocol.change_1d,
    change7d: protocol.change_7d,
    change1m: protocol.change_30d
  }));
};

// Fonction pour formater les données de chaînes
export const formatChainsData = (data) => {
  if (!data) return [];
  
  return data.map(chain => ({
    id: chain.gecko_id || chain.name.toLowerCase(),
    name: chain.name,
    protocols: chain.protocols,
    tvl: parseFloat((chain.tvl / 1e9).toFixed(3)), // Convertir en milliards
    change1d: chain.change_1d,
    change7d: chain.change_7d,
    change1m: chain.change_30d
  }));
};

// Fonction pour formater les données de rendement
export const formatYieldsData = (data) => {
  if (!data || !data.data) return [];
  
  return data.data.map(pool => ({
    id: pool.pool,
    pool: pool.symbol,
    project: pool.project,
    chain: pool.chain,
    tvl: parseFloat((pool.tvlUsd / 1e9).toFixed(3)), // Convertir en milliards
    apy: parseFloat(pool.apy.toFixed(2)),
    risk: evaluateRisk(pool.apy, pool.stablecoin, pool.ilRisk)
  }));
};

// Fonction pour évaluer le niveau de risque d'un pool
const evaluateRisk = (apy, isStablecoin, ilRisk) => {
  if (apy > 15 || ilRisk === 'high') {
    return 'Élevé';
  } else if (apy > 5 || ilRisk === 'medium' || !isStablecoin) {
    return 'Moyen';
  } else {
    return 'Faible';
  }
};

// Fonction pour récupérer les données de prix historiques pour le graphique
export const fetchHistoricalTVLData = async () => {
  try {
    const response = await axios.get('https://api.llama.fi/charts/all');
    return response.data;
  } catch (error) {
    console.error('Erreur lors de la récupération des données historiques de TVL:', error);
    throw error;
  }
};
