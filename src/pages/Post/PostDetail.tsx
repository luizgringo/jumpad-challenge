import { useState, useEffect, useMemo } from "react";
import { useParams, Link as RouterLink } from "react-router-dom";
import {
	Typography,
	Box,
	Divider,
	CircularProgress,
	Alert,
	Button,
	useTheme,
	useMediaQuery,
	Container,
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { getPost, getPostComments, getUser } from "../../services/api";
import { generateRealisticAvatar } from "../../utils/avatar";
import { getPostImageUrl, preloadImage } from "../../utils/imagePreloader";
import { CoverImage } from "./CoverImage";
import { PostAuthorInfo } from "./PostAuthorInfo";
import { PostContent } from "./PostContent";
import { PostComments } from "./PostComments";
import type { Post, Comment, User } from "../../types";

/**
 * Página que exibe os detalhes de um post e seus comentários.
 *
 * @returns {JSX.Element} A página PostDetail renderizada.
 */
export function PostDetail() {
	const theme = useTheme();
	const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

	const { id } = useParams<{ id: string }>();
	const [post, setPost] = useState<Post | null>(null);
	const [comments, setComments] = useState<Comment[]>([]);
	const [user, setUser] = useState<User | null>(null);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<Error | null>(null);
	const [imageLoaded, setImageLoaded] = useState(false);

	// Gerar URL única para o avatar do autor
	const authorAvatarUrl = useMemo(() => {
		if (!user) return "";
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
		if (!post) return "";
		return getPostImageUrl(post.id, 1200, 600);
	}, [post]);

	// Pré-carregar a imagem do post
	useEffect(() => {
		if (!postImageUrl) return;

		setImageLoaded(false);

		preloadImage(postImageUrl)
			.then(() => setImageLoaded(true))
			.catch((error) => console.error("Erro ao pré-carregar imagem do post:", error));
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
				setError(error instanceof Error ? error : new Error("Erro ao carregar dados do post"));
				setLoading(false);
			}
		};

		fetchPostData();
	}, [id]);

	if (loading) {
		return (
			<Box sx={{ display: "flex", justifyContent: "center", my: 4 }}>
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
	const formattedDate = randomDate.toLocaleDateString("pt-BR", {
		day: "2-digit",
		month: "long",
		year: "numeric",
	});

	// Tempo estimado de leitura
	const readingTime = Math.max(Math.floor(post.body.length / 500), 1);

	return (
		<Box sx={{ width: "100%" }}>
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
			<CoverImage imageUrl={postImageUrl} imageLoaded={imageLoaded} />

			<Container maxWidth="md" sx={{ px: { xs: 0, md: 3 } }}>
				{/* Título e metadados */}
				<Typography
					variant={isMobile ? "h4" : "h3"}
					component="h1"
					gutterBottom
					sx={{
						fontWeight: 700,
						mb: 2,
						wordBreak: "break-word",
					}}
				>
					{post.title}
				</Typography>

				<PostAuthorInfo
					user={user}
					authorAvatarUrl={authorAvatarUrl}
					formattedDate={formattedDate}
					readingTime={readingTime}
					commentsCount={comments.length}
				/>

				<Divider sx={{ mb: 4 }} />

				{/* Conteúdo do post */}
				<PostContent content={post.body} />

				<Divider sx={{ mb: 4 }} />

				{/* Seção de comentários */}
				<PostComments comments={comments} commentAvatarUrls={commentAvatarUrls} />
			</Container>
		</Box>
	);
}
