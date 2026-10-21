import { HORARIO_ATENDIMENTO, WHATSAPP_NUMERO } from '../constants'

// Para mudar, tirar ou acrescentar uma pergunta, é só editar esta lista.
const PERGUNTAS = [
  {
    pergunta: 'Vocês entregam? Em quais regiões?',
    resposta:
      'Sim, entregamos em Campinas e região. Em Campinas, a entrega é feita em pedidos acima de 1.000 blocos; na região, em pedidos acima de 2.000 blocos.',
  },
  {
    pergunta: 'Quanto custa a entrega?',
    resposta:
      'A entrega é cobrada, e o valor depende da quantidade e da distância. A Cerâmica Friburgo não tem caminhão próprio: o frete é feito por fretistas parceiros, que definem o valor. Consulte pelo WhatsApp.',
  },
  {
    pergunta: 'Qual é o prazo de entrega?',
    resposta: 'De 1 a 3 dias, dependendo do material.',
  },
  {
    pergunta: 'Quantos blocos cabem em um caminhão?',
    resposta:
      'Nossos fretistas parceiros têm caminhões que levam até 6.000 blocos por viagem.',
  },
  {
    pergunta: 'O fretista descarrega o material?',
    resposta:
      'Sim, o fretista descarrega o caminhão no local da entrega. Ele não leva o material para dentro da casa.',
  },
  {
    pergunta: 'Posso retirar o material na fábrica?',
    resposta: `Pode sim. A retirada é feita dentro do horário de funcionamento (${HORARIO_ATENDIMENTO.toLowerCase()}), após uma consulta rápida pelo WhatsApp.`,
  },
  {
    pergunta: 'Existe quantidade mínima por pedido?',
    resposta: 'Atendemos pedidos acima de 100 blocos.',
  },
  {
    pergunta: 'Como funciona o pagamento e a confirmação do pedido?',
    resposta:
      'O pagamento é feito antes da entrega. Somente após o pagamento o pedido é registrado e combinado com o fretista.',
  },
  {
    pergunta: 'Quais são as formas de pagamento?',
    resposta: 'Aceitamos Pix, dinheiro, cartão de crédito e cartão de débito.',
  },
  {
    pergunta: 'Qual é a validade do orçamento?',
    resposta:
      'O orçamento vale por 5 dias. Depois desse prazo, os valores e as condições estão sujeitos a alteração.',
  },
  {
    pergunta: 'Vocês dão condições especiais para grandes quantidades?',
    resposta:
      'As condições para grandes quantidades são combinadas na consulta pelo WhatsApp.',
  },
  {
    pergunta: 'Os produtos são de que material?',
    resposta:
      'Nossos produtos são de cerâmica vermelha, fabricados em fornos industriais e com linha de secagem.',
  },
  {
    pergunta: 'Os produtos têm pronta entrega?',
    resposta: 'A maioria dos nossos materiais está disponível para pronta entrega.',
  },
  {
    pergunta: 'E se alguma peça chegar quebrada?',
    resposta:
      'No carregamento, o fretista é orientado a separar as peças quebradas e fazer a troca na hora.',
  },
]

const LINK_WHATSAPP = `https://wa.me/${WHATSAPP_NUMERO}?text=${encodeURIComponent(
  'Olá! Tenho uma dúvida sobre os produtos da Cerâmica Friburgo.'
)}`

export function Faq() {
  return (
    <section className="faq" id="duvidas">
      <h2>Perguntas frequentes</h2>
      <p className="faq-subtitulo">As dúvidas que mais recebemos de quem vai comprar.</p>

      <div className="faq-lista">
        {PERGUNTAS.map(item => (
          <details className="faq-item" key={item.pergunta}>
            <summary>{item.pergunta}</summary>
            <p>{item.resposta}</p>
          </details>
        ))}
      </div>

      <p className="faq-contato">
        Não encontrou o que procurava?{' '}
        <a href={LINK_WHATSAPP} target="_blank" rel="noreferrer">
          Fale com a gente no WhatsApp
        </a>
      </p>
    </section>
  )
}
