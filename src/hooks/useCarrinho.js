import { useEffect, useRef, useState } from 'react'
import { CHAVE_CARRINHO } from '../constants'

// Lê o orçamento salvo no navegador e só aceita o que tiver o formato esperado.
// Se o dado estiver corrompido (ou for de uma versão antiga do site), ele é
// ignorado e o orçamento começa vazio, em vez de deixar o site em branco.
function lerOrcamentoSalvo() {
  try {
    const salvo = localStorage.getItem(CHAVE_CARRINHO)
    if (!salvo) return []

    const dados = JSON.parse(salvo)
    if (!Array.isArray(dados)) return []

    return dados
      .filter(
        item =>
          item &&
          item.id !== undefined &&
          typeof item.nome === 'string' &&
          Number.isInteger(Number(item.quantidade)) &&
          Number(item.quantidade) >= 1
      )
      .map(item => ({ ...item, quantidade: Number(item.quantidade) }))
  } catch (erro) {
    // Situação recuperável: o orçamento começa vazio e o site segue normal.
    console.warn('Orçamento salvo ignorado (formato inválido):', erro)
    return []
  }
}

// Esse hook cuida de tudo relacionado ao carrinho de orçamento:
// adicionar, remover, alterar quantidade, e salvar/carregar do navegador
// (localStorage), pra não perder o orçamento se a página for atualizada.
//
// Regra importante: a quantidade de cada item é SEMPRE um número inteiro >= 1.
// O texto que a pessoa está digitando no campo fica guardado no próprio campo
// (veja CampoQuantidade), e só vira quantidade quando for um número válido.
export function useCarrinho() {
  // A função dentro do useState roda uma única vez, na abertura do site,
  // e já devolve o orçamento salvo. Por isso não existe mais aquela "corrida"
  // entre carregar e salvar.
  const [carrinho, setCarrinho] = useState(lerOrcamentoSalvo)
  const [quantidadesSelecionadas, setQuantidadesSelecionadas] = useState({})

  // Id do produto que acabou de ser adicionado (usado para mostrar "✓ Adicionado!")
  const [adicionadoId, setAdicionadoId] = useState(null)
  const timerAdicionado = useRef(null)

  // Limpa o temporizador se o site for fechado no meio da contagem
  useEffect(() => () => clearTimeout(timerAdicionado.current), [])

  // Toda vez que o carrinho mudar, salva a versão mais recente
  useEffect(() => {
    try {
      localStorage.setItem(CHAVE_CARRINHO, JSON.stringify(carrinho))
    } catch (erro) {
      console.error('Não foi possível salvar o orçamento:', erro)
    }
  }, [carrinho])

  // Quantidade escolhida no seletor de cada card (padrão: 1)
  function obterQuantidadeSelecionada(produtoId) {
    return quantidadesSelecionadas[produtoId] ?? 1
  }

  function definirQuantidadeSelecionada(produtoId, quantidade) {
    const valor = Math.max(1, Math.floor(Number(quantidade)) || 1)
    setQuantidadesSelecionadas(atual => ({ ...atual, [produtoId]: valor }))
  }

  function incrementarQuantidadeSelecionada(produtoId, delta) {
    setQuantidadesSelecionadas(atual => ({
      ...atual,
      [produtoId]: Math.max(1, (atual[produtoId] ?? 1) + delta),
    }))
  }

  // quantidadeFixa é opcional: a calculadora de m² usa para adicionar a
  // quantidade calculada em vez da que está no seletor do card.
  function adicionarAoCarrinho(produto, quantidadeFixa) {
    const quantidade = Number.isInteger(quantidadeFixa) && quantidadeFixa >= 1
      ? quantidadeFixa
      : obterQuantidadeSelecionada(produto.id)

    setCarrinho(atual => {
      const jaEstaNoCarrinho = atual.some(item => item.id === produto.id)
      if (jaEstaNoCarrinho) {
        return atual.map(item =>
          item.id === produto.id
            ? { ...item, quantidade: item.quantidade + quantidade }
            : item
        )
      }
      return [...atual, { ...produto, quantidade }]
    })

    // volta o seletor do card para 1 depois de adicionar
    setQuantidadesSelecionadas(atual => ({ ...atual, [produto.id]: 1 }))

    // mostra "✓ Adicionado!" no botão por um instante
    setAdicionadoId(produto.id)
    clearTimeout(timerAdicionado.current)
    timerAdicionado.current = setTimeout(() => setAdicionadoId(null), 1800)
  }

  // Botões + e − do orçamento. Chegando a zero, o item sai do orçamento.
  function alterarQuantidade(id, delta) {
    setCarrinho(atual =>
      atual
        .map(item =>
          item.id === id ? { ...item, quantidade: item.quantidade + delta } : item
        )
        .filter(item => item.quantidade > 0)
    )
  }

  // Digitar a quantidade direto no orçamento (útil para pedidos grandes).
  // Só recebe números válidos (>= 1); o campo já cuida do resto.
  function definirQuantidadeNoCarrinho(id, quantidade) {
    const valor = Math.max(1, Math.floor(Number(quantidade)) || 1)
    setCarrinho(atual =>
      atual.map(item => (item.id === id ? { ...item, quantidade: valor } : item))
    )
  }

  function removerDoCarrinho(id) {
    setCarrinho(atual => atual.filter(item => item.id !== id))
  }

  const totalItens = carrinho.reduce((soma, item) => soma + item.quantidade, 0)
  const temGrandeQuantidade = carrinho.some(item => item.quantidade >= 1000)

  return {
    carrinho,
    totalItens,
    temGrandeQuantidade,
    adicionadoId,
    obterQuantidadeSelecionada,
    definirQuantidadeSelecionada,
    incrementarQuantidadeSelecionada,
    adicionarAoCarrinho,
    alterarQuantidade,
    definirQuantidadeNoCarrinho,
    removerDoCarrinho,
  }
}
