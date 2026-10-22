import { useId, useState } from 'react'
import { AREA_MAXIMA_M2, CALCULADORA_BLOCOS } from '../constants'
import { normalizar } from '../utils/busca'
import { Icone } from './Icones'

// Calculadora de quantidade de blocos por m² de parede.
// Só aparece se o catálogo tiver pelo menos um dos blocos da tabela
// (CALCULADORA_BLOCOS em constants.js). O resultado é sempre uma estimativa.
export function CalculadoraM2({ produtos = [], adicionarAoCarrinho }) {
  const id = useId()
  const [aberta, setAberta] = useState(false)
  const [area, setArea] = useState('')
  const [produtoId, setProdutoId] = useState('')
  const [assentamento, setAssentamento] = useState('emPe')
  const [adicionado, setAdicionado] = useState(false)

  // Produtos do catálogo que têm medida na tabela
  const opcoes = produtos
    .map(produto => {
      const nome = normalizar(produto.nome)
      const linha = CALCULADORA_BLOCOS.find(item => nome.includes(item.chave))
      return linha ? { produto, linha } : null
    })
    .filter(Boolean)

  if (opcoes.length === 0) return null

  const escolhida = opcoes.find(o => String(o.produto.id) === produtoId) ?? opcoes[0]
  const areaNumero = Number(area.replace(',', '.'))
  const areaValida = Number.isFinite(areaNumero) && areaNumero > 0 && areaNumero <= AREA_MAXIMA_M2
  const pecasPorM2 = escolhida.linha[assentamento]
  const quantidade = areaValida ? Math.ceil(areaNumero * pecasPorM2) : 0

  function adicionar() {
    adicionarAoCarrinho(escolhida.produto, quantidade)
    setAdicionado(true)
    setTimeout(() => setAdicionado(false), 1800)
  }

  return (
    <section className="calculadora" aria-label="Calculadora de quantidade por metro quadrado">
      <button
        type="button"
        className="btn-calculadora"
        onClick={() => setAberta(!aberta)}
        aria-expanded={aberta}
        aria-controls={`${id}-painel`}
      >
        <Icone nome="calculadora" /> Calcular quantidade por m²
      </button>

      {aberta && (
        <div className="calculadora-painel" id={`${id}-painel`}>
          <p className="calculadora-ajuda">
            Informe a área da parede (já descontando portas e janelas) e veja uma estimativa de
            quantos blocos você vai precisar.
          </p>

          <div className="calculadora-campos">
            <div className="calculadora-campo">
              <label htmlFor={`${id}-area`}>Área da parede (m²)</label>
              <input
                id={`${id}-area`}
                type="text"
                inputMode="decimal"
                autoComplete="off"
                placeholder="ex: 45"
                value={area}
                onChange={e => {
                  setArea(e.target.value)
                  setAdicionado(false)
                }}
              />
            </div>

            <div className="calculadora-campo">
              <label htmlFor={`${id}-bloco`}>Tipo de bloco</label>
              <select
                id={`${id}-bloco`}
                value={String(escolhida.produto.id)}
                onChange={e => setProdutoId(e.target.value)}
              >
                {opcoes.map(({ produto }) => (
                  <option key={produto.id} value={String(produto.id)}>
                    {produto.nome}
                  </option>
                ))}
              </select>
            </div>

            <fieldset className="calculadora-campo calculadora-assentamento">
              <legend>Como o bloco é assentado</legend>
              <label>
                <input
                  type="radio"
                  name={`${id}-assentamento`}
                  checked={assentamento === 'emPe'}
                  onChange={() => setAssentamento('emPe')}
                />{' '}
                Em pé
              </label>
              <label>
                <input
                  type="radio"
                  name={`${id}-assentamento`}
                  checked={assentamento === 'deitado'}
                  onChange={() => setAssentamento('deitado')}
                />{' '}
                Deitado
              </label>
            </fieldset>
          </div>

          {area.trim() !== '' && !areaValida && (
            <p className="calculadora-erro" role="alert">
              Digite uma área válida em m² (maior que zero).
            </p>
          )}

          {areaValida && (
            <div className="calculadora-resultado" aria-live="polite">
              <p>
                Estimativa: <strong>cerca de {quantidade.toLocaleString('pt-BR')} peças</strong>
                <span> ({pecasPorM2} peças por m²)</span>
              </p>
              <p className="calculadora-aviso">
                Valor aproximado, sem margem de perda. Confirmamos a quantidade certa no
                atendimento.
              </p>
              <button type="button" className="btn-adicionar" onClick={adicionar}>
                {adicionado ? '✓ Adicionado!' : 'Adicionar ao orçamento'}
              </button>
            </div>
          )}
        </div>
      )}
    </section>
  )
}
