import { useState, useEffect, useMemo } from 'react';
import { useParams, Link as RouterLink } from 'react-router-dom';
import { 
  Typography, 
  Box, 
  Card, 
  CardContent, 
  CardActions, 
  Button, 
  CircularProgress, 
  Alert, 
  Grid, 
  Paper, 
  Divider,
  Avatar,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  useTheme,
  useMediaQuery,
  Chip,
  Stack,
  Container,
  CardMedia,
  Tab,
  Tabs
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import EmailIcon from '@mui/icons-material/Email';
import PhoneIcon from '@mui/icons-material/Phone';
import LanguageIcon from '@mui/icons-material/Language';
import BusinessIcon from '@mui/icons-material/Business';
import ArticleIcon from '@mui/icons-material/Article';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import PersonIcon from '@mui/icons-material/Person';
import { getUser, getPosts } from '../../services/api';
import { generateRealisticAvatar } from '../../utils/avatar';
import { getPostImageUrl, usePreloadPostImages } from '../../utils/imagePreloader';
import type { User, Post } from '../../types';

/**
 * Página que exibe os detalhes de um usuário e seus posts.
 * 
 * @returns {JSX.Element} A página UserDetail renderizada.
 */
export function UserDetail() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  
  const { id } = useParams<{ id: string }>();
  const [user, setUser] = useState<User | null>(null);
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [tabValue, setTabValue] = useState(0);

  // Gerar URL única para o avatar do usuário
  const avatarUrl = useMemo(() => {
    if (!user) return '';
    return generateRealisticAvatar(user.id);
  }, [user]);

  // Extrair IDs dos posts para pré-carregamento
  const postIds = useMemo(() => {
    return posts.map(post => post.id);
  }, [posts]);
  
  // Pré-carregar imagens dos posts
  usePreloadPostImages(postIds, 400, 200);

  useEffect(() => {
    const fetchUserData = async () => {
      if (!id) return;
      
      try {
        setLoading(true);
        const userId = Number.parseInt(id, 10);
        const userData = await getUser(userId);
        setUser(userData);
        
        // Buscar posts do usuário
        const allPosts = await getPosts();
        const postsData = allPosts.filter(post => post.userId === userId);
        setPosts(postsData);
        
        setLoading(false);
      } catch (error) {
        setError(error instanceof Error ? error : new Error('Erro ao carregar dados do usuário'));
        setLoading(false);
      }
    };

    fetchUserData();
  }, [id]);

  const handleTabChange = (_event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  // Função para obter a URL da imagem de um post
  const getPostImage = (postId: number) => {
    return getPostImageUrl(postId, 400, 200);
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Alert severity="error" sx={{ my: 2 }}>
        {error.message}
      </Alert>
    );
  }

  if (!user) {
    return (
      <Alert severity="info" sx={{ my: 2 }}>
        Usuário não encontrado.
      </Alert>
    );
  }

  return (
    <Box sx={{ width: '100%' }}>
      <Button
        component={RouterLink}
        to="/users"
        startIcon={<ArrowBackIcon />}
        sx={{ mb: 3 }}
        size={isMobile ? "small" : "medium"}
      >
        Voltar para a lista
      </Button>

      {/* Cabeçalho do perfil */}
      <Paper
        sx={{
          position: 'relative',
          backgroundColor: theme.palette.primary.main,
          color: '#fff',
          mb: 4,
          borderRadius: 2,
          overflow: 'hidden',
        }}
      >
        <Box
          sx={{
            position: 'absolute',
            top: 0,
            right: 0,
            width: '100%',
            height: '100%',
            backgroundImage: 'linear-gradient(135deg, rgba(0,0,0,0.1) 0%, rgba(0,0,0,0.4) 100%)',
          }}
        />
        <Container maxWidth="lg">
          <Box
            sx={{
              position: 'relative',
              py: { xs: 4, md: 6 },
              display: 'flex',
              flexDirection: { xs: 'column', md: 'row' },
              alignItems: { xs: 'center', md: 'flex-start' },
              gap: 3,
            }}
          >
            <Avatar 
              src={avatarUrl}
              sx={{ 
                width: { xs: 100, md: 150 }, 
                height: { xs: 100, md: 150 },
                bgcolor: theme.palette.background.paper,
                color: theme.palette.primary.main,
                fontSize: { xs: '3rem', md: '4rem' },
                border: `4px solid ${theme.palette.background.paper}`,
              }}
            >
              {user.name.charAt(0)}
            </Avatar>
            
            <Box sx={{ textAlign: { xs: 'center', md: 'left' } }}>
              <Typography 
                variant={isMobile ? "h4" : "h3"} 
                component="h1" 
                gutterBottom
                sx={{ 
                  fontWeight: 700,
                  wordBreak: 'break-word',
                  textShadow: '1px 1px 2px rgba(0,0,0,0.3)'
                }}
              >
                {user.name}
              </Typography>
              
              <Typography 
                variant="h6" 
                gutterBottom
                sx={{ 
                  opacity: 0.9,
                  mb: 2
                }}
              >
                @{user.username}
              </Typography>
              
              <Stack 
                direction="row" 
                spacing={2} 
                flexWrap="wrap"
                justifyContent={{ xs: 'center', md: 'flex-start' }}
                sx={{ mb: 1 }}
              >
                <Chip 
                  icon={<ArticleIcon />} 
                  label={`${posts.length} posts`} 
                  sx={{ 
                    bgcolor: 'rgba(255,255,255,0.2)',
                    color: 'white',
                    '& .MuiChip-icon': { color: 'white' }
                  }}
                />
                <Chip 
                  icon={<BusinessIcon />} 
                  label={user.company?.name} 
                  sx={{ 
                    bgcolor: 'rgba(255,255,255,0.2)',
                    color: 'white',
                    '& .MuiChip-icon': { color: 'white' }
                  }}
                />
              </Stack>
            </Box>
          </Box>
        </Container>
      </Paper>

      <Container maxWidth="lg" sx={{ px: { xs: 0, md: 3 } }}>
        {/* Tabs de navegação */}
        <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
          <Tabs 
            value={tabValue} 
            onChange={handleTabChange}
            variant={isMobile ? "fullWidth" : "standard"}
            sx={{
              '& .MuiTab-root': {
                textTransform: 'none',
                fontWeight: 600,
                fontSize: '1rem',
              }
            }}
          >
            <Tab label="Informações" icon={<PersonIcon />} iconPosition="start" />
            <Tab label="Posts" icon={<ArticleIcon />} iconPosition="start" />
          </Tabs>
        </Box>

        {/* Conteúdo da tab selecionada */}
        <Box role="tabpanel" hidden={tabValue !== 0} sx={{ mb: 4 }}>
          {tabValue === 0 && (
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <Paper 
                  elevation={0} 
                  variant="outlined"
                  sx={{ 
                    p: 3,
                    borderRadius: 2
                  }}
                >
                  <Typography 
                    variant="h6" 
                    gutterBottom
                    sx={{ 
                      mb: 2, 
                      fontWeight: 600,
                      position: 'relative',
                      '&:after': {
                        content: '""',
                        display: 'block',
                        position: 'absolute',
                        bottom: -8,
                        left: 0,
                        width: 40,
                        height: 3,
                        backgroundColor: 'primary.main',
                      }
                    }}
                  >
                    Contato
                  </Typography>
                  
                  <List sx={{ width: '100%' }}>
                    <ListItem disablePadding sx={{ mb: 2 }}>
                      <ListItemIcon sx={{ minWidth: 40 }}>
                        <EmailIcon color="primary" />
                      </ListItemIcon>
                      <ListItemText 
                        primary="Email" 
                        secondary={user.email}
                        primaryTypographyProps={{ 
                          variant: 'subtitle2',
                          color: 'text.secondary'
                        }}
                        secondaryTypographyProps={{ 
                          variant: 'body1',
                          sx: { wordBreak: 'break-all' }
                        }}
                      />
                    </ListItem>
                    
                    <ListItem disablePadding sx={{ mb: 2 }}>
                      <ListItemIcon sx={{ minWidth: 40 }}>
                        <PhoneIcon color="primary" />
                      </ListItemIcon>
                      <ListItemText 
                        primary="Telefone" 
                        secondary={user.phone}
                        primaryTypographyProps={{ 
                          variant: 'subtitle2',
                          color: 'text.secondary'
                        }}
                      />
                    </ListItem>
                    
                    <ListItem disablePadding sx={{ mb: 2 }}>
                      <ListItemIcon sx={{ minWidth: 40 }}>
                        <LanguageIcon color="primary" />
                      </ListItemIcon>
                      <ListItemText 
                        primary="Website" 
                        secondary={user.website}
                        primaryTypographyProps={{ 
                          variant: 'subtitle2',
                          color: 'text.secondary'
                        }}
                        secondaryTypographyProps={{ 
                          variant: 'body1',
                          sx: { wordBreak: 'break-all' }
                        }}
                      />
                    </ListItem>
                  </List>
                </Paper>
              </Grid>
              
              <Grid item xs={12} md={6}>
                <Paper 
                  elevation={0} 
                  variant="outlined"
                  sx={{ 
                    p: 3,
                    borderRadius: 2
                  }}
                >
                  <Typography 
                    variant="h6" 
                    gutterBottom
                    sx={{ 
                      mb: 2, 
                      fontWeight: 600,
                      position: 'relative',
                      '&:after': {
                        content: '""',
                        display: 'block',
                        position: 'absolute',
                        bottom: -8,
                        left: 0,
                        width: 40,
                        height: 3,
                        backgroundColor: 'primary.main',
                      }
                    }}
                  >
                    Empresa
                  </Typography>
                  
                  <List sx={{ width: '100%' }}>
                    <ListItem disablePadding sx={{ mb: 2 }}>
                      <ListItemIcon sx={{ minWidth: 40 }}>
                        <BusinessIcon color="primary" />
                      </ListItemIcon>
                      <ListItemText 
                        primary="Nome" 
                        secondary={user.company?.name}
                        primaryTypographyProps={{ 
                          variant: 'subtitle2',
                          color: 'text.secondary'
                        }}
                      />
                    </ListItem>
                    
                    <ListItem disablePadding sx={{ mb: 2 }}>
                      <ListItemIcon sx={{ minWidth: 40 }}>
                        <BusinessIcon color="primary" />
                      </ListItemIcon>
                      <ListItemText 
                        primary="Slogan" 
                        secondary={user.company?.catchPhrase}
                        primaryTypographyProps={{ 
                          variant: 'subtitle2',
                          color: 'text.secondary'
                        }}
                      />
                    </ListItem>
                    
                    <ListItem disablePadding sx={{ mb: 2 }}>
                      <ListItemIcon sx={{ minWidth: 40 }}>
                        <BusinessIcon color="primary" />
                      </ListItemIcon>
                      <ListItemText 
                        primary="Área de atuação" 
                        secondary={user.company?.bs}
                        primaryTypographyProps={{ 
                          variant: 'subtitle2',
                          color: 'text.secondary'
                        }}
                      />
                    </ListItem>
                  </List>
                </Paper>
              </Grid>
              
              <Grid item xs={12}>
                <Paper 
                  elevation={0} 
                  variant="outlined"
                  sx={{ 
                    p: 3,
                    borderRadius: 2
                  }}
                >
                  <Typography 
                    variant="h6" 
                    gutterBottom
                    sx={{ 
                      mb: 2, 
                      fontWeight: 600,
                      position: 'relative',
                      '&:after': {
                        content: '""',
                        display: 'block',
                        position: 'absolute',
                        bottom: -8,
                        left: 0,
                        width: 40,
                        height: 3,
                        backgroundColor: 'primary.main',
                      }
                    }}
                  >
                    Endereço
                  </Typography>
                  
                  <List sx={{ width: '100%' }}>
                    <ListItem disablePadding>
                      <ListItemIcon sx={{ minWidth: 40 }}>
                        <LocationOnIcon color="primary" />
                      </ListItemIcon>
                      <ListItemText 
                        primary={`${user.address?.street}, ${user.address?.suite}`} 
                        secondary={`${user.address?.city}, ${user.address?.zipcode}`}
                        primaryTypographyProps={{ 
                          variant: 'body1'
                        }}
                        secondaryTypographyProps={{ 
                          variant: 'body2',
                          color: 'text.secondary'
                        }}
                      />
                    </ListItem>
                  </List>
                </Paper>
              </Grid>
            </Grid>
          )}
        </Box>
        
        <Box role="tabpanel" hidden={tabValue !== 1} sx={{ mb: 4 }}>
          {tabValue === 1 && (
            posts.length === 0 ? (
              <Alert severity="info">
                Este usuário não possui posts.
              </Alert>
            ) : (
              <Grid container spacing={3}>
                {posts.map((post) => (
                  <Grid 
                    item 
                    xs={12} 
                    sm={6} 
                    md={4} 
                    key={post.id}
                  >
                    <Card 
                      sx={{ 
                        height: '100%', 
                        display: 'flex', 
                        flexDirection: 'column',
                        transition: 'transform 0.2s, box-shadow 0.2s',
                        borderRadius: 2,
                        overflow: 'hidden',
                        '&:hover': {
                          transform: 'translateY(-4px)',
                          boxShadow: 4
                        }
                      }}
                    >
                      <CardMedia
                        component="img"
                        height="140"
                        image={getPostImage(post.id)}
                        alt={post.title}
                      />
                      <CardContent sx={{ flexGrow: 1 }}>
                        <Typography 
                          variant="h6" 
                          component="h3" 
                          gutterBottom
                          sx={{ 
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            display: '-webkit-box',
                            WebkitLineClamp: 2,
                            WebkitBoxOrient: 'vertical',
                            lineHeight: 1.3,
                            height: '2.6em',
                            fontWeight: 600
                          }}
                        >
                          {post.title}
                        </Typography>
                        
                        <Typography 
                          variant="body2" 
                          color="text.secondary"
                          sx={{ 
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            display: '-webkit-box',
                            WebkitLineClamp: 3,
                            WebkitBoxOrient: 'vertical',
                            mb: 1
                          }}
                        >
                          {post.body}
                        </Typography>
                      </CardContent>
                      <Divider />
                      <CardActions sx={{ justifyContent: 'space-between', px: 2 }}>
                        <Button 
                          size="small" 
                          component={RouterLink} 
                          to={`/posts/${post.id}`}
                          sx={{ 
                            textTransform: 'none',
                            fontWeight: 600
                          }}
                        >
                          Ler mais
                        </Button>
                        <Typography variant="caption" color="text.secondary">
                          {Math.floor(Math.random() * 10) + 1} min de leitura
                        </Typography>
                      </CardActions>
                    </Card>
                  </Grid>
                ))}
              </Grid>
            )
          )}
        </Box>
      </Container>
    </Box>
  );
}