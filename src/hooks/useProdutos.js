import { useEffect, useMemo, useState } from 'react'
import { API_URL } from '../constants'

// Esse hook cuida de tudo relacionado a buscar os produtos no back-end:
// o carregamento, os erros, a lista de categorias e a "nova tentativa".
export function useProdutos() {
  const [produtos, setProdutos] = useState([])
  const [carregando, setCarregando] = useState(true)
  const [erroCarregamento, setErroCarregamento] = useState(null)

  // Cada vez que esse número aumenta, a busca roda de novo
  const [tentativa, setTentativa] = useState(0)

  useEffect(() => {
    // Se o efeito for refeito antes da resposta chegar, a resposta antiga é ignorada
    let cancelado = false

    setCarregando(true)
    setErroCarregamento(null)

    fetch(`${API_URL}/produtos`)
      .then(resposta => {
        if (!resposta.ok) {
          throw new Error(`Erro ${resposta.status} ao buscar produtos`)
        }
        return resposta.json()
      })
      .then(dados => {
        // Garante que veio uma lista de verdade, para o resto do site não quebrar
        if (!Array.isArray(dados)) {
          throw new Error('Resposta inesperada do servidor')
        }
        if (!cancelado) setProdutos(dados)
      })
      .catch(() => {
        if (!cancelado) {
          setErroCarregamento(
            'Não foi possível carregar o catálogo agora. Verifique sua conexão e tente novamente.'
          )
        }
      })
      .finally(() => {
        if (!cancelado) setCarregando(false)
      })

    return () => {
      cancelado = true
    }
  }, [tentativa])

  function recarregar() {
    setTentativa(n => n + 1)
  }

  // useMemo evita recalcular a lista de categorias a cada renderização
  const categorias = useMemo(
    () => ['Todos', ...new Set(produtos.map(p => p.categoria))],
    [produtos]
  )

  return { produtos, carregando, erroCarregamento, categorias, recarregar }
}
