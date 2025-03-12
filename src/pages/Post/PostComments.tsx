import { Typography, Box, Card, CardContent, Alert, Avatar, Stack, useTheme } from "@mui/material";
import type { Comment } from "../../types";

interface PostCommentsProps {
	comments: Comment[];
	commentAvatarUrls: Record<number, string>;
}

/**
 * Componente que exibe a seção de comentários de um post.
 *
 * @param {PostCommentsProps} props - As propriedades do componente.
 * @returns {JSX.Element} O componente PostComments renderizado.
 */
export function PostComments({ comments, commentAvatarUrls }: PostCommentsProps) {
	const theme = useTheme();

	return (
		<Box sx={{ mb: 4 }}>
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
				Comentários ({comments.length})
			</Typography>

			{comments.length === 0 ? (
				<Alert severity="info">Não há comentários para este post.</Alert>
			) : (
				<Stack spacing={3}>
					{comments.map((comment) => (
						<Card
							key={comment.id}
							variant="outlined"
							sx={{
								transition: "box-shadow 0.2s",
								borderRadius: 2,
								"&:hover": {
									boxShadow: 2,
								},
							}}
						>
							<CardContent>
								<Stack spacing={2}>
									<Stack direction="row" spacing={2} alignItems="center" sx={{ mb: 1 }}>
										<Avatar
											src={commentAvatarUrls[comment.id]}
											sx={{
												bgcolor: theme.palette.secondary.main,
												width: 40,
												height: 40,
												border: `2px solid ${theme.palette.background.paper}`,
												boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
											}}
										>
											{comment.name.charAt(0)}
										</Avatar>
										<Box sx={{ flexGrow: 1 }}>
											<Typography
												variant="subtitle1"
												sx={{
													fontWeight: 600,
													lineHeight: 1.2,
												}}
											>
												{comment.name}
											</Typography>
											<Typography
												variant="caption"
												color="text.secondary"
												sx={{
													display: "block",
													mb: 0.5,
												}}
											>
												{comment.email}
											</Typography>
										</Box>
										<Typography
											variant="caption"
											color="text.secondary"
											sx={{
												display: { xs: "none", sm: "block" },
											}}
										>
											{new Date(
												Date.now() - Math.floor(Math.random() * 7 * 24 * 60 * 60 * 1000),
											).toLocaleDateString("pt-BR")}
										</Typography>
									</Stack>

									<Typography
										variant="body2"
										sx={{
											lineHeight: 1.6,
											textAlign: "justify",
											pl: { xs: 0, sm: 7 },
											pt: 1,
											pb: 1,
											borderLeft: { xs: "none", sm: `4px solid ${theme.palette.divider}` },
											ml: { xs: 0, sm: 1 },
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
	);
}
