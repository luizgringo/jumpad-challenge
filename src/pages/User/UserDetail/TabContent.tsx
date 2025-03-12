import { Box } from "@mui/material";
import { UserInfoTab } from "./UserInfoTab";
import { UserPostsTab } from "./UserPostsTab";
import type { User, Post } from "../../../types";

interface TabContentProps {
	tabValue: number;
	user: User;
	posts: Post[];
	getPostImage: (postId: number) => string;
}

/**
 * Componente que gerencia o conteúdo das abas.
 *
 * @param {TabContentProps} props - As propriedades do componente.
 * @returns {JSX.Element} O componente TabContent renderizado.
 */
export function TabContent({ tabValue, user, posts, getPostImage }: TabContentProps) {
	return (
		<>
			<Box role="tabpanel" hidden={tabValue !== 0} sx={{ mb: 4 }}>
				{tabValue === 0 && <UserInfoTab user={user} />}
			</Box>

			<Box role="tabpanel" hidden={tabValue !== 1} sx={{ mb: 4 }}>
				{tabValue === 1 && <UserPostsTab posts={posts} getPostImage={getPostImage} />}
			</Box>
		</>
	);
}
