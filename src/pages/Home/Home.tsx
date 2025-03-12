import { useState, useEffect, useMemo } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { 
  Typography, 
  Card, 
  CardContent, 
  CardActions, 
  Button, 
  CircularProgress, 
  Box, 
  Alert,
  useTheme,
  useMediaQuery,
  Pagination,
  CardMedia,
  Paper,
  Divider,
  Stack,
  Avatar,
  Grid
} from '@mui/material';
import { getPosts, getUsers } from '../../services/api';
import { getPostImageUrl, usePreloadPostImages } from '../../utils/imagePreloader';
import { generateRealisticAvatar } from '../../utils/avatar';
import type { Post, User } from '../../types';

/**
 * Página inicial que exibe a lista de posts.
 * 
 * @returns {JSX.Element} A página Home renderizada.
 */
export function Home() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const isTablet = useMediaQuery(theme.breakpoints.between('sm', 'md'));
  
  const [posts, setPosts] = useState<Post[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  
  // Paginação
  const [page, setPage] = useState(1);
  
  // Calcular o número de posts por página com base no tamanho da tela
  const getPostsPerPage = () => {
    if (isMobile) return 5;
    if (isTablet) return 8;
    return 12;
  };
  
  // Atualizar o número de posts por página quando o tamanho da tela mudar
  const postsPerPage = getPostsPerPage();
  const totalPages = Math.ceil((posts.length - 1) / postsPerPage);
  
  // Posts da página atual (excluindo o post principal)
  const mainPost = posts.length > 0 ? posts[0] : null;
  const currentPosts = posts.slice(1).slice(
    (page - 1) * postsPerPage,
    page * postsPerPage
  );

  // Extrair IDs dos posts para pré-carregamento
  const postIds = useMemo(() => {
    if (!posts.length) return [];
    
    // Incluir o post principal e os posts da página atual
    const ids = [posts[0]?.id];
    
    // Adicionar os posts da página atual
    for (const post of currentPosts) {
      if (post.id) ids.push(post.id);
    }
    
    // Adicionar os posts da próxima página (se houver)
    if (page < totalPages) {
      const nextPagePosts = posts.slice(1).slice(
        page * postsPerPage,
        (page + 1) * postsPerPage
      );
      for (const post of nextPagePosts) {
        if (post.id) ids.push(post.id);
      }
    }
    
    return ids.filter(Boolean) as number[];
  }, [posts, page, postsPerPage, totalPages, currentPosts]);
  
  // Pré-carregar imagens dos posts
  usePreloadPostImages(postIds);

  // Gerar URLs únicas para os avatares dos autores
  const authorAvatarUrls = useMemo(() => {
    return users.reduce<Record<number, string>>((acc, user) => {
      acc[user.id] = generateRealisticAvatar(user.id);
      return acc;
    }, {});
  }, [users]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [postsData, usersData] = await Promise.all([
          getPosts(),
          getUsers()
        ]);
        setPosts(postsData);
        setUsers(usersData);
        setLoading(false);
      } catch (error) {
        setError(error instanceof Error ? error : new Error('Erro ao carregar dados'));
        setLoading(false);
      }
    };

    fetchData();
  }, []);
  
  // Resetar para a primeira página quando o tamanho da tela mudar
  useEffect(() => {
    setPage(1);
  }, []);

  const handlePageChange = (_event: React.ChangeEvent<unknown>, value: number) => {
    setPage(value);
    // Rolar para o topo da página
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };
  
  // Função para obter o nome do autor pelo userId
  const getAuthorName = (userId: number) => {
    const user = users.find(user => user.id === userId);
    return user ? user.name : 'Autor desconhecido';
  };

  // Função para obter a URL do avatar do autor pelo userId
  const getAuthorAvatar = (userId: number) => {
    return authorAvatarUrls[userId] || '';
  };

  // Função para obter a URL da imagem de um post
  const getPostImage = (postId: number, width?: number, height?: number) => {
    return getPostImageUrl(postId, width, height);
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

  return (
    <Box sx={{ width: '100%' }}>
      {/* Post em destaque */}
      {mainPost && (
        <Paper
          sx={{
            position: 'relative',
            backgroundColor: 'grey.800',
            color: '#fff',
            mb: 4,
            backgroundSize: 'cover',
            backgroundRepeat: 'no-repeat',
            backgroundPosition: 'center',
            backgroundImage: `url(${getPostImage(mainPost.id, 1200, 600)})`,
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
                  {mainPost.title}
                </Typography>
                <Typography variant="subtitle1" color="inherit" paragraph>
                  {mainPost.body.substring(0, 150)}...
                </Typography>
                <Button 
                  variant="contained" 
                  component={RouterLink} 
                  to={`/posts/${mainPost.id}`}
                  sx={{ 
                    borderRadius: '20px',
                    textTransform: 'none',
                    fontWeight: 600
                  }}
                >
                  Continuar lendo
                </Button>
              </Box>
            </Grid>
          </Grid>
        </Paper>
      )}

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
        Posts Recentes
      </Typography>

      {/* Lista de posts */}
      <Grid container spacing={3}>
        {currentPosts.map((post) => (
          <Grid item xs={12} sm={6} md={4} key={post.id}>
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
                image={getPostImage(post.id, 400, 200)}
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
                
                <Stack 
                  direction="row" 
                  spacing={1} 
                  alignItems="center"
                  sx={{ mb: 1 }}
                >
                  <Box
                    component={RouterLink}
                    to={`/users/${post.userId}`}
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      textDecoration: 'none',
                      color: 'inherit',
                      '&:hover': {
                        '& .MuiTypography-root': {
                          color: 'primary.main',
                        }
                      }
                    }}
                  >
                    <Avatar 
                      src={getAuthorAvatar(post.userId)}
                      alt={getAuthorName(post.userId)}
                      sx={{ 
                        width: 24, 
                        height: 24, 
                        mr: 1,
                        border: '1px solid',
                        borderColor: 'divider'
                      }}
                    >
                      {getAuthorName(post.userId).charAt(0)}
                    </Avatar>
                    <Typography 
                      variant="body2" 
                      color="text.secondary"
                      sx={{ 
                        fontWeight: 500,
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap',
                        maxWidth: '120px'
                      }}
                    >
                      {getAuthorName(post.userId)}
                    </Typography>
                  </Box>
                </Stack>
                
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

      {/* Paginação */}
      {totalPages > 1 && (
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
          <Pagination 
            count={totalPages} 
            page={page} 
            onChange={handlePageChange} 
            color="primary"
            size={isMobile ? "small" : "medium"}
          />
        </Box>
      )}
    </Box>
  );
} 