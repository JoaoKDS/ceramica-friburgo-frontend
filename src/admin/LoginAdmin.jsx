import { useState } from 'react'
import { verificarLogin } from './apiAdmin'

export function LoginAdmin({ aoEntrar, aviso }) {
  const [usuario, setUsuario] = useState('')
  const [senha, setSenha] = useState('')
  const [erro, setErro] = useState('')
  const [enviando, setEnviando] = useState(false)

  async function enviar(evento) {
    evento.preventDefault()
    if (!usuario.trim() || !senha) {
      setErro('Digite o usuário e a senha.')
      return
    }

    setEnviando(true)
    setErro('')
    const credenciais = { usuario: usuario.trim(), senha }

    try {
      await verificarLogin(credenciais)
      aoEntrar(credenciais)
    } catch (e) {
      setErro(e.message)
      setEnviando(false)
    }
  }

  return (
    <form className="adm-card adm-login" onSubmit={enviar}>
      <h1>Entrar</h1>
      <p className="adm-ajuda">Área restrita para cadastrar e alterar os produtos do site.</p>

      {aviso && <p className="adm-aviso adm-aviso-info" role="status">{aviso}</p>}

      <label htmlFor="adm-usuario">Usuário</label>
      <input
        id="adm-usuario"
        name="usuario"
        type="text"
        autoComplete="username"
        autoCapitalize="none"
        value={usuario}
        onChange={e => setUsuario(e.target.value)}
      />

      <label htmlFor="adm-senha">Senha</label>
      <input
        id="adm-senha"
        name="senha"
        type="password"
        autoComplete="current-password"
        value={senha}
        onChange={e => setSenha(e.target.value)}
      />

      {erro && <p className="adm-aviso adm-aviso-erro" role="alert">{erro}</p>}

      <button type="submit" className="adm-btn adm-btn-principal" disabled={enviando}>
        {enviando ? 'Entrando...' : 'Entrar'}
      </button>
    </form>
  )
}
