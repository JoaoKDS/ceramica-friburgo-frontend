import { CampoQuantidade } from './CampoQuantidade'

export function PainelOrcamento({
  carrinho,
  temGrandeQuantidade,
  alterarQuantidade,
  definirQuantidadeNoCarrinho,
  removerDoCarrinho,
  nome,
  setNome,
  endereco,
  setEndereco,
  observacoes,
  setObservacoes,
  errosFormulario,
  enviarOrcamentoWhatsApp,
  onFechar,
}) {
  return (
    <section
      className={
        carrinho.length === 0 ? 'painel-orcamento painel-orcamento-vazio' : 'painel-orcamento'
      }
      id="painel-orcamento"
    >
      <div className="painel-topo">
        <h2>📋 Seu Orçamento</h2>
        <button
          type="button"
          className="btn-fechar-painel"
          onClick={onFechar}
          aria-label="Fechar orçamento"
        >
          ✕ Fechar
        </button>
      </div>

      {carrinho.length > 0 && (
        <p className="aviso-salvamento">
          💾 Seu orçamento é salvo automaticamente neste navegador — pode
          fechar e voltar depois que ele continua aqui.
        </p>
      )}

      {carrinho.length === 0 ? (
        <p className="vazio">Seu orçamento está vazio. Adicione produtos abaixo! 👇</p>
      ) : (
        <>
          {carrinho.map(item => (
            <div className="item-orcamento" key={item.id}>
              <div className="item-info">
                <strong>{item.nome}</strong>
                <span>{item.dimensoes}</span>
              </div>
              <div className="item-controles">
                <button
                  type="button"
                  onClick={() => alterarQuantidade(item.id, -1)}
                  aria-label={`Diminuir quantidade de ${item.nome}`}
                >
                  −
                </button>
                <CampoQuantidade
                  id={`qtd-orcamento-${item.id}`}
                  className="input-quantidade-carrinho"
                  valor={item.quantidade}
                  onChange={quantidade => definirQuantidadeNoCarrinho(item.id, quantidade)}
                  ariaLabel={`Quantidade de ${item.nome}`}
                />
                <button
                  type="button"
                  onClick={() => alterarQuantidade(item.id, 1)}
                  aria-label={`Aumentar quantidade de ${item.nome}`}
                >
                  +
                </button>
              </div>
              <button
                type="button"
                className="btn-remover"
                onClick={() => removerDoCarrinho(item.id)}
                aria-label={`Remover ${item.nome} do orçamento`}
              >
                🗑️
              </button>
            </div>
          ))}

          {temGrandeQuantidade && (
            <p className="aviso-milheiro">
              ⚠️ Você tem itens acima de 1.000 peças — grandes quantidades
              podem ter condições especiais!
            </p>
          )}

          <div className="formulario">
            <div className="campo-formulario">
              <label htmlFor="orcamento-nome" className="sr-only">
                Seu nome
              </label>
              <input
                type="text"
                id="orcamento-nome"
                name="nome"
                autoComplete="name"
                autoCapitalize="words"
                placeholder="Seu nome *"
                value={nome}
                onChange={e => setNome(e.target.value)}
                aria-invalid={Boolean(errosFormulario.nome)}
              />
              {errosFormulario.nome && (
                <span className="erro-campo">{errosFormulario.nome}</span>
              )}
            </div>

            <div className="campo-formulario">
              <label htmlFor="orcamento-endereco" className="sr-only">
                Endereço de entrega
              </label>
              <input
                type="text"
                id="orcamento-endereco"
                name="endereco"
                autoComplete="street-address"
                placeholder="Endereço de entrega *"
                value={endereco}
                onChange={e => setEndereco(e.target.value)}
                aria-invalid={Boolean(errosFormulario.endereco)}
              />
              {errosFormulario.endereco && (
                <span className="erro-campo">{errosFormulario.endereco}</span>
              )}
            </div>

            <label htmlFor="orcamento-observacoes" className="sr-only">
              Observações
            </label>
            <textarea
              id="orcamento-observacoes"
              name="observacoes"
              autoComplete="off"
              placeholder="Observações (opcional)"
              rows={3}
              value={observacoes}
              onChange={e => setObservacoes(e.target.value)}
            />

            <button type="button" className="btn-whatsapp" onClick={enviarOrcamentoWhatsApp}>
              📲 Enviar orçamento pelo WhatsApp
            </button>
          </div>
        </>
      )}
    </section>
  )
}
