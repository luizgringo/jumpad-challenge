import { Box, Paper, CircularProgress } from "@mui/material";

interface CoverImageProps {
	imageUrl: string;
	imageLoaded: boolean;
	height?: { xs: number; md: number };
}

/**
 * Componente que exibe uma imagem de capa com overlay e indicador de carregamento.
 *
 * @param {CoverImageProps} props - As propriedades do componente.
 * @returns {JSX.Element} O componente CoverImage renderizado.
 */
export function CoverImage({
	imageUrl,
	imageLoaded,
	height = { xs: 200, md: 300 },
}: CoverImageProps) {
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
				backgroundImage: `url(${imageUrl})`,
				borderRadius: 2,
				height: height,
				overflow: "hidden",
				opacity: imageLoaded ? 1 : 0.7,
				transition: "opacity 0.3s ease-in-out",
			}}
		>
			<Box
				sx={{
					position: "absolute",
					top: 0,
					bottom: 0,
					right: 0,
					left: 0,
					backgroundColor: "rgba(0,0,0,.3)",
				}}
			/>
			{imageLoaded || (
				<Box
					sx={{
						position: "absolute",
						top: "50%",
						left: "50%",
						transform: "translate(-50%, -50%)",
					}}
				>
					<CircularProgress color="inherit" />
				</Box>
			)}
		</Paper>
	);
}
