import { useEffect, useState } from 'react'
import { ANOS_NO_MERCADO } from '../constants'
import { Icone } from './Icones'

function Contador({ valor }) {
  const [numero, setNumero] = useState(0)

  useEffect(() => {
    let atual = 0
    const passo = Math.max(1, Math.ceil(valor / 40))
    const timer = setInterval(() => {
      atual += passo
      if (atual >= valor) {
        atual = valor
        clearInterval(timer)
      }
      setNumero(atual)
    }, 40)
    return () => clearInterval(timer)
  }, [valor])

  return <strong>+{numero}</strong>
}

const MOTIVOS = [
  { icone: 'bloco', texto: 'Qualidade comprovada no mercado' },
  { icone: 'preco', texto: 'Preço justo, direto da fábrica' },
  { icone: 'caminhao', texto: 'Entrega na região de Campinas' },
  { icone: 'celular', texto: 'Orçamento em 1 minuto, sem cadastro' },
]

// totalProdutos e totalCategorias vêm do catálogo de verdade (App.jsx).
// Se o catálogo ainda não carregou (ou o back-end estiver fora do ar),
// esses dois números ficam escondidos em vez de mostrar "+0".
export function PorQueEscolher({ totalProdutos = 0, totalCategorias = 0 }) {
  return (
    <section className="porque">
      <h2>Por que escolher a Cerâmica Friburgo?</h2>
      <div className="porque-stats">
        <div className="stat">
          <Contador valor={ANOS_NO_MERCADO} />
          <span>anos de mercado</span>
        </div>
        {totalProdutos > 0 && (
          <div className="stat">
            <Contador valor={totalProdutos} />
            <span>produtos no catálogo</span>
          </div>
        )}
        {totalCategorias > 0 && (
          <div className="stat">
            <Contador valor={totalCategorias} />
            <span>categorias completas</span>
          </div>
        )}
      </div>
      <div className="porque-motivos">
        {MOTIVOS.map(motivo => (
          <div className="motivo" key={motivo.texto}>
            <span className="motivo-icone" aria-hidden="true"><Icone nome={motivo.icone} /></span>
            <span>{motivo.texto}</span>
          </div>
        ))}
      </div>
    </section>
  )
}
