import { useEffect } from "react";

/**
 * Tipo para representar o status de carregamento de uma imagem
 */
export type ImageLoadStatus = "idle" | "loading" | "loaded" | "error";

/**
 * Cache de imagens pré-carregadas
 */
const preloadedImages: Record<string, HTMLImageElement> = {};
const imageStatus: Record<string, ImageLoadStatus> = {};

/**
 * Pré-carrega uma imagem e a armazena em cache
 *
 * @param url - URL da imagem a ser pré-carregada
 * @returns Uma Promise que resolve quando a imagem é carregada ou rejeita se houver erro
 */
export function preloadImage(url: string): Promise<HTMLImageElement> {
	// Se a imagem já estiver carregada, retorna a imagem do cache
	if (imageStatus[url] === "loaded" && preloadedImages[url]) {
		return Promise.resolve(preloadedImages[url]);
	}

	// Se a imagem estiver em processo de carregamento, aguarda
	if (imageStatus[url] === "loading") {
		return new Promise((resolve, reject) => {
			const checkInterval = setInterval(() => {
				if (imageStatus[url] === "loaded") {
					clearInterval(checkInterval);
					resolve(preloadedImages[url]);
				} else if (imageStatus[url] === "error") {
					clearInterval(checkInterval);
					reject(new Error(`Falha ao carregar imagem: ${url}`));
				}
			}, 100);
		});
	}

	// Inicia o carregamento da imagem
	imageStatus[url] = "loading";

	return new Promise((resolve, reject) => {
		const img = new Image();

		img.onload = () => {
			preloadedImages[url] = img;
			imageStatus[url] = "loaded";
			resolve(img);
		};

		img.onerror = () => {
			imageStatus[url] = "error";
			reject(new Error(`Falha ao carregar imagem: ${url}`));
		};

		img.src = url;
	});
}

/**
 * Pré-carrega várias imagens em paralelo
 *
 * @param urls - Array de URLs de imagens a serem pré-carregadas
 * @returns Uma Promise que resolve quando todas as imagens são carregadas
 */
export function preloadImages(urls: string[]): Promise<HTMLImageElement[]> {
	return Promise.all(urls.map((url) => preloadImage(url)));
}

/**
 * Verifica se uma imagem já foi pré-carregada
 *
 * @param url - URL da imagem a ser verificada
 * @returns true se a imagem já foi carregada, false caso contrário
 */
export function isImagePreloaded(url: string): boolean {
	return imageStatus[url] === "loaded";
}

/**
 * Gera a URL da imagem de um post
 *
 * @param postId - ID do post
 * @param width - Largura da imagem (opcional, padrão: 400)
 * @param height - Altura da imagem (opcional, padrão: 200)
 * @returns URL da imagem do post
 */
export function getPostImageUrl(postId: number, width = 400, height = 200): string {
	return `https://picsum.photos/seed/post-${postId}/${width}/${height}`;
}

/**
 * Hook personalizado para pré-carregar imagens de posts
 *
 * @param postIds - Array de IDs de posts
 * @param width - Largura das imagens (opcional)
 * @param height - Altura das imagens (opcional)
 */
export function usePreloadPostImages(postIds: number[], width?: number, height?: number): void {
	useEffect(() => {
		if (!postIds.length) return;

		const urls = postIds.map((id) => getPostImageUrl(id, width, height));
		preloadImages(urls).catch((error) => {
			console.error("Erro ao pré-carregar imagens:", error);
		});
	}, [postIds, width, height]);
}
