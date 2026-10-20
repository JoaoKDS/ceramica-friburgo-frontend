import { WHATSAPP_NUMERO } from '../constants'

// Dados de contato num lugar só: para mudar telefone, e-mail, horário ou
// endereço, é só editar aqui em cima.
const TELEFONE_FIXO = '(19) 3266-0508'
const TELEFONE_FIXO_LINK = 'tel:+551932660508'
const TELEFONE_WHATSAPP = '(19) 99336-9208'
const EMAIL = 'olariafriburgo@gmail.com'
const HORARIO = 'Segunda a sexta, das 7h às 16h'
const ENDERECO = 'Res. São José, Campinas - SP'
const CODIGO_DO_LOCAL = '2RJC+P7' // "Plus Code" do Google Maps

const BUSCA_NO_MAPA = encodeURIComponent(`${CODIGO_DO_LOCAL} Campinas, SP`)
const MAPA_INCORPORADO = `https://www.google.com/maps?q=${BUSCA_NO_MAPA}&output=embed`
const MAPA_LINK = `https://www.google.com/maps/search/?api=1&query=${BUSCA_NO_MAPA}`

export function Footer() {
  return (
    <footer id="contato">
      <div className="rodape-conteudo">
        <div>
          <img src="/logo.png" alt="Logotipo Cerâmica Friburgo" className="rodape-logo" />
          <p>Blocos, lajotas e canaletas cerâmicas para construção civil.</p>
        </div>

        <div>
          <h4>Contato</h4>
          <p>
            📞 <a href={TELEFONE_FIXO_LINK}>{TELEFONE_FIXO}</a>
          </p>
          <p>
            💬{' '}
            <a href={`https://wa.me/${WHATSAPP_NUMERO}`} target="_blank" rel="noreferrer">
              {TELEFONE_WHATSAPP} (WhatsApp)
            </a>
          </p>
          <p>
            ✉️ <a href={`mailto:${EMAIL}`}>{EMAIL}</a>
          </p>
        </div>

        <div>
          <h4>Atendimento</h4>
          <p>🕖 {HORARIO}</p>
          <p>🚚 Entrega na região — consulte</p>
        </div>

        <div>
          <h4>Onde estamos</h4>
          <p>📍 {ENDERECO}</p>
          <a className="btn-mapa" href={MAPA_LINK} target="_blank" rel="noreferrer">
            Abrir no Google Maps
          </a>
        </div>
      </div>

      <div className="rodape-mapa">
        <iframe
          title="Mapa com a localização da Cerâmica Friburgo"
          src={MAPA_INCORPORADO}
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          allowFullScreen
        />
      </div>

      <p className="copyright">© 2026 Cerâmica Friburgo. Todos os direitos reservados.</p>
    </footer>
  )
}
