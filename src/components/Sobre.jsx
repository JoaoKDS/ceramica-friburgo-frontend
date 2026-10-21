import { useEffect, useState } from 'react'
import { ANOS_NO_MERCADO, FOTOS } from '../constants'

export function Sobre() {
  const [fotoAtual, setFotoAtual] = useState(0)

  // Carrossel de fotos: troca sozinho a cada 4 segundos
  useEffect(() => {
    const timer = setInterval(() => {
      setFotoAtual(atual => (atual + 1) % FOTOS.length)
    }, 4000)
    return () => clearInterval(timer)
  }, [])

  return (
    <section className="sobre" id="sobre">
      <div className="sobre-conteudo">
        <div className="sobre-texto">
          <h2>Quem somos</h2>
          <p>
            A <strong>Cerâmica Friburgo</strong> é uma empresa familiar de Campinas/SP
            que há <strong>mais de {ANOS_NO_MERCADO} anos</strong> fabrica produtos
            cerâmicos de qualidade para a construção civil.
          </p>
          <p>
            Nossos blocos, lajotas e canaletas saem direto do forno para a sua obra —
            sem intermediários, com preço justo e entrega na região.
          </p>
          <ul className="sobre-lista">
            <li>Cerâmica vermelha de qualidade, produzida em fornos industriais</li>
            <li>Atendimento direto com quem entende do assunto</li>
            <li>Orçamento rápido pelo WhatsApp</li>
            <li>Grandes quantidades com condições especiais</li>
          </ul>
        </div>
        <div className="sobre-card sobre-fotos">
          <img
            src={FOTOS[fotoAtual]}
            alt={`Foto ${fotoAtual + 1} das instalações da Cerâmica Friburgo`}
            className="foto-empresa"
          />
          <div className="foto-dots">
            {FOTOS.map((foto, i) => (
              <button
                key={foto}
                aria-label={`Ver foto ${i + 1} de ${FOTOS.length}`}
                className={i === fotoAtual ? 'dot ativo' : 'dot'}
                onClick={() => setFotoAtual(i)}
              />
            ))}
          </div>
          <p className="sobre-card-frase">
            "Tradição e qualidade que constroem confiança."
          </p>
        </div>
      </div>
    </section>
  )
}
