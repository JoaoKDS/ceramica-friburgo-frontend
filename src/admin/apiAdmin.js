import { API_URL } from '../constants'

// Tudo que o painel conversa com o back-end fica neste arquivo.

export class ErroApi extends Error {
  constructor(status, mensagem) {
    super(mensagem)
    this.status = status
  }
}

// Monta o cabeçalho de login (o mesmo "Basic Auth" que o Postman usa).
// O TextEncoder garante que acentos na senha funcionem.
function cabecalhoDeLogin({ usuario, senha }) {
  const bytes = new TextEncoder().encode(`${usuario}:${senha}`)
  let texto = ''
  bytes.forEach(byte => {
    texto += String.fromCharCode(byte)
  })
  return `Basic ${btoa(texto)}`
}

function mensagemDoErro(status) {
  if (status === 400) return 'Algum campo está vazio ou grande demais. Confira o formulário.'
  if (status === 401) return 'Usuário ou senha incorretos.'
  if (status === 404) return 'Esse produto não existe mais. Atualize a lista.'
  return `O servidor respondeu com erro (${status}). Tente de novo em instantes.`
}

async function chamar(caminho, { metodo = 'GET', credenciais, corpo } = {}) {
  const cabecalhos = {}
  if (credenciais) cabecalhos.Authorization = cabecalhoDeLogin(credenciais)
  if (corpo !== undefined) cabecalhos['Content-Type'] = 'application/json'

  let resposta
  try {
    resposta = await fetch(`${API_URL}${caminho}`, {
      method: metodo,
      headers: cabecalhos,
      body: corpo !== undefined ? JSON.stringify(corpo) : undefined,
    })
  } catch {
    throw new ErroApi(0, 'Não foi possível conectar ao servidor. Verifique a internet e tente de novo.')
  }

  if (!resposta.ok) throw new ErroApi(resposta.status, mensagemDoErro(resposta.status))
  if (resposta.status === 204) return null
  return resposta.json()
}

export function verificarLogin(credenciais) {
  return chamar('/admin/verificar', { credenciais })
}

export async function listarProdutos() {
  const dados = await chamar('/produtos')
  if (!Array.isArray(dados)) throw new ErroApi(0, 'Resposta inesperada do servidor.')
  return dados
}

export function criarProduto(credenciais, produto) {
  return chamar('/produtos', { metodo: 'POST', credenciais, corpo: produto })
}

export function atualizarProduto(credenciais, id, produto) {
  return chamar(`/produtos/${id}`, { metodo: 'PUT', credenciais, corpo: produto })
}

export function removerProduto(credenciais, id) {
  return chamar(`/produtos/${id}`, { metodo: 'DELETE', credenciais })
}
