import {
  ENTREGA_CAMPINAS_PECAS,
  ENTREGA_REGIAO_PECAS,
  HORARIO_ATENDIMENTO,
  PEDIDO_MINIMO_PECAS,
} from '../constants'
import { CampoQuantidade } from './CampoQuantidade'

const numero = n => n.toLocaleString('pt-BR')

// Aviso informativo conforme o tamanho do pedido (não bloqueia o envio).
function avisoDoPedido(total) {
  if (total <= PEDIDO_MINIMO_PECAS) {
    return {
      tipo: 'atencao',
      texto: `O pedido mínimo é acima de ${numero(PEDIDO_MINIMO_PECAS)} peças e seu orçamento tem ${numero(total)}. Ajuste as quantidades ou fale com a gente pelo WhatsApp.`,
    }
  }
  if (total <= ENTREGA_CAMPINAS_PECAS) {
    return {
      tipo: 'info',
      texto: `Entregamos em Campinas em pedidos acima de ${numero(ENTREGA_CAMPINAS_PECAS)} peças e na região acima de ${numero(ENTREGA_REGIAO_PECAS)}. Com a quantidade atual, a retirada é na fábrica (${HORARIO_ATENDIMENTO.toLowerCase()}).`,
    }
  }
  if (total <= ENTREGA_REGIAO_PECAS) {
    return {
      tipo: 'ok',
      texto: `Seu pedido tem quantidade para entrega em Campinas. Para a região, a entrega é em pedidos acima de ${numero(ENTREGA_REGIAO_PECAS)} peças. O frete é combinado pelo WhatsApp.`,
    }
  }
  return {
    tipo: 'ok',
    texto: 'Seu pedido tem quantidade para entrega em Campinas e região. O frete é combinado pelo WhatsApp.',
  }
}

export function PainelOrcamento({
  carrinho,
  temGrandeQuantidade,
  totalPecas,
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
  const aviso = carrinho.length > 0 ? avisoDoPedido(totalPecas) : null

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

          {aviso && (
            <p className={`aviso-pedido aviso-pedido-${aviso.tipo}`} role="status">
              {aviso.texto}
            </p>
          )}

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
                placeholder='Endereço de entrega (ou "retirada na fábrica") *'
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
