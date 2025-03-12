import { useState, useEffect, useMemo } from "react";
import { useParams, Link as RouterLink } from "react-router-dom";
import {
	Box,
	Button,
	CircularProgress,
	Alert,
	useTheme,
	useMediaQuery,
	Container,
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import PersonIcon from "@mui/icons-material/Person";
import ArticleIcon from "@mui/icons-material/Article";
import { getUser, getPosts } from "../../../services/api";
import { generateRealisticAvatar } from "../../../utils/avatar";
import { getPostImageUrl, usePreloadPostImages } from "../../../utils/imagePreloader";
import { UserProfileHeader } from "./UserProfileHeader";
import { TabNavigation } from "./TabNavigation";
import { TabContent } from "./TabContent";
import type { User, Post } from "../../../types";

/**
 * Página que exibe os detalhes de um usuário e seus posts.
 *
 * @returns {JSX.Element} A página UserDetail renderizada.
 */
export function UserDetail() {
	const theme = useTheme();
	const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

	const { id } = useParams<{ id: string }>();
	const [user, setUser] = useState<User | null>(null);
	const [posts, setPosts] = useState<Post[]>([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<Error | null>(null);
	const [tabValue, setTabValue] = useState(0);

	// Gerar URL única para o avatar do usuário
	const avatarUrl = useMemo(() => {
		if (!user) return "";
		return generateRealisticAvatar(user.id);
	}, [user]);

	// Extrair IDs dos posts para pré-carregamento
	const postIds = useMemo(() => {
		return posts.map((post) => post.id);
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
				const postsData = allPosts.filter((post) => post.userId === userId);
				setPosts(postsData);

				setLoading(false);
			} catch (error) {
				setError(error instanceof Error ? error : new Error("Erro ao carregar dados do usuário"));
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

	// Configuração das abas
	const tabItems = [
		{ label: "Informações", icon: <PersonIcon />, id: "info-tab" },
		{ label: "Posts", icon: <ArticleIcon />, id: "posts-tab" },
	];

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

	if (!user) {
		return (
			<Alert severity="info" sx={{ my: 2 }}>
				Usuário não encontrado.
			</Alert>
		);
	}

	return (
		<Box sx={{ width: "100%" }}>
			<Button
				component={RouterLink}
				to="/users"
				startIcon={<ArrowBackIcon />}
				sx={{ mb: 3 }}
				size={isMobile ? "small" : "medium"}
			>
				Voltar para a lista
			</Button>

			<UserProfileHeader user={user} avatarUrl={avatarUrl} postCount={posts.length} />

			<Container maxWidth="lg" sx={{ px: { xs: 0, md: 3 } }}>
				<TabNavigation items={tabItems} value={tabValue} onChange={handleTabChange} />

				<TabContent tabValue={tabValue} user={user} posts={posts} getPostImage={getPostImage} />
			</Container>
		</Box>
	);
}
