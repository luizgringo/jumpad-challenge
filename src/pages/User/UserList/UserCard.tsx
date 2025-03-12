import { Link as RouterLink } from "react-router-dom";
import {
	Typography,
	Card,
	CardContent,
	CardActions,
	Button,
	Avatar,
	Divider,
	Stack,
	Chip,
	CardMedia,
	useTheme,
	useMediaQuery,
} from "@mui/material";
import EmailIcon from "@mui/icons-material/Email";
import PhoneIcon from "@mui/icons-material/Phone";
import ArticleIcon from "@mui/icons-material/Article";
import LanguageIcon from "@mui/icons-material/Language";
import type { User } from "../../../types";

interface UserCardProps {
	user: User;
	avatarUrl: string;
	postCount: number;
}

/**
 * Componente que exibe um card de usuário.
 *
 * @param {UserCardProps} props - As propriedades do componente.
 * @returns {JSX.Element} O componente UserCard renderizado.
 */
export function UserCard({ user, avatarUrl, postCount }: UserCardProps) {
	const theme = useTheme();
	const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

	return (
		<Card
			sx={{
				height: "100%",
				display: "flex",
				flexDirection: "column",
				transition: "transform 0.2s, box-shadow 0.2s",
				borderRadius: 2,
				overflow: "hidden",
				"&:hover": {
					transform: "translateY(-4px)",
					boxShadow: 4,
				},
			}}
		>
			<CardMedia
				component="div"
				sx={{
					pt: "40%",
					position: "relative",
					backgroundImage: "linear-gradient(135deg, rgba(0,0,0,0.1) 0%, rgba(0,0,0,0.4) 100%)",
				}}
			>
				<Avatar
					src={avatarUrl}
					sx={{
						position: "absolute",
						top: "50%",
						left: "50%",
						transform: "translate(-50%, -50%)",
						width: 80,
						height: 80,
						fontSize: "2rem",
						bgcolor: theme.palette.background.paper,
						color: theme.palette.primary.main,
						border: `3px solid ${theme.palette.background.paper}`,
					}}
				>
					{user.name.charAt(0)}
				</Avatar>
			</CardMedia>

			<CardContent sx={{ flexGrow: 1, textAlign: "center" }}>
				<Typography
					variant="h6"
					component="h3"
					gutterBottom
					sx={{
						fontWeight: 600,
						wordBreak: "break-word",
					}}
				>
					{user.name}
				</Typography>

				<Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
					@{user.username}
				</Typography>

				<Stack direction="row" spacing={1} justifyContent="center" sx={{ mb: 2 }}>
					<Chip
						icon={<ArticleIcon />}
						label={`${postCount} posts`}
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
								wordBreak: "break-all",
								fontSize: isMobile ? "0.8rem" : "0.875rem",
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
								fontSize: isMobile ? "0.8rem" : "0.875rem",
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
								fontSize: isMobile ? "0.8rem" : "0.875rem",
							}}
						>
							{user.website}
						</Typography>
					</Stack>
				</Stack>
			</CardContent>

			<CardActions sx={{ justifyContent: "center", pb: 2 }}>
				<Button
					variant="contained"
					size="small"
					component={RouterLink}
					to={`/users/${user.id}`}
					sx={{
						borderRadius: "20px",
						textTransform: "none",
						fontWeight: 600,
						px: 3,
						transition: "all 0.3s ease",
						"&:hover": {
							color: "#ffffff",
							backgroundColor: theme.palette.primary.dark,
							transform: "scale(1.05)",
							boxShadow: theme.shadows[4],
						},
					}}
				>
					Ver perfil
				</Button>
			</CardActions>
		</Card>
	);
}
