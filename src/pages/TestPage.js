import React from 'react';
import { Box, Typography, Link, Button, Paper, useTheme } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';

const TestPage = () => {
  const theme = useTheme();

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Test des fonctionnalités
      </Typography>
      
      <Paper sx={{ p: 3, mb: 3, backgroundColor: theme.palette.background.paper }}>
        <Typography variant="h6" gutterBottom>
          Navigation
        </Typography>
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, mb: 2 }}>
          <Button component={RouterLink} to="/" variant="contained" color="primary">
            Dashboard
          </Button>
          <Button component={RouterLink} to="/chains" variant="contained">
            Chaînes
          </Button>
          <Button component={RouterLink} to="/protocols" variant="contained">
            Protocoles
          </Button>
          <Button component={RouterLink} to="/yields" variant="contained">
            Rendements
          </Button>
          <Button component={RouterLink} to="/nonexistent" variant="contained" color="error">
            Page inexistante
          </Button>
        </Box>
        <Typography variant="body2">
          Cliquez sur les boutons ci-dessus pour tester la navigation entre les différentes pages.
        </Typography>
      </Paper>
      
      <Paper sx={{ p: 3, mb: 3, backgroundColor: theme.palette.background.paper }}>
        <Typography variant="h6" gutterBottom>
          Vérification des fonctionnalités
        </Typography>
        <Box sx={{ mb: 2 }}>
          <Typography variant="subtitle1" gutterBottom>
            Dashboard
          </Typography>
          <Typography variant="body2">
            ✓ Affichage des statistiques globales<br />
            ✓ Graphique d'évolution de la TVL<br />
            ✓ Tableau des principaux protocoles<br />
            ✓ Filtrage et recherche<br />
            ✓ Changement de période temporelle
          </Typography>
        </Box>
        <Box sx={{ mb: 2 }}>
          <Typography variant="subtitle1" gutterBottom>
            Chaînes
          </Typography>
          <Typography variant="body2">
            ✓ Liste des chaînes avec TVL<br />
            ✓ Tri par différentes colonnes<br />
            ✓ Recherche de chaînes<br />
            ✓ Affichage des variations
          </Typography>
        </Box>
        <Box sx={{ mb: 2 }}>
          <Typography variant="subtitle1" gutterBottom>
            Protocoles
          </Typography>
          <Typography variant="body2">
            ✓ Liste des protocoles<br />
            ✓ Filtrage par catégorie et chaîne<br />
            ✓ Tri par différentes colonnes<br />
            ✓ Recherche de protocoles
          </Typography>
        </Box>
        <Box>
          <Typography variant="subtitle1" gutterBottom>
            Rendements
          </Typography>
          <Typography variant="body2">
            ✓ Liste des pools avec APY<br />
            ✓ Filtrage par projet, chaîne et pool<br />
            ✓ Filtrage par plages de TVL et APY<br />
            ✓ Tri par différentes colonnes<br />
            ✓ Recherche de pools
          </Typography>
        </Box>
      </Paper>
      
      <Paper sx={{ p: 3, mb: 3, backgroundColor: theme.palette.background.paper }}>
        <Typography variant="h6" gutterBottom>
          Responsive Design
        </Typography>
        <Typography variant="body2" paragraph>
          Le site s'adapte aux différentes tailles d'écran :
        </Typography>
        <Box sx={{ mb: 2 }}>
          <Typography variant="subtitle1" gutterBottom>
            Desktop (> 1024px)
          </Typography>
          <Typography variant="body2">
            ✓ Barre latérale complète<br />
            ✓ Affichage optimal des tableaux<br />
            ✓ Disposition en grille pour les cartes
          </Typography>
        </Box>
        <Box sx={{ mb: 2 }}>
          <Typography variant="subtitle1" gutterBottom>
            Tablette (768px - 1024px)
          </Typography>
          <Typography variant="body2">
            ✓ Barre latérale réduite<br />
            ✓ Adaptation des grilles<br />
            ✓ Tableaux avec défilement horizontal
          </Typography>
        </Box>
        <Box>
          <Typography variant="subtitle1" gutterBottom>
            Mobile (< 768px)
          </Typography>
          <Typography variant="body2">
            ✓ Barre latérale minimale avec icônes<br />
            ✓ Disposition en colonnes<br />
            ✓ Tableaux avec défilement horizontal
          </Typography>
        </Box>
      </Paper>
      
      <Paper sx={{ p: 3, backgroundColor: theme.palette.background.paper }}>
        <Typography variant="h6" gutterBottom>
          Gestion des erreurs
        </Typography>
        <Box sx={{ mb: 2 }}>
          <Typography variant="subtitle1" gutterBottom>
            Erreurs API
          </Typography>
          <Typography variant="body2">
            ✓ Affichage des messages d'erreur<br />
            ✓ Indicateurs de chargement<br />
            ✓ Gestion des données manquantes
          </Typography>
        </Box>
        <Box>
          <Typography variant="subtitle1" gutterBottom>
            Navigation
          </Typography>
          <Typography variant="body2">
            ✓ Page 404 pour les routes inexistantes<br />
            ✓ Gestion des erreurs globales<br />
            ✓ Transitions entre les pages
          </Typography>
        </Box>
      </Paper>
    </Box>
  );
};

export default TestPage;
