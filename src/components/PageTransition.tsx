import { motion } from "framer-motion";
import type { ReactNode } from "react";
import { useLocation } from "react-router-dom";

interface PageTransitionProps {
	children: ReactNode;
}

/**
 * Componente que adiciona animações de transição entre páginas.
 * 
 * @param {PageTransitionProps} props - As propriedades do componente.
 * @returns {JSX.Element} O componente PageTransition renderizado.
 */
export function PageTransition({ children }: PageTransitionProps) {
	const location = useLocation();

	// Configurações da animação
	const pageVariants = {
		initial: {
			opacity: 0,
			y: 10,
			scale: 0.98,
		},
		animate: {
			opacity: 1,
			y: 0,
			scale: 1,
		},
		exit: {
			opacity: 0,
			y: -10,
			scale: 0.98,
		},
	};

	const pageTransition = {
		type: "tween",
		ease: "anticipate",
		duration: 0.6,
	};

	return (
		<motion.div
			key={location.pathname}
			initial="initial"
			animate="animate"
			exit="exit"
			variants={pageVariants}
			transition={pageTransition}
			style={{ width: "100%" }}
		>
			{children}
		</motion.div>
	);
}

export default PageTransition;
