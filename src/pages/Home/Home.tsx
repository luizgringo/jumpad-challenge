import { useState, useEffect, useMemo } from "react";
import {
	Typography,
	CircularProgress,
	Box,
	Alert,
	useTheme,
	useMediaQuery,
	Pagination,
	Grid2,
} from "@mui/material";
import { getPosts, getUsers } from "../../services/api";
import { getPostImageUrl, usePreloadPostImages } from "../../utils/imagePreloader";
import { generateRealisticAvatar } from "../../utils/avatar";
import { PostCard } from "../../components/PostCard";
import { FeaturedPost } from "./FeaturedPost";
import type { Post, User } from "../../types";

/**
 * Página inicial que exibe a lista de posts.
 *
 * @returns {JSX.Element} A página Home renderizada.
 */
export function Home() {
	const theme = useTheme();
	const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
	const isTablet = useMediaQuery(theme.breakpoints.between("sm", "md"));

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
	const currentPosts = posts.slice(1).slice((page - 1) * postsPerPage, page * postsPerPage);

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
			const nextPagePosts = posts.slice(1).slice(page * postsPerPage, (page + 1) * postsPerPage);
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
				const [postsData, usersData] = await Promise.all([getPosts(), getUsers()]);
				setPosts(postsData);
				setUsers(usersData);
				setLoading(false);
			} catch (error) {
				setError(error instanceof Error ? error : new Error("Erro ao carregar dados"));
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
		window.scrollTo({ top: 0, behavior: "smooth" });
	};

	// Função para obter o nome do autor pelo userId
	const getAuthorName = (userId: number) => {
		const user = users.find((user) => user.id === userId);
		return user ? user.name : "Autor desconhecido";
	};

	// Função para obter a URL do avatar do autor pelo userId
	const getAuthorAvatar = (userId: number) => {
		return authorAvatarUrls[userId] || "";
	};

	// Função para obter a URL da imagem de um post
	const getPostImage = (postId: number, width?: number, height?: number) => {
		return getPostImageUrl(postId, width, height);
	};

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

	return (
		<Box sx={{ width: "100%" }}>
			{/* Post em destaque */}
			{mainPost && <FeaturedPost post={mainPost} getPostImage={getPostImage} />}

			{/* Título da seção */}
			<Typography
				variant="h5"
				component="h2"
				gutterBottom
				sx={{
					mb: 3,
					fontWeight: 700,
					position: "relative",
					"&:after": {
						content: '""',
						display: "block",
						position: "absolute",
						bottom: -8,
						left: 0,
						width: 40,
						height: 4,
						backgroundColor: "primary.main",
					},
				}}
			>
				Posts Recentes
			</Typography>

			{/* Lista de posts */}
			<Grid2 container spacing={3}>
				{currentPosts.map((post) => (
					<Grid2 size={{ xs: 12, sm: 6, md: 4 }} key={post.id}>
						<PostCard
							post={post}
							getPostImage={getPostImage}
							showAuthor={true}
							getAuthorName={getAuthorName}
							getAuthorAvatar={getAuthorAvatar}
						/>
					</Grid2>
				))}
			</Grid2>

			{/* Paginação */}
			{totalPages > 1 && (
				<Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
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
