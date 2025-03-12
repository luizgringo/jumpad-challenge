import { Link as RouterLink } from "react-router-dom";
import {
	Typography,
	Card,
	CardContent,
	CardActions,
	Button,
	CardMedia,
	Divider,
	Box,
	Stack,
	Avatar,
} from "@mui/material";
import type { Post } from "../types";

interface PostCardProps {
	post: Post;
	getPostImage: (postId: number, width?: number, height?: number) => string;
	showAuthor?: boolean;
	getAuthorName?: (userId: number) => string;
	getAuthorAvatar?: (userId: number) => string;
}

/**
 * Componente que exibe um card de post.
 *
 * @param {PostCardProps} props - As propriedades do componente.
 * @returns {JSX.Element} O componente PostCard renderizado.
 */
export function PostCard({
	post,
	getPostImage,
	showAuthor = false,
	getAuthorName = () => "Autor desconhecido",
	getAuthorAvatar = () => "",
}: PostCardProps) {
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
						overflow: "hidden",
						textOverflow: "ellipsis",
						display: "-webkit-box",
						WebkitLineClamp: 2,
						WebkitBoxOrient: "vertical",
						lineHeight: 1.3,
						height: "2.6em",
						fontWeight: 600,
					}}
				>
					{post.title}
				</Typography>

				<Typography
					variant="body2"
					color="text.secondary"
					sx={{
						overflow: "hidden",
						textOverflow: "ellipsis",
						display: "-webkit-box",
						WebkitLineClamp: 3,
						WebkitBoxOrient: "vertical",
						mb: 1,
					}}
				>
					{post.body}
				</Typography>
			</CardContent>

			{showAuthor && (
				<>
					<Divider />
					<Box sx={{ px: 2, py: 1 }}>
						<Stack direction="row" spacing={1} alignItems="center">
							<Box
								component={RouterLink}
								to={`/users/${post.userId}`}
								sx={{
									display: "flex",
									alignItems: "center",
									textDecoration: "none",
									color: "inherit",
									"&:hover": {
										"& .MuiTypography-root": {
											color: "primary.main",
										},
									},
								}}
							>
								<Avatar
									src={getAuthorAvatar(post.userId)}
									alt={getAuthorName(post.userId)}
									sx={{
										width: 24,
										height: 24,
										mr: 1,
										border: "1px solid",
										borderColor: "divider",
									}}
								>
									{getAuthorName(post.userId).charAt(0)}
								</Avatar>
								<Typography
									variant="body2"
									color="text.secondary"
									sx={{
										fontWeight: 500,
										overflow: "hidden",
										textOverflow: "ellipsis",
										whiteSpace: "nowrap",
										maxWidth: "120px",
									}}
								>
									{getAuthorName(post.userId)}
								</Typography>
							</Box>
						</Stack>
					</Box>
				</>
			)}

			<Divider />
			<CardActions sx={{ justifyContent: "space-between", px: 2 }}>
				<Button
					size="small"
					component={RouterLink}
					to={`/posts/${post.id}`}
					sx={{
						textTransform: "none",
						fontWeight: 600,
					}}
				>
					Ler mais
				</Button>
				<Typography variant="caption" color="text.secondary">
					{Math.floor(Math.random() * 10) + 1} min de leitura
				</Typography>
			</CardActions>
		</Card>
	);
}
