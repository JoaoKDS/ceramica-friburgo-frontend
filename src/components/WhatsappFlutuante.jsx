import { WHATSAPP_NUMERO } from '../constants'
import { Icone } from './Icones'

export function WhatsappFlutuante() {
  return (
    <a
      className="whatsapp-flutuante"
      href={`https://wa.me/${WHATSAPP_NUMERO}?text=${encodeURIComponent('Olá! Vim pelo site e gostaria de fazer um orçamento.')}`}
      target="_blank"
      rel="noreferrer"
      aria-label="Abrir conversa no WhatsApp"
    >
      <span className="whatsapp-icone" aria-hidden="true"><Icone nome="conversa" tamanho="1.5rem" /></span>
      <span className="whatsapp-rotulo">Fale conosco</span>
    </a>
  )
}
