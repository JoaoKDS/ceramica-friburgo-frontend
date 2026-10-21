import { useState } from 'react'
import { LoginAdmin } from './LoginAdmin'
import { PainelAdmin } from './PainelAdmin'

// Tela de administração. O usuário e a senha ficam só na memória desta página:
// se fechar a aba ou atualizar (F5), é preciso entrar de novo. Assim a senha
// não fica guardada no computador.
export function Admin() {
  const [credenciais, setCredenciais] = useState(null)
  const [aviso, setAviso] = useState('')

  function entrar(novasCredenciais) {
    setAviso('')
    setCredenciais(novasCredenciais)
  }

  function sair(mensagem = '') {
    setAviso(mensagem)
    setCredenciais(null)
  }

  return (
    <div className="adm">
      <header className="adm-topo">
        <strong>Painel de administração — Cerâmica Friburgo</strong>
        <span className="adm-topo-acoes">
          <a href="#">← Ver o site</a>
          {credenciais && (
            <button type="button" className="adm-btn adm-btn-claro" onClick={() => sair()}>
              Sair
            </button>
          )}
        </span>
      </header>

      <main className="adm-conteudo">
        {credenciais ? (
          <PainelAdmin
            credenciais={credenciais}
            aoSessaoExpirar={() => sair('Sua sessão terminou. Entre de novo.')}
          />
        ) : (
          <LoginAdmin aoEntrar={entrar} aviso={aviso} />
        )}
      </main>
    </div>
  )
}
