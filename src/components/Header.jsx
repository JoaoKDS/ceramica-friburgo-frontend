export function Header({ totalItens, abrirOrcamento, menuAberto, setMenuAberto }) {
  return (
    <header className="topo">
      <div className="topo-conteudo">
        <a href="#" className="logo">
          <img src="/logo.png" alt="Logotipo Cerâmica Friburgo" className="logo-img" />
          <span>Cerâmica Friburgo</span>
        </a>

        <div className="topo-direita">
          <button
            type="button"
            className="btn-badge-topo"
            onClick={abrirOrcamento}
            aria-label={`Ver orçamento, ${totalItens} itens`}
          >
            📋 Orçamento ({totalItens})
          </button>

          <button
            type="button"
            className="btn-hamburguer"
            onClick={() => setMenuAberto(!menuAberto)}
            aria-label={menuAberto ? 'Fechar menu' : 'Abrir menu'}
            aria-expanded={menuAberto}
          >
            {menuAberto ? '✕' : '☰'}
          </button>
        </div>

        <nav className={menuAberto ? 'menu menu-aberto' : 'menu'}>
          <a href="#sobre" onClick={() => setMenuAberto(false)}>Sobre</a>
          <a href="#catalogo" onClick={() => setMenuAberto(false)}>Catálogo</a>
          <a href="#como-funciona" onClick={() => setMenuAberto(false)}>Como funciona</a>
          <a href="#contato" onClick={() => setMenuAberto(false)}>Contato</a>
        </nav>
      </div>
    </header>
  )
}
