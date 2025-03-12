import { useState, useEffect, useMemo } from 'react';
import { Link as RouterLink } from 'react-router-dom';
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
  Avatar,
  Divider,
  useTheme,
  useMediaQuery,
  Stack,
  Paper,
  Chip,
  CardMedia
} from '@mui/material';
import EmailIcon from '@mui/icons-material/Email';
import PhoneIcon from '@mui/icons-material/Phone';
import ArticleIcon from '@mui/icons-material/Article';
import LanguageIcon from '@mui/icons-material/Language';
import { getUsers, getPosts } from '../../services/api';
import { generateRealisticAvatar } from '../../utils/avatar';
import type { User, Post } from '../../types';

/**
 * Página que exibe a lista de usuários do blog.
 * 
 * @returns {JSX.Element} A página UserList renderizada.
 */
export function UserList() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  
  const [users, setUsers] = useState<User[]>([]);
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  // Gerar URLs únicas para os avatares
  const avatarUrls = useMemo(() => {
    return users.reduce<Record<number, string>>((acc, user) => {
      acc[user.id] = generateRealisticAvatar(user.id);
      return acc;
    }, {});
  }, [users]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [usersData, postsData] = await Promise.all([
          getUsers(),
          getPosts()
        ]);
        setUsers(usersData);
        setPosts(postsData);
        setLoading(false);
      } catch (error) {
        setError(error instanceof Error ? error : new Error('Erro ao carregar dados'));
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Função para contar quantos posts cada usuário tem
  const getUserPostCount = (userId: number) => {
    return posts.filter(post => post.userId === userId).length;
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

  if (users.length === 0) {
    return (
      <Alert severity="info" sx={{ my: 2 }}>
        Nenhum usuário encontrado.
      </Alert>
    );
  }

  return (
    <Box sx={{ width: '100%' }}>
      {/* Banner da página */}
      <Paper
        sx={{
          position: 'relative',
          backgroundColor: 'grey.800',
          color: '#fff',
          mb: 4,
          backgroundSize: 'cover',
          backgroundRepeat: 'no-repeat',
          backgroundPosition: 'center',
          backgroundImage: 'url(https://picsum.photos/seed/team/1200/600)',
          borderRadius: 2,
          overflow: 'hidden',
        }}
      >
        <Box
          sx={{
            position: 'absolute',
            top: 0,
            bottom: 0,
            right: 0,
            left: 0,
            backgroundColor: 'rgba(0,0,0,.5)',
          }}
        />
        <Grid container>
          <Grid item md={8}>
            <Box
              sx={{
                position: 'relative',
                p: { xs: 3, md: 6 },
                pr: { md: 0 },
              }}
            >
              <Typography component="h1" variant="h3" color="inherit" gutterBottom>
                Nossos Autores
              </Typography>
              <Typography variant="subtitle1" color="inherit" paragraph>
                Conheça os talentosos escritores que contribuem com conteúdo para o nosso blog.
                Cada autor traz uma perspectiva única e valiosa para os temas abordados.
              </Typography>
            </Box>
          </Grid>
        </Grid>
      </Paper>

      {/* Título da seção */}
      <Typography 
        variant="h5" 
        component="h2" 
        gutterBottom
        sx={{ 
          mb: 3, 
          fontWeight: 700,
          position: 'relative',
          '&:after': {
            content: '""',
            display: 'block',
            position: 'absolute',
            bottom: -8,
            left: 0,
            width: 40,
            height: 4,
            backgroundColor: 'primary.main',
          }
        }}
      >
        Todos os Autores
      </Typography>

      <Grid container spacing={3}>
        {users.map((user) => (
          <Grid 
            item 
            xs={12} 
            sm={6} 
            md={4} 
            key={user.id}
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
                component="div"
                sx={{
                  pt: '40%',
                  position: 'relative',
                  backgroundColor: theme.palette.primary.main,
                }}
              >
                <Avatar 
                  src={avatarUrls[user.id]}
                  sx={{ 
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                    width: 80,
                    height: 80,
                    fontSize: '2rem',
                    bgcolor: theme.palette.background.paper,
                    color: theme.palette.primary.main,
                    border: `3px solid ${theme.palette.background.paper}`,
                  }}
                >
                  {user.name.charAt(0)}
                </Avatar>
              </CardMedia>
              
              <CardContent sx={{ flexGrow: 1, textAlign: 'center' }}>
                <Typography 
                  variant="h6" 
                  component="h3"
                  gutterBottom
                  sx={{ 
                    fontWeight: 600,
                    wordBreak: 'break-word'
                  }}
                >
                  {user.name}
                </Typography>
                
                <Typography 
                  variant="body2" 
                  color="text.secondary"
                  sx={{ mb: 2 }}
                >
                  @{user.username}
                </Typography>
                
                <Stack 
                  direction="row" 
                  spacing={1} 
                  justifyContent="center"
                  sx={{ mb: 2 }}
                >
                  <Chip 
                    icon={<ArticleIcon />} 
                    label={`${getUserPostCount(user.id)} posts`} 
                    size="small" 
                    color="primary" 
                    variant="outlined"
                  />
                </Stack>
                
                <Divider sx={{ my: 2 }} />
                
                <Stack spacing={1.5}>
                  <Stack direction="row" spacing={1} alignItems="center">
                    <EmailIcon fontSize="small" color="action" />
                    <Typography 
                      variant="body2" 
                      sx={{ 
                        wordBreak: 'break-all',
                        fontSize: isMobile ? '0.8rem' : '0.875rem'
                      }}
                    >
                      {user.email}
                    </Typography>
                  </Stack>
                  
                  <Stack direction="row" spacing={1} alignItems="center">
                    <PhoneIcon fontSize="small" color="action" />
                    <Typography 
                      variant="body2"
                      sx={{
                        fontSize: isMobile ? '0.8rem' : '0.875rem'
                      }}
                    >
                      {user.phone}
                    </Typography>
                  </Stack>
                  
                  <Stack direction="row" spacing={1} alignItems="center">
                    <LanguageIcon fontSize="small" color="action" />
                    <Typography 
                      variant="body2"
                      sx={{
                        fontSize: isMobile ? '0.8rem' : '0.875rem'
                      }}
                    >
                      {user.website}
                    </Typography>
                  </Stack>
                </Stack>
              </CardContent>
              
              <CardActions sx={{ justifyContent: 'center', pb: 2 }}>
                <Button 
                  variant="contained"
                  size="small" 
                  component={RouterLink} 
                  to={`/users/${user.id}`}
                  sx={{ 
                    borderRadius: '20px',
                    textTransform: 'none',
                    fontWeight: 600,
                    px: 3
                  }}
                >
                  Ver perfil
                </Button>
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
} 