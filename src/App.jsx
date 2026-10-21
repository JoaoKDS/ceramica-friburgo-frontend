import { Suspense, lazy, useEffect, useState } from 'react'
import Site from './Site'

// O painel de administração só é baixado quando alguém abre o endereço
// /#/admin, então os visitantes comuns não carregam nada dele.
const Admin = lazy(() => import('./admin/Admin').then(modulo => ({ default: modulo.Admin })))

// O site tem duas "páginas" no mesmo endereço, separadas pelo que vem depois
// do "#": o site normal e o painel (endereço-do-site/#/admin).
// Os links do menu (#catalogo, #sobre...) não começam com "#/admin", então
// continuam funcionando normalmente.
const ehRotaAdmin = () => window.location.hash.startsWith('#/admin')

function App() {
  const [admin, setAdmin] = useState(ehRotaAdmin)

  useEffect(() => {
    const aoMudarEndereco = () => setAdmin(ehRotaAdmin())
    window.addEventListener('hashchange', aoMudarEndereco)
    return () => window.removeEventListener('hashchange', aoMudarEndereco)
  }, [])

  // Ao entrar ou sair do painel, volta para o topo da página
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [admin])

  if (admin) {
    return (
      <Suspense fallback={<p className="adm-carregando">Carregando painel...</p>}>
        <Admin />
      </Suspense>
    )
  }

  return <Site />
}

export default App
