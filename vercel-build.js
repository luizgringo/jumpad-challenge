import fs from 'node:fs';

// Garante que o diretório dist existe
if (!fs.existsSync('./dist')) {
  fs.mkdirSync('./dist');
}

// Cria um arquivo _redirects no diretório dist
fs.writeFileSync('./dist/_redirects', '/* /index.html 200');

console.log('Arquivo _redirects criado com sucesso!'); 