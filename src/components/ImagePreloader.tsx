import { useEffect, useState } from "react";
import { Box, CircularProgress, Typography } from "@mui/material";
import { preloadImages, getPostImageUrl } from "../utils/imagePreloader";

interface ImagePreloaderProps {
	children: React.ReactNode;
	initialPostIds?: number[];
	showLoadingIndicator?: boolean;
}

/**
 * Componente que pré-carrega imagens importantes antes de renderizar o conteúdo
 *
 * @param props - Propriedades do componente
 * @param props.children - Conteúdo a ser renderizado após o pré-carregamento
 * @param props.initialPostIds - IDs dos posts cujas imagens devem ser pré-carregadas
 * @param props.showLoadingIndicator - Se deve mostrar um indicador de carregamento
 * @returns O componente ImagePreloader renderizado
 */
export default function ImagePreloader({
	children,
	initialPostIds = [],
	showLoadingIndicator = false,
}: ImagePreloaderProps) {
	const [loading, setLoading] = useState(initialPostIds.length > 0);
	const [progress, setProgress] = useState(0);
	const [totalImages, setTotalImages] = useState(initialPostIds.length);
	const [loadedImages, setLoadedImages] = useState(0);

	useEffect(() => {
		if (initialPostIds.length === 0) {
			setLoading(false);
			return;
		}

		setTotalImages(initialPostIds.length);

		// Gerar URLs das imagens dos posts
		const imageUrls = initialPostIds.map((id) => getPostImageUrl(id, 400, 200));

		// Contador para acompanhar o progresso
		let loaded = 0;

		// Pré-carregar cada imagem individualmente para acompanhar o progresso
		const preloadPromises = imageUrls.map(
			(url) =>
				new Promise<void>((resolve) => {
					const img = new Image();

					img.onload = () => {
						loaded++;
						setLoadedImages(loaded);
						setProgress(Math.round((loaded / imageUrls.length) * 100));
						resolve();
					};

					img.onerror = () => {
						loaded++;
						setLoadedImages(loaded);
						setProgress(Math.round((loaded / imageUrls.length) * 100));
						resolve();
					};

					img.src = url;
				}),
		);

		// Quando todas as imagens forem carregadas, definir loading como false
		Promise.all(preloadPromises)
			.then(() => {
				setLoading(false);
			})
			.catch((error) => {
				console.error("Erro ao pré-carregar imagens:", error);
				setLoading(false);
			});
	}, [initialPostIds]);

	// Se não estiver carregando ou não deve mostrar o indicador, renderizar diretamente o conteúdo
	if (!loading || !showLoadingIndicator) {
		return <>{children}</>;
	}

	// Renderizar indicador de carregamento
	return (
		<Box
			sx={{
				display: "flex",
				flexDirection: "column",
				alignItems: "center",
				justifyContent: "center",
				height: "100vh",
				width: "100%",
				bgcolor: "background.paper",
			}}
		>
			<CircularProgress
				variant="determinate"
				value={progress}
				size={60}
				thickness={4}
				sx={{ mb: 2 }}
			/>
			<Typography variant="h6" gutterBottom>
				Carregando imagens...
			</Typography>
			<Typography variant="body2" color="text.secondary">
				{loadedImages} de {totalImages} ({progress}%)
			</Typography>
		</Box>
	);
}
