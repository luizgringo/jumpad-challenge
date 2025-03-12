import { Typography, Box, Paper, Grid2 } from "@mui/material";

interface PageBannerProps {
	title: string;
	description: string;
	backgroundImage?: string;
}

/**
 * Componente que exibe um banner na parte superior de uma página.
 *
 * @param {PageBannerProps} props - As propriedades do componente.
 * @returns {JSX.Element} O componente PageBanner renderizado.
 */
export function PageBanner({
	title,
	description,
	backgroundImage = "https://picsum.photos/seed/team/1200/600",
}: PageBannerProps) {
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
				backgroundImage: `url(${backgroundImage})`,
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
							{title}
						</Typography>
						<Typography variant="subtitle1" color="inherit" paragraph>
							{description}
						</Typography>
					</Box>
				</Grid2>
			</Grid2>
		</Paper>
	);
}
