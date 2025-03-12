import {
	Typography,
	Paper,
	List,
	ListItem,
	ListItemIcon,
	ListItemText,
	Grid2,
} from "@mui/material";
import EmailIcon from "@mui/icons-material/Email";
import PhoneIcon from "@mui/icons-material/Phone";
import LanguageIcon from "@mui/icons-material/Language";
import BusinessIcon from "@mui/icons-material/Business";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import type { User } from "../../../types";

interface UserInfoTabProps {
	user: User;
}

/**
 * Componente que exibe as informações detalhadas do usuário.
 *
 * @param {UserInfoTabProps} props - As propriedades do componente.
 * @returns {JSX.Element} O componente UserInfoTab renderizado.
 */
export function UserInfoTab({ user }: UserInfoTabProps) {
	return (
		<Grid2 container spacing={3}>
			<Grid2 size={{ xs: 12, md: 6 }}>
				<Paper
					elevation={0}
					variant="outlined"
					sx={{
						p: 3,
						borderRadius: 2,
					}}
				>
					<Typography
						variant="h6"
						gutterBottom
						sx={{
							mb: 2,
							fontWeight: 600,
							position: "relative",
							"&:after": {
								content: '""',
								display: "block",
								position: "absolute",
								bottom: -8,
								left: 0,
								width: 40,
								height: 3,
								backgroundColor: "primary.main",
							},
						}}
					>
						Contato
					</Typography>

					<List sx={{ width: "100%" }}>
						<ListItem dense sx={{ mb: 2, px: 0 }}>
							<ListItemIcon sx={{ minWidth: 40 }}>
								<EmailIcon color="primary" />
							</ListItemIcon>
							<ListItemText
								primary="Email"
								secondary={user.email}
								slotProps={{
									primary: {
										variant: "subtitle2",
										color: "text.secondary",
									},
									secondary: {
										variant: "body1",
										sx: { wordBreak: "break-all" },
									},
								}}
							/>
						</ListItem>

						<ListItem dense sx={{ mb: 2, px: 0 }}>
							<ListItemIcon sx={{ minWidth: 40 }}>
								<PhoneIcon color="primary" />
							</ListItemIcon>
							<ListItemText
								primary="Telefone"
								secondary={user.phone}
								slotProps={{
									primary: {
										variant: "subtitle2",
										color: "text.secondary",
									},
								}}
							/>
						</ListItem>

						<ListItem dense sx={{ mb: 2, px: 0 }}>
							<ListItemIcon sx={{ minWidth: 40 }}>
								<LanguageIcon color="primary" />
							</ListItemIcon>
							<ListItemText
								primary="Website"
								secondary={user.website}
								slotProps={{
									primary: {
										variant: "subtitle2",
										color: "text.secondary",
									},
									secondary: {
										variant: "body1",
										sx: { wordBreak: "break-all" },
									},
								}}
							/>
						</ListItem>
					</List>
				</Paper>
			</Grid2>

			<Grid2 size={{ xs: 12, md: 6 }}>
				<Paper
					elevation={0}
					variant="outlined"
					sx={{
						p: 3,
						borderRadius: 2,
					}}
				>
					<Typography
						variant="h6"
						gutterBottom
						sx={{
							mb: 2,
							fontWeight: 600,
							position: "relative",
							"&:after": {
								content: '""',
								display: "block",
								position: "absolute",
								bottom: -8,
								left: 0,
								width: 40,
								height: 3,
								backgroundColor: "primary.main",
							},
						}}
					>
						Empresa
					</Typography>

					<List sx={{ width: "100%" }}>
						<ListItem dense sx={{ mb: 2, px: 0 }}>
							<ListItemIcon sx={{ minWidth: 40 }}>
								<BusinessIcon color="primary" />
							</ListItemIcon>
							<ListItemText
								primary="Nome"
								secondary={user.company?.name}
								slotProps={{
									primary: {
										variant: "subtitle2",
										color: "text.secondary",
									},
								}}
							/>
						</ListItem>

						<ListItem dense sx={{ mb: 2, px: 0 }}>
							<ListItemIcon sx={{ minWidth: 40 }}>
								<BusinessIcon color="primary" />
							</ListItemIcon>
							<ListItemText
								primary="Slogan"
								secondary={user.company?.catchPhrase}
								slotProps={{
									primary: {
										variant: "subtitle2",
										color: "text.secondary",
									},
								}}
							/>
						</ListItem>

						<ListItem dense sx={{ mb: 2, px: 0 }}>
							<ListItemIcon sx={{ minWidth: 40 }}>
								<BusinessIcon color="primary" />
							</ListItemIcon>
							<ListItemText
								primary="Área de atuação"
								secondary={user.company?.bs}
								slotProps={{
									primary: {
										variant: "subtitle2",
										color: "text.secondary",
									},
								}}
							/>
						</ListItem>
					</List>
				</Paper>
			</Grid2>

			<Grid2 size={{ xs: 12 }}>
				<Paper
					elevation={0}
					variant="outlined"
					sx={{
						p: 3,
						borderRadius: 2,
					}}
				>
					<Typography
						variant="h6"
						gutterBottom
						sx={{
							mb: 2,
							fontWeight: 600,
							position: "relative",
							"&:after": {
								content: '""',
								display: "block",
								position: "absolute",
								bottom: -8,
								left: 0,
								width: 40,
								height: 3,
								backgroundColor: "primary.main",
							},
						}}
					>
						Endereço
					</Typography>

					<List sx={{ width: "100%" }}>
						<ListItem dense sx={{ px: 0 }}>
							<ListItemIcon sx={{ minWidth: 40 }}>
								<LocationOnIcon color="primary" />
							</ListItemIcon>
							<ListItemText
								primary={`${user.address?.street}, ${user.address?.suite}`}
								secondary={`${user.address?.city}, ${user.address?.zipcode}`}
								slotProps={{
									primary: {
										variant: "body1",
									},
									secondary: {
										variant: "body2",
										color: "text.secondary",
									},
								}}
							/>
						</ListItem>
					</List>
				</Paper>
			</Grid2>
		</Grid2>
	);
}
