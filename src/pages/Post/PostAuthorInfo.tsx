import { Link as RouterLink } from "react-router-dom";
import { Typography, Box, Divider, Avatar, Stack, useTheme } from "@mui/material";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import CommentIcon from "@mui/icons-material/Comment";
import type { User } from "../../types";

interface PostAuthorInfoProps {
	user: User;
	authorAvatarUrl: string;
	formattedDate: string;
	readingTime: number;
	commentsCount: number;
}

/**
 * Componente que exibe informações do autor e metadados de um post.
 *
 * @param {PostAuthorInfoProps} props - As propriedades do componente.
 * @returns {JSX.Element} O componente PostAuthorInfo renderizado.
 */
export function PostAuthorInfo({
	user,
	authorAvatarUrl,
	formattedDate,
	readingTime,
	commentsCount,
}: PostAuthorInfoProps) {
	const theme = useTheme();

	return (
		<Stack
			direction={{ xs: "column", sm: "row" }}
			spacing={2}
			alignItems={{ xs: "flex-start", sm: "center" }}
			sx={{ mb: 4 }}
		>
			<Stack direction="row" spacing={1} alignItems="center">
				<Avatar
					src={authorAvatarUrl}
					sx={{
						bgcolor: "primary.main",
						width: 40,
						height: 40,
						border: `2px solid ${theme.palette.background.paper}`,
						boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
					}}
				>
					{user.name.charAt(0)}
				</Avatar>
				<Box>
					<Typography
						variant="subtitle1"
						sx={{
							fontWeight: 600,
							lineHeight: 1.2,
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
							textDecoration: "none",
							"&:hover": {
								textDecoration: "underline",
								color: "primary.main",
							},
							display: "flex",
							alignItems: "center",
							gap: 0.5,
						}}
					>
						@{user.username}
					</Typography>
				</Box>
			</Stack>

			<Divider orientation="vertical" flexItem sx={{ display: { xs: "none", sm: "block" } }} />

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
						{commentsCount} comentários
					</Typography>
				</Stack>
			</Stack>
		</Stack>
	);
}
