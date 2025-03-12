import { Link as RouterLink } from "react-router-dom";
import { Typography, Button, Box, Paper, Grid2 } from "@mui/material";
import type { Post } from "../../types";

interface FeaturedPostProps {
	post: Post;
	getPostImage: (postId: number, width?: number, height?: number) => string;
}

/**
 * Componente que exibe um post em destaque com imagem de fundo e conteúdo sobreposto.
 *
 * @param {FeaturedPostProps} props - As propriedades do componente.
 * @returns {JSX.Element} O componente FeaturedPost renderizado.
 */
export function FeaturedPost({ post, getPostImage }: FeaturedPostProps) {
	return (
		<Paper
			sx={{
				position: "relative",
				backgroundColor: "grey.800",
				color: "#fff",
				mb: 4,
				backgroundSize: "cover",
				backgroundRepeat: "no-repeat",
				backgroundPosition: "center",
				backgroundImage: `url(${getPostImage(post.id, 1200, 600)})`,
				borderRadius: 2,
				overflow: "hidden",
			}}
		>
			<Box
				sx={{
					position: "absolute",
					top: 0,
					bottom: 0,
					right: 0,
					left: 0,
					backgroundColor: "rgba(0,0,0,.5)",
				}}
			/>
			<Grid2 container>
				<Grid2 size={{ md: 8 }}>
					<Box
						sx={{
							position: "relative",
							p: { xs: 3, md: 6 },
							pr: { md: 0 },
						}}
					>
						<Typography component="h1" variant="h3" color="inherit" gutterBottom>
							{post.title}
						</Typography>
						<Typography variant="subtitle1" color="inherit" paragraph>
							{post.body.substring(0, 150)}...
						</Typography>
						<Button
							variant="contained"
							component={RouterLink}
							to={`/posts/${post.id}`}
							sx={{
								borderRadius: "20px",
								textTransform: "none",
								fontWeight: 600,
							}}
						>
							Continuar lendo
						</Button>
					</Box>
				</Grid2>
			</Grid2>
		</Paper>
	);
}
