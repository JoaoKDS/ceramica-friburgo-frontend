export function ParaSuaObra({ escolherPorObra }) {
  return (
    <section className="obras">
      <h2>Para sua obra</h2>
      <p className="obras-subtitulo">Escolha o tipo de construção e veja os produtos indicados</p>
      <div className="obras-grid">
        <button className="obra-card" onClick={() => escolherPorObra('Blocos Cerâmicos')}>
          <span>🏠</span>
          <h3>Casas e Sobrados</h3>
          <p>Blocos de vedação para alvenaria de casas térreas e sobrados</p>
          <em>Ver blocos →</em>
        </button>
        <button className="obra-card" onClick={() => escolherPorObra('Blocos Estruturais')}>
          <span>🏢</span>
          <h3>Alvenaria Estrutural</h3>
          <p>Blocos estruturais de alta resistência que sustentam a construção</p>
          <em>Ver estruturais →</em>
        </button>
        <button className="obra-card" onClick={() => escolherPorObra('Lajotas')}>
          <span>🏗️</span>
          <h3>Forros e Pisos</h3>
          <p>Lajotas cerâmicas para forros e pisos da sua obra</p>
          <em>Ver lajotas →</em>
        </button>
      </div>
    </section>
  )
}
