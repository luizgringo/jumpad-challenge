import { Alert } from "@mui/material";
import Grid2 from "@mui/material/Grid2";
import { PostCard } from "../../../components/PostCard";
import type { Post } from "../../../types";

interface UserPostsTabProps {
	posts: Post[];
	getPostImage: (postId: number, width?: number, height?: number) => string;
}

/**
 * Componente que exibe os posts de um usuário.
 *
 * @param {UserPostsTabProps} props - As propriedades do componente.
 * @returns {JSX.Element} O componente UserPostsTab renderizado.
 */
export function UserPostsTab({ posts, getPostImage }: UserPostsTabProps) {
	if (posts.length === 0) {
		return <Alert severity="info">Este usuário não possui posts.</Alert>;
	}

	return (
		<Grid2 container spacing={3}>
			{posts.map((post) => (
				<Grid2 size={{ xs: 12, sm: 6, md: 4 }} key={post.id}>
					<PostCard post={post} getPostImage={getPostImage} />
				</Grid2>
			))}
		</Grid2>
	);
}
