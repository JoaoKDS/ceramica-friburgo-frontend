// ⚠️ IMPORTANTE: essa linha detecta se você está usando Vite ou Next.js
// e pega a URL da API do arquivo .env. Se você não criar o .env, ele usa
// localhost:8080 como padrão (bom pra testar, mas ruim pra produção).
export const API_URL =
  (typeof import.meta !== 'undefined' && import.meta.env?.VITE_API_URL) ||
  (typeof process !== 'undefined' && process.env?.NEXT_PUBLIC_API_URL) ||
  'http://localhost:8080'

export const WHATSAPP_NUMERO = '5519993369208'
export const ANOS_NO_MERCADO = 30

export const EMOJIS_POR_CATEGORIA = {
  'Blocos Cerâmicos': '🧱',
  'Blocos Estruturais': '🏗️',
  'Lajotas': '🟫',
  'Canaletas': '📏',
}

// Fotos da empresa (rodam sozinhas no carrossel da seção "Quem somos")
export const FOTOS = [
  '/ceramica.jpeg',
  '/entrada2.jpeg',
  '/entrada3.jpeg',
  '/entrada4.jpeg',
  '/foto-empresa.jpeg',
]

export const CHAVE_CARRINHO = 'ceramica-friburgo-orcamento'
