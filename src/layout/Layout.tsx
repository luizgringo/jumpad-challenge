import { useState } from 'react';
import type { ReactNode } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import {
  AppBar,
  Box,
  Container,
  Toolbar,
  Typography,
  Button,
  Link,
  CssBaseline,
  Divider,
  useTheme,
  useMediaQuery,
  IconButton,
  Drawer,
  List,
  ListItem,
  ListItemText,
  ListItemButton,
  Tabs,
  Tab,
  Stack,
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import PeopleIcon from '@mui/icons-material/People';
import ArticleIcon from '@mui/icons-material/Article';

/**
 * Interface que define as propriedades do componente Layout.
 * 
 * @property {ReactNode} children - Os elementos filhos que serão renderizados dentro do layout.
 */
interface LayoutProps {
  children: ReactNode;
}

/**
 * Componente que define a estrutura básica do layout da aplicação.
 * 
 * Este componente inclui o cabeçalho com navegação, o conteúdo principal e o rodapé.
 * Ele é usado como um wrapper para todas as páginas da aplicação, garantindo uma
 * aparência consistente em toda a aplicação.
 * 
 * @param {LayoutProps} props - As propriedades do componente.
 * @returns {JSX.Element} O componente Layout renderizado.
 */
export function Layout({ children }: LayoutProps) {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const [mobileOpen, setMobileOpen] = useState(false);
  const [activeTab, setActiveTab] = useState(0);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleTabChange = (_event: React.SyntheticEvent, newValue: number) => {
    setActiveTab(newValue);
  };

  const drawer = (
    <Box onClick={handleDrawerToggle} sx={{ textAlign: 'center' }}>
      <Typography variant="h6" sx={{ my: 2, fontWeight: 'bold' }}>
        Blog App
      </Typography>
      <Divider />
      <List>
        <ListItem disablePadding>
          <ListItemButton 
            component={RouterLink} 
            to="/" 
            sx={{ textAlign: 'center' }}
          >
            <ListItemText primary="Posts" />
          </ListItemButton>
        </ListItem>
        <ListItem disablePadding>
          <ListItemButton 
            component={RouterLink} 
            to="/users" 
            sx={{ textAlign: 'center' }}
          >
            <ListItemText primary="Usuários" />
          </ListItemButton>
        </ListItem>
      </List>
    </Box>
  );

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', width: '100%' }}>
      <CssBaseline />
      
      {/* Header principal */}
      <Container maxWidth="lg" sx={{ pt: 4, pb: 2 }}>
        <Stack 
          direction="row" 
          justifyContent="space-between" 
          alignItems="center"
          sx={{ mb: 2 }}
        >
          <Typography
            variant="h4"
            component={RouterLink}
            to="/"
            sx={{
              fontWeight: 700,
              letterSpacing: -0.5,
              textDecoration: 'none',
              color: 'text.primary',
            }}
          >
            Blog App
          </Typography>
          
          {!isMobile && (
            <Stack direction="row" spacing={2}>
              <Button
                variant="outlined"
                size="small"
                sx={{ borderRadius: '20px' }}
              >
                Entrar
              </Button>
              <Button
                variant="contained"
                size="small"
                sx={{ borderRadius: '20px' }}
              >
                Cadastrar
              </Button>
            </Stack>
          )}
          
          {isMobile && (
            <IconButton
              color="inherit"
              aria-label="abrir menu"
              edge="start"
              onClick={handleDrawerToggle}
            >
              <MenuIcon />
            </IconButton>
          )}
        </Stack>
        
        {/* Navegação principal */}
        {!isMobile ? (
          <Tabs 
            value={activeTab} 
            onChange={handleTabChange} 
            variant="fullWidth"
            sx={{ 
              mb: 3,
              '& .MuiTab-root': {
                textTransform: 'none',
                fontWeight: 600,
                fontSize: '1rem',
              }
            }}
          >
            <Tab 
              label="Todos os posts" 
              component={RouterLink} 
              to="/" 
              icon={<ArticleIcon />} 
              iconPosition="start"
            />
            <Tab 
              label="Usuários" 
              component={RouterLink} 
              to="/users" 
              icon={<PeopleIcon />} 
              iconPosition="start"
            />
          </Tabs>
        ) : (
          <Divider sx={{ mb: 3 }} />
        )}
      </Container>

      <Box component="nav">
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{
            keepMounted: true, // Melhor desempenho em dispositivos móveis
          }}
          sx={{
            display: { xs: 'block', sm: 'none' },
            '& .MuiDrawer-paper': { boxSizing: 'border-box', width: 240 },
          }}
        >
          {drawer}
        </Drawer>
      </Box>

      <Container 
        component="main" 
        maxWidth="lg"
        sx={{ 
          flexGrow: 1, 
          py: 2, 
          px: { xs: 2, sm: 3 },
        }}
      >
        {children}
      </Container>

      <Box
        component="footer"
        sx={{
          py: 4,
          px: 2,
          mt: 'auto',
          width: '100%',
          backgroundColor: theme.palette.mode === 'dark' ? theme.palette.background.paper : theme.palette.grey[100],
          borderTop: `1px solid ${theme.palette.divider}`,
        }}
      >
        <Container maxWidth="lg">
          <Typography variant="h6" align="center" gutterBottom>
            Blog App
          </Typography>
          <Typography variant="subtitle1" align="center" color="text.secondary" component="p" gutterBottom>
            Fique por dentro das últimas novidades sobre nossos produtos
          </Typography>
          <Typography variant="body2" color="text.secondary" align="center">
            &copy; {new Date().getFullYear()} Blog App - Desafio JumpAD
          </Typography>
        </Container>
      </Box>
    </Box>
  );
} 