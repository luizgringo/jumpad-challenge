import type { ReactNode } from "react";
import {
	Typography,
	Box,
	Paper,
	Avatar,
	useTheme,
	useMediaQuery,
	Chip,
	Stack,
	Container,
} from "@mui/material";
import ArticleIcon from "@mui/icons-material/Article";
import BusinessIcon from "@mui/icons-material/Business";
import type { User } from "../../../types";

interface UserProfileHeaderProps {
	user: User;
	avatarUrl: string;
	postCount: number;
	extraChips?: ReactNode;
}

/**
 * Componente que exibe o cabeçalho do perfil do usuário.
 *
 * @param {UserProfileHeaderProps} props - As propriedades do componente.
 * @returns {JSX.Element} O componente UserProfileHeader renderizado.
 */
export function UserProfileHeader({
	user,
	avatarUrl,
	postCount,
	extraChips,
}: UserProfileHeaderProps) {
	const theme = useTheme();
	const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

	return (
		<Paper
			sx={{
				position: "relative",
				backgroundColor: theme.palette.grey[900],
				color: "#fff",
				mb: 4,
				borderRadius: 2,
				overflow: "hidden",
			}}
		>
			<Box
				sx={{
					position: "absolute",
					top: 0,
					right: 0,
					width: "100%",
					height: "100%",
					backgroundImage: "linear-gradient(135deg, rgba(0,0,0,0.1) 0%, rgba(0,0,0,0.4) 100%)",
				}}
			/>
			<Container maxWidth="lg">
				<Box
					sx={{
						position: "relative",
						py: { xs: 4, md: 6 },
						display: "flex",
						flexDirection: { xs: "column", md: "row" },
						alignItems: { xs: "center", md: "flex-start" },
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
							fontSize: { xs: "3rem", md: "4rem" },
							border: `4px solid ${theme.palette.background.paper}`,
						}}
					>
						{user.name.charAt(0)}
					</Avatar>

					<Box sx={{ textAlign: { xs: "center", md: "left" } }}>
						<Typography
							variant={isMobile ? "h4" : "h3"}
							component="h1"
							gutterBottom
							sx={{
								fontWeight: 700,
								wordBreak: "break-word",
								textShadow: "1px 1px 2px rgba(0,0,0,0.3)",
							}}
						>
							{user.name}
						</Typography>

						<Typography
							variant="h6"
							gutterBottom
							sx={{
								opacity: 0.9,
								mb: 2,
							}}
						>
							@{user.username}
						</Typography>

						<Stack
							direction="row"
							spacing={2}
							flexWrap="wrap"
							justifyContent={{ xs: "center", md: "flex-start" }}
							sx={{ mb: 1 }}
						>
							<Chip
								icon={<ArticleIcon />}
								label={`${postCount} posts`}
								sx={{
									bgcolor: "rgba(255,255,255,0.2)",
									color: "white",
									"& .MuiChip-icon": { color: "white" },
								}}
							/>
							<Chip
								icon={<BusinessIcon />}
								label={user.company?.name}
								sx={{
									bgcolor: "rgba(255,255,255,0.2)",
									color: "white",
									"& .MuiChip-icon": { color: "white" },
								}}
							/>
							{extraChips}
						</Stack>
					</Box>
				</Box>
			</Container>
		</Paper>
	);
}
