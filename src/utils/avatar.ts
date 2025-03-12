/**
 * Gera um avatar para um usuário com aparência de foto real usando o serviço ThisPerson.AI
 * 
 * @param id - ID do usuário ou comentário
 * @returns URL do avatar
 */
export function generateRealisticAvatar(id: number): string {
  // Usa o serviço Pravatar para gerar avatares de pessoas reais
  // Este serviço fornece fotos de pessoas reais
  return `https://i.pravatar.cc/300?img=${id % 70}`; // O serviço tem cerca de 70 imagens
}