import { useState, useEffect, useMemo } from 'react';
import { useParams, Link as RouterLink } from 'react-router-dom';
import { 
  Typography, 
  Box, 
  Card, 
  CardContent, 
  Divider, 
  CircularProgress, 
  Alert, 
  Button,
  Paper,
  Avatar,
  Grid,
  useTheme,
  useMediaQuery,
  Chip,
  Container,
  Stack,
  CardMedia
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import CommentIcon from '@mui/icons-material/Comment';
import PersonIcon from '@mui/icons-material/Person';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import { getPost, getPostComments, getUser } from '../../services/api';
import { generateRealisticAvatar } from '../../utils/avatar';
import { getPostImageUrl, preloadImage } from '../../utils/imagePreloader';
import type { Post, Comment, User } from '../../types';

/**
 * Página que exibe os detalhes de um post e seus comentários.
 * 
 * @returns {JSX.Element} A página PostDetail renderizada.
 */
export function PostDetail() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  
  const { id } = useParams<{ id: string }>();
  const [post, setPost] = useState<Post | null>(null);
  const [comments, setComments] = useState<Comment[]>([]);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [imageLoaded, setImageLoaded] = useState(false);

  // Gerar URL única para o avatar do autor
  const authorAvatarUrl = useMemo(() => {
    if (!user) return '';
    return generateRealisticAvatar(user.id);
  }, [user]);

  // Gerar URLs únicas para os avatares dos comentários
  const commentAvatarUrls = useMemo(() => {
    return comments.reduce<Record<number, string>>((acc, comment) => {
      acc[comment.id] = generateRealisticAvatar(comment.id);
      return acc;
    }, {});
  }, [comments]);

  // URL da imagem do post
  const postImageUrl = useMemo(() => {
    if (!post) return '';
    return getPostImageUrl(post.id, 1200, 600);
  }, [post]);

  // Pré-carregar a imagem do post
  useEffect(() => {
    if (!postImageUrl) return;
    
    setImageLoaded(false);
    
    preloadImage(postImageUrl)
      .then(() => setImageLoaded(true))
      .catch(error => console.error('Erro ao pré-carregar imagem do post:', error));
  }, [postImageUrl]);

  useEffect(() => {
    const fetchPostData = async () => {
      if (!id) return;
      
      try {
        setLoading(true);
        const postId = Number.parseInt(id, 10);
        const postData = await getPost(postId);
        setPost(postData);
        
        // Buscar comentários do post
        const commentsData = await getPostComments(postId);
        setComments(commentsData);
        
        // Buscar informações do autor
        const userData = await getUser(postData.userId);
        setUser(userData);
        
        setLoading(false);
      } catch (error) {
        setError(error instanceof Error ? error : new Error('Erro ao carregar dados do post'));
        setLoading(false);
      }
    };

    fetchPostData();
  }, [id]);

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

  if (!post || !user) {
    return (
      <Alert severity="info" sx={{ my: 2 }}>
        Post não encontrado.
      </Alert>
    );
  }

  // Gerar uma data aleatória para o post (já que a API não fornece)
  const randomDate = new Date();
  randomDate.setDate(randomDate.getDate() - Math.floor(Math.random() * 30));
  const formattedDate = randomDate.toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: 'long',
    year: 'numeric'
  });

  // Tempo estimado de leitura
  const readingTime = Math.max(Math.floor(post.body.length / 500), 1);

  return (
    <Box sx={{ width: '100%' }}>
      <Button
        component={RouterLink}
        to="/"
        startIcon={<ArrowBackIcon />}
        sx={{ mb: 3 }}
        size={isMobile ? "small" : "medium"}
      >
        Voltar para a lista
      </Button>

      {/* Imagem de capa */}
      <Paper
        sx={{
          position: 'relative',
          backgroundColor: 'grey.800',
          color: '#fff',
          mb: 4,
          backgroundSize: 'cover',
          backgroundRepeat: 'no-repeat',
          backgroundPosition: 'center',
          backgroundImage: `url(${postImageUrl})`,
          borderRadius: 2,
          height: { xs: 200, md: 300 },
          overflow: 'hidden',
          opacity: imageLoaded ? 1 : 0.7,
          transition: 'opacity 0.3s ease-in-out',
        }}
      >
        <Box
          sx={{
            position: 'absolute',
            top: 0,
            bottom: 0,
            right: 0,
            left: 0,
            backgroundColor: 'rgba(0,0,0,.3)',
          }}
        />
        {!imageLoaded && (
          <Box
            sx={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
            }}
          >
            <CircularProgress color="inherit" />
          </Box>
        )}
      </Paper>

      <Container maxWidth="md" sx={{ px: { xs: 0, md: 3 } }}>
        {/* Título e metadados */}
        <Typography 
          variant={isMobile ? "h4" : "h3"} 
          component="h1" 
          gutterBottom
          sx={{ 
            fontWeight: 700,
            mb: 2,
            wordBreak: 'break-word'
          }}
        >
          {post.title}
        </Typography>
        
        <Stack 
          direction={{ xs: 'column', sm: 'row' }} 
          spacing={2} 
          alignItems={{ xs: 'flex-start', sm: 'center' }}
          sx={{ mb: 4 }}
        >
          <Stack direction="row" spacing={1} alignItems="center">
            <Avatar 
              src={authorAvatarUrl}
              sx={{ 
                bgcolor: 'primary.main',
                width: 40,
                height: 40,
                border: `2px solid ${theme.palette.background.paper}`,
                boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
              }}
            >
              {user.name.charAt(0)}
            </Avatar>
            <Box>
              <Typography 
                variant="subtitle1" 
                sx={{ 
                  fontWeight: 600,
                  lineHeight: 1.2
                }}
              >
                {user.name}
              </Typography>
              <Typography 
                variant="body2" 
                color="text.secondary" 
                component={RouterLink} 
                to={`/users/${user.id}`}
                sx={{ 
                  textDecoration: 'none', 
                  '&:hover': { 
                    textDecoration: 'underline',
                    color: 'primary.main'
                  },
                  display: 'flex',
                  alignItems: 'center',
                  gap: 0.5
                }}
              >
                @{user.username}
              </Typography>
            </Box>
          </Stack>
          
          <Divider orientation="vertical" flexItem sx={{ display: { xs: 'none', sm: 'block' } }} />
          
          <Stack direction="row" spacing={2} flexWrap="wrap">
            <Stack direction="row" spacing={0.5} alignItems="center">
              <CalendarTodayIcon fontSize="small" color="action" />
              <Typography variant="body2" color="text.secondary">
                {formattedDate}
              </Typography>
            </Stack>
            
            <Stack direction="row" spacing={0.5} alignItems="center">
              <AccessTimeIcon fontSize="small" color="action" />
              <Typography variant="body2" color="text.secondary">
                {readingTime} min de leitura
              </Typography>
            </Stack>
            
            <Stack direction="row" spacing={0.5} alignItems="center">
              <CommentIcon fontSize="small" color="action" />
              <Typography variant="body2" color="text.secondary">
                {comments.length} comentários
              </Typography>
            </Stack>
          </Stack>
        </Stack>
        
        <Divider sx={{ mb: 4 }} />
        
        {/* Conteúdo do post */}
        <Typography 
          variant="body1" 
          paragraph
          sx={{ 
            lineHeight: 1.8,
            fontSize: { xs: '1rem', sm: '1.1rem' },
            textAlign: 'justify',
            mb: 4
          }}
        >
          {post.body.split('\n\n').map((paragraph, index) => (
            <Typography 
              key={`paragraph-${index}-${paragraph.substring(0, 10)}`} 
              variant="body1" 
              paragraph
              sx={{ 
                lineHeight: 1.8,
                fontSize: { xs: '1rem', sm: '1.1rem' },
                mb: 2
              }}
            >
              {paragraph}
            </Typography>
          ))}
        </Typography>
        
        <Divider sx={{ mb: 4 }} />
        
        {/* Seção de comentários */}
        <Box sx={{ mb: 4 }}>
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
            Comentários ({comments.length})
          </Typography>
          
          {comments.length === 0 ? (
            <Alert severity="info">
              Não há comentários para este post.
            </Alert>
          ) : (
            <Stack spacing={3}>
              {comments.map((comment) => (
                <Card 
                  key={comment.id}
                  variant="outlined"
                  sx={{
                    transition: 'box-shadow 0.2s',
                    borderRadius: 2,
                    '&:hover': {
                      boxShadow: 2
                    }
                  }}
                >
                  <CardContent>
                    <Stack spacing={2}>
                      <Stack 
                        direction="row" 
                        spacing={2} 
                        alignItems="center"
                        sx={{ mb: 1 }}
                      >
                        <Avatar 
                          src={commentAvatarUrls[comment.id]}
                          sx={{ 
                            bgcolor: theme.palette.secondary.main,
                            width: 40,
                            height: 40,
                            border: `2px solid ${theme.palette.background.paper}`,
                            boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
                          }}
                        >
                          {comment.name.charAt(0)}
                        </Avatar>
                        <Box sx={{ flexGrow: 1 }}>
                          <Typography 
                            variant="subtitle1" 
                            sx={{ 
                              fontWeight: 600,
                              lineHeight: 1.2
                            }}
                          >
                            {comment.name}
                          </Typography>
                          <Typography 
                            variant="caption" 
                            color="text.secondary"
                            sx={{
                              display: 'block',
                              mb: 0.5
                            }}
                          >
                            {comment.email}
                          </Typography>
                        </Box>
                        <Typography 
                          variant="caption" 
                          color="text.secondary"
                          sx={{ 
                            display: { xs: 'none', sm: 'block' } 
                          }}
                        >
                          {new Date(Date.now() - Math.floor(Math.random() * 7 * 24 * 60 * 60 * 1000)).toLocaleDateString('pt-BR')}
                        </Typography>
                      </Stack>
                      
                      <Typography 
                        variant="body2"
                        sx={{ 
                          lineHeight: 1.6,
                          textAlign: 'justify',
                          pl: { xs: 0, sm: 7 },
                          pt: 1,
                          pb: 1,
                          borderLeft: { xs: 'none', sm: `4px solid ${theme.palette.divider}` },
                          ml: { xs: 0, sm: 1 }
                        }}
                      >
                        {comment.body}
                      </Typography>
                    </Stack>
                  </CardContent>
                </Card>
              ))}
            </Stack>
          )}
        </Box>
      </Container>
    </Box>
  );
}