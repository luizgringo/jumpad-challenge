import type { ReactElement } from "react";
import { Box, Tabs, Tab, useMediaQuery, useTheme } from "@mui/material";

interface TabItem {
	label: string;
	icon: ReactElement;
	id: string;
}

interface TabNavigationProps {
	items: TabItem[];
	value: number;
	onChange: (event: React.SyntheticEvent, newValue: number) => void;
}

/**
 * Componente que exibe uma navegação por abas.
 *
 * @param {TabNavigationProps} props - As propriedades do componente.
 * @returns {JSX.Element} O componente TabNavigation renderizado.
 */
export function TabNavigation({ items, value, onChange }: TabNavigationProps) {
	const theme = useTheme();
	const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

	return (
		<Box sx={{ borderBottom: 1, borderColor: "divider", mb: 3 }}>
			<Tabs
				value={value}
				onChange={onChange}
				variant={isMobile ? "fullWidth" : "standard"}
				sx={{
					"& .MuiTab-root": {
						textTransform: "none",
						fontWeight: 600,
						fontSize: "1rem",
					},
				}}
			>
				{items.map((item) => (
					<Tab key={item.id} label={item.label} icon={item.icon} iconPosition="start" />
				))}
			</Tabs>
		</Box>
	);
}
