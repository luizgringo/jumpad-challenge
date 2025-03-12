import { useState, useEffect, useMemo } from "react";
import { Typography, Box, CircularProgress, Alert, Grid2 } from "@mui/material";
import { getUsers, getPosts } from "../../../services/api";
import { generateRealisticAvatar } from "../../../utils/avatar";
import { PageBanner } from "./PageBanner";
import { UserCard } from "./UserCard";
import type { User, Post } from "../../../types";

/**
 * Página que exibe a lista de usuários do blog.
 *
 * @returns {JSX.Element} A página UserList renderizada.
 */
export function UserList() {
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
				const [usersData, postsData] = await Promise.all([getUsers(), getPosts()]);
				setUsers(usersData);
				setPosts(postsData);
				setLoading(false);
			} catch (error) {
				setError(error instanceof Error ? error : new Error("Erro ao carregar dados"));
				setLoading(false);
			}
		};

		fetchData();
	}, []);

	// Função para contar quantos posts cada usuário tem
	const getUserPostCount = (userId: number) => {
		return posts.filter((post) => post.userId === userId).length;
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

	if (users.length === 0) {
		return (
			<Alert severity="info" sx={{ my: 2 }}>
				Nenhum usuário encontrado.
			</Alert>
		);
	}

	return (
		<Box sx={{ width: "100%" }}>
			{/* Banner da página */}
			<PageBanner
				title="Nossos Autores"
				description="Conheça os talentosos escritores que contribuem com conteúdo para o nosso blog. Cada autor traz uma perspectiva única e valiosa para os temas abordados."
			/>

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
				Todos os Autores
			</Typography>

			<Grid2 container spacing={3}>
				{users.map((user) => (
					<Grid2 size={{ xs: 12, sm: 6, md: 4 }} key={user.id}>
						<UserCard
							user={user}
							avatarUrl={avatarUrls[user.id]}
							postCount={getUserPostCount(user.id)}
						/>
					</Grid2>
				))}
			</Grid2>
		</Box>
	);
}
