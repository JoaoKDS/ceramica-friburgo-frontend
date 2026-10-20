import { EMOJIS_POR_CATEGORIA } from '../constants'
import { PainelOrcamento } from './PainelOrcamento'
import { CampoQuantidade } from './CampoQuantidade'

export function Catalogo({
  mostrarOrcamento,
  carrinhoProps,
  busca,
  setBusca,
  categorias,
  categoriaSelecionada,
  setCategoriaSelecionada,
  carregando,
  erroCarregamento,
  recarregar,
  produtosFiltrados,
  adicionadoId,
  obterQuantidadeSelecionada,
  definirQuantidadeSelecionada,
  incrementarQuantidadeSelecionada,
  adicionarAoCarrinho,
}) {
  return (
    <main className="container" id="catalogo">
      <h2 className="titulo-secao">Nosso catálogo</h2>
      <p className="catalogo-subtitulo">
        Escolha os itens e as quantidades e peça seu orçamento pelo WhatsApp.
      </p>

      {mostrarOrcamento && <PainelOrcamento {...carrinhoProps} />}

      <div className="busca">
        <label htmlFor="busca-produto" className="sr-only">
          Buscar produto
        </label>
        <input
          type="search"
          id="busca-produto"
          name="busca"
          autoComplete="off"
          placeholder="🔍 Buscar produto... (ex: caixote, lajota, 14x19x29)"
          value={busca}
          onChange={e => setBusca(e.target.value)}
        />
      </div>

      <div className="filtros">
        {categorias.map(categoria => (
          <button
            type="button"
            key={categoria}
            className={categoria === categoriaSelecionada ? 'filtro ativo' : 'filtro'}
            onClick={() => setCategoriaSelecionada(categoria)}
          >
            {categoria}
          </button>
        ))}
      </div>

      {carregando && <p className="vazio">Carregando produtos...</p>}

      {!carregando && erroCarregamento && (
        <div className="vazio erro-carregamento">
          <p>{erroCarregamento}</p>
          <button type="button" className="btn-tentar-novamente" onClick={recarregar}>
            🔄 Tentar novamente
          </button>
        </div>
      )}

      {!carregando && !erroCarregamento && produtosFiltrados.length === 0 && (
        <p className="vazio">Nenhum produto encontrado. 😕</p>
      )}

      <div className="grid">
        {produtosFiltrados.map(produto => {
          const acabouDeAdicionar = adicionadoId === produto.id

          return (
            <div className="card" key={produto.id}>
              <div className="foto">
                {EMOJIS_POR_CATEGORIA[produto.categoria] || '🏗️'}
              </div>
              <span className="badge">{produto.categoria}</span>
              <h3>{produto.nome}</h3>
              <p className="dimensoes">{produto.dimensoes}</p>
              <p className="descricao">{produto.descricao}</p>
              <div className="card-acoes">
                <div className="seletor-quantidade">
                  <button
                    type="button"
                    onClick={() => incrementarQuantidadeSelecionada(produto.id, -1)}
                    aria-label={`Diminuir quantidade de ${produto.nome}`}
                  >
                    −
                  </button>
                  <CampoQuantidade
                    id={`qtd-produto-${produto.id}`}
                    valor={obterQuantidadeSelecionada(produto.id)}
                    onChange={quantidade => definirQuantidadeSelecionada(produto.id, quantidade)}
                    ariaLabel={`Quantidade de ${produto.nome} a adicionar`}
                  />
                  <button
                    type="button"
                    onClick={() => incrementarQuantidadeSelecionada(produto.id, 1)}
                    aria-label={`Aumentar quantidade de ${produto.nome}`}
                  >
                    +
                  </button>
                </div>
                <button
                  type="button"
                  className={acabouDeAdicionar ? 'btn-adicionar adicionado' : 'btn-adicionar'}
                  onClick={() => adicionarAoCarrinho(produto)}
                  aria-live="polite"
                >
                  {acabouDeAdicionar ? '✓ Adicionado!' : '➕ Adicionar ao orçamento'}
                </button>
              </div>
            </div>
          )
        })}
      </div>
    </main>
  )
}
