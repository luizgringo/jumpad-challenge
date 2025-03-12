import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider, CssBaseline } from '@mui/material';
import { Box } from '@mui/material';
import { Layout } from './layout/Layout';
import { Home } from './pages/Home/Home';
import { PostDetail } from './pages/Post/PostDetail';
import { UserList } from './pages/User/UserList';
import { UserDetail } from './pages/User/UserDetail';
import  ImagePreloader from './components/ImagePreloader';
import { getPosts } from './services/api';
import theme from './theme/theme';

/**
 * Componente principal da aplicação.
 * 
 * Este componente configura o roteamento da aplicação e aplica o tema do Material UI.
 * 
 * @returns {JSX.Element} O componente App renderizado.
 */
function App() {
	const [initialPostIds, setInitialPostIds] = useState<number[]>([]);
	const [loading, setLoading] = useState(true);

	// Carregar os IDs dos primeiros posts para pré-carregamento
	useEffect(() => {
		const fetchInitialPosts = async () => {
			try {
				const posts = await getPosts();
				// Pegar os IDs dos 10 primeiros posts
				const ids = posts.slice(0, 10).map(post => post.id);
				setInitialPostIds(ids);
			} catch (error) {
				console.error('Erro ao carregar posts iniciais:', error);
			} finally {
				setLoading(false);
			}
		};

		fetchInitialPosts();
	}, []);

	return (
		<ThemeProvider theme={theme}>
			<CssBaseline />
			<Box sx={{ width: '100%', display: 'flex', flexDirection: 'column' }}>
				<ImagePreloader 
					initialPostIds={initialPostIds} 
					showLoadingIndicator={loading}
				>
					<Router>
						<Layout>
							<Routes>
								<Route path="/" element={<Home />} />
								<Route path="/posts/:id" element={<PostDetail />} />
								<Route path="/users" element={<UserList />} />
								<Route path="/users/:id" element={<UserDetail />} />
							</Routes>
						</Layout>
					</Router>
				</ImagePreloader>
			</Box>
		</ThemeProvider>
	);
}

export default App;
