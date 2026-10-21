import { useEffect, useMemo, useState } from 'react'
import { produtoCombinaComBusca } from '../utils/busca'
import {
  atualizarProduto,
  criarProduto,
  listarProdutos,
  removerProduto,
} from './apiAdmin'
import { FormularioProduto } from './FormularioProduto'

export function PainelAdmin({ credenciais, aoSessaoExpirar }) {
  const [produtos, setProdutos] = useState([])
  const [carregando, setCarregando] = useState(true)
  const [erroLista, setErroLista] = useState('')
  const [tentativa, setTentativa] = useState(0)
  const [busca, setBusca] = useState('')
  // null = mostrando a lista | { produto: null } = novo | { produto } = editando
  const [formulario, setFormulario] = useState(null)
  const [removendoId, setRemovendoId] = useState(null)
  const [aviso, setAviso] = useState('')
  const [erroAcao, setErroAcao] = useState('')

  useEffect(() => {
    let cancelado = false
    setCarregando(true)
    setErroLista('')

    listarProdutos()
      .then(dados => {
        if (!cancelado) setProdutos(dados)
      })
      .catch(e => {
        if (!cancelado) setErroLista(e.message)
      })
      .finally(() => {
        if (!cancelado) setCarregando(false)
      })

    return () => {
      cancelado = true
    }
  }, [tentativa])

  const categorias = useMemo(
    () => [...new Set(produtos.map(p => p.categoria))].sort(),
    [produtos]
  )

  const produtosVisiveis = produtos.filter(p => produtoCombinaComBusca(p, busca))

  function recarregar() {
    setTentativa(n => n + 1)
  }

  async function salvar(dados) {
    const editando = formulario?.produto
    try {
      if (editando) await atualizarProduto(credenciais, editando.id, dados)
      else await criarProduto(credenciais, dados)
    } catch (e) {
      if (e.status === 401) {
        aoSessaoExpirar()
        return
      }
      throw e // o formulário mostra a mensagem
    }
    setAviso(editando ? 'Produto atualizado!' : 'Produto adicionado!')
    setErroAcao('')
    setFormulario(null)
    recarregar()
  }

  async function remover(produto) {
    try {
      await removerProduto(credenciais, produto.id)
    } catch (e) {
      if (e.status === 401) {
        aoSessaoExpirar()
        return
      }
      setErroAcao(e.message)
      setRemovendoId(null)
      return
    }
    setRemovendoId(null)
    setErroAcao('')
    setAviso(`"${produto.nome}" foi removido.`)
    recarregar()
  }

  function abrirFormulario(produto) {
    setAviso('')
    setErroAcao('')
    setRemovendoId(null)
    setFormulario({ produto })
  }

  if (formulario) {
    return (
      <FormularioProduto
        key={formulario.produto?.id ?? 'novo'}
        produto={formulario.produto}
        categorias={categorias}
        aoSalvar={salvar}
        aoCancelar={() => setFormulario(null)}
      />
    )
  }

  return (
    <section>
      <div className="adm-titulo-linha">
        <h1>Produtos ({produtos.length})</h1>
        <button type="button" className="adm-btn adm-btn-principal" onClick={() => abrirFormulario(null)}>
          ➕ Novo produto
        </button>
      </div>

      {aviso && <p className="adm-aviso adm-aviso-ok" role="status">{aviso}</p>}
      {erroAcao && <p className="adm-aviso adm-aviso-erro" role="alert">{erroAcao}</p>}

      <label htmlFor="adm-busca" className="sr-only">Buscar produto</label>
      <input
        id="adm-busca"
        type="search"
        className="adm-busca"
        placeholder="🔍 Buscar produto..."
        value={busca}
        onChange={e => setBusca(e.target.value)}
      />

      {carregando && <p className="adm-vazio">Carregando produtos...</p>}

      {!carregando && erroLista && (
        <div className="adm-vazio">
          <p className="adm-aviso adm-aviso-erro">{erroLista}</p>
          <button type="button" className="adm-btn adm-btn-claro" onClick={recarregar}>
            🔄 Tentar novamente
          </button>
        </div>
      )}

      {!carregando && !erroLista && produtosVisiveis.length === 0 && (
        <p className="adm-vazio">
          {produtos.length === 0
            ? 'Nenhum produto cadastrado ainda. Clique em "Novo produto".'
            : 'Nenhum produto encontrado para essa busca.'}
        </p>
      )}

      <ul className="adm-lista">
        {produtosVisiveis.map(produto => (
          <li className="adm-item" key={produto.id}>
            <div className="adm-item-info">
              <strong>{produto.nome}</strong>
              <span>
                {produto.categoria} · {produto.dimensoes}
              </span>
              {produto.foto && <span className="adm-item-foto">📷 {produto.foto}</span>}
            </div>

            {removendoId === produto.id ? (
              <div className="adm-item-acoes" role="group" aria-label={`Confirmar remoção de ${produto.nome}`}>
                <span className="adm-confirma">Remover este produto?</span>
                <button type="button" className="adm-btn adm-btn-perigo" onClick={() => remover(produto)}>
                  Sim, remover
                </button>
                <button type="button" className="adm-btn adm-btn-claro" onClick={() => setRemovendoId(null)}>
                  Cancelar
                </button>
              </div>
            ) : (
              <div className="adm-item-acoes">
                <button
                  type="button"
                  className="adm-btn adm-btn-claro"
                  onClick={() => abrirFormulario(produto)}
                  aria-label={`Editar ${produto.nome}`}
                >
                  ✏️ Editar
                </button>
                <button
                  type="button"
                  className="adm-btn adm-btn-claro"
                  onClick={() => {
                    setAviso('')
                    setErroAcao('')
                    setRemovendoId(produto.id)
                  }}
                  aria-label={`Remover ${produto.nome}`}
                >
                  🗑️ Remover
                </button>
              </div>
            )}
          </li>
        ))}
      </ul>
    </section>
  )
}
