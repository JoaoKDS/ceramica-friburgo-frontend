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

// Produtos que ganham o selo "Mais pedido" no catálogo.
// É só escrever o nome do produto como está no cadastro (não importa se é
// "x" ou "×", nem acento ou maiúscula). Para tirar ou colocar um selo,
// basta apagar ou acrescentar uma linha aqui.
export const MAIS_VENDIDOS = [
  'Bloco Estrutural 14x19x29',
  'Bloco Cerâmico 11,5x14x24 (Bloquinho 6F)',
  'Bloco Cerâmico 14x19x29 (Blocão 9F)',
]

export const HORARIO_ATENDIMENTO = 'Segunda a sexta, das 7h às 16h'

// Regras de quantidade (usadas no aviso do orçamento e no FAQ).
// Para mudar uma regra, é só trocar o número aqui.
export const PEDIDO_MINIMO_PECAS = 100 // o pedido precisa ser acima disso
export const ENTREGA_CAMPINAS_PECAS = 1000 // entrega em Campinas acima disso
export const ENTREGA_REGIAO_PECAS = 2000 // entrega na região acima disso

export const CHAVE_CARRINHO = 'ceramica-friburgo-orcamento'
