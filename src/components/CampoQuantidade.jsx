import { useState } from 'react'

// Campo para digitar uma quantidade (ex: 5000).
//
// Enquanto a pessoa digita, o texto fica guardado AQUI dentro. Só quando for um
// número válido (1 ou mais) ele é enviado para fora, pelo onChange. Se ela
// apagar tudo, ou digitar 0, o campo volta para o último valor válido ao sair.
// Assim a quantidade do orçamento nunca fica vazia nem "estranha".
export function CampoQuantidade({ valor, onChange, id, ariaLabel, className }) {
  const [texto, setTexto] = useState(String(valor))
  const [valorAnterior, setValorAnterior] = useState(valor)

  // Quando o valor muda por fora (botões + e −), o campo acompanha.
  // (É o jeito que a documentação do React recomenda para esse caso.)
  if (valor !== valorAnterior) {
    setValorAnterior(valor)
    setTexto(String(valor))
  }

  function aoDigitar(evento) {
    // aceita só dígitos
    const soDigitos = evento.target.value.replace(/\D/g, '')
    setTexto(soDigitos)

    const numero = parseInt(soDigitos, 10)
    if (numero >= 1) onChange(numero)
  }

  function aoSair() {
    // campo vazio ou zero: volta para o último valor válido
    setTexto(String(valor))
  }

  return (
    <input
      type="text"
      inputMode="numeric"
      pattern="[0-9]*"
      maxLength={7}
      autoComplete="off"
      id={id}
      name={id}
      className={className}
      value={texto}
      onChange={aoDigitar}
      onBlur={aoSair}
      onFocus={evento => evento.target.select()}
      aria-label={ariaLabel}
    />
  )
}
