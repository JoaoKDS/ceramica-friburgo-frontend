import { ANOS_NO_MERCADO } from '../constants'

export function Banner() {
  return (
    <section className="banner">
      <img src="/logo.png" alt="Logo Cerâmica Friburgo" className="banner-logo" />
      <h1>Materiais cerâmicos de qualidade para a sua obra</h1>
      <p>
        Há mais de {ANOS_NO_MERCADO} anos fornecendo blocos, lajotas e canaletas
        com o melhor preço da região. Faça seu orçamento em 1 minuto pelo WhatsApp.
      </p>
      <a href="#catalogo" className="btn-banner">Ver catálogo 🧱</a>
    </section>
  )
}
