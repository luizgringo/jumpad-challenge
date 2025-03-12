import { Typography } from "@mui/material";

interface PostContentProps {
	content: string;
	fontSize?: { xs: string; sm: string };
}

/**
 * Componente que exibe o conteúdo de um post formatado em parágrafos.
 *
 * @param {PostContentProps} props - As propriedades do componente.
 * @returns {JSX.Element} O componente PostContent renderizado.
 */
export function PostContent({
	content,
	fontSize = { xs: "1rem", sm: "1.1rem" },
}: PostContentProps) {
	return (
		<Typography
			variant="body1"
			paragraph
			sx={{
				lineHeight: 1.8,
				fontSize: fontSize,
				textAlign: "justify",
				mb: 4,
			}}
		>
			{content.split("\n\n").map((paragraph, index) => (
				<Typography
					key={`paragraph-${index}-${paragraph.substring(0, 10)}`}
					variant="body1"
					paragraph
					sx={{
						lineHeight: 1.8,
						fontSize: fontSize,
						mb: 2,
					}}
				>
					{paragraph}
				</Typography>
			))}
		</Typography>
	);
}
