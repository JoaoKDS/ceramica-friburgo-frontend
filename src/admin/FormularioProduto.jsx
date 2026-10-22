import { useState } from 'react'
import { normalizarFoto } from '../utils/foto'

// Se digitarem só o nome do arquivo ("bloco-baiano.jpg"), completa com a pasta
// onde ficam as fotos do catálogo (public/produtos).
export function FormularioProduto({ produto, categorias, aoSalvar, aoCancelar }) {
  const [nome, setNome] = useState(produto?.nome ?? '')
  const [categoria, setCategoria] = useState(produto?.categoria ?? '')
  const [dimensoes, setDimensoes] = useState(produto?.dimensoes ?? '')
  const [descricao, setDescricao] = useState(produto?.descricao ?? '')
  const [foto, setFoto] = useState(produto?.foto ?? '')
  const [fotoFalhou, setFotoFalhou] = useState(false)
  const [erro, setErro] = useState('')
  const [salvando, setSalvando] = useState(false)

  const fotoFinal = normalizarFoto(foto)

  async function enviar(evento) {
    evento.preventDefault()
    if (!nome.trim() || !categoria.trim() || !dimensoes.trim() || !descricao.trim()) {
      setErro('Preencha nome, categoria, dimensões e descrição.')
      return
    }

    setSalvando(true)
    setErro('')
    try {
      await aoSalvar({
        nome: nome.trim(),
        categoria: categoria.trim(),
        dimensoes: dimensoes.trim(),
        descricao: descricao.trim(),
        foto: fotoFinal || null,
      })
    } catch (e) {
      setErro(e.message)
      setSalvando(false)
    }
  }

  return (
    <form className="adm-card adm-form" onSubmit={enviar}>
      <h2>{produto ? 'Editar produto' : 'Novo produto'}</h2>

      <label htmlFor="prod-nome">Nome do produto *</label>
      <input
        id="prod-nome"
        type="text"
        maxLength={150}
        placeholder="Ex.: Bloco Cerâmico 9×19×19 (Baiano 8F)"
        value={nome}
        onChange={e => setNome(e.target.value)}
      />

      <label htmlFor="prod-categoria">Categoria *</label>
      <input
        id="prod-categoria"
        type="text"
        maxLength={100}
        list="prod-categorias"
        placeholder="Escolha uma da lista ou digite uma nova"
        value={categoria}
        onChange={e => setCategoria(e.target.value)}
      />
      <datalist id="prod-categorias">
        {categorias.map(c => (
          <option key={c} value={c} />
        ))}
      </datalist>

      <label htmlFor="prod-dimensoes">Dimensões *</label>
      <input
        id="prod-dimensoes"
        type="text"
        maxLength={100}
        placeholder="Ex.: 9×19×19 cm"
        value={dimensoes}
        onChange={e => setDimensoes(e.target.value)}
      />

      <label htmlFor="prod-descricao">Descrição *</label>
      <textarea
        id="prod-descricao"
        rows={3}
        maxLength={255}
        placeholder="Ex.: Bloco cerâmico de 8 furos para vedação"
        value={descricao}
        onChange={e => setDescricao(e.target.value)}
      />
      <span className="adm-contador">{descricao.length}/255</span>

      <label htmlFor="prod-foto">Foto (opcional)</label>
      <input
        id="prod-foto"
        type="text"
        maxLength={255}
        placeholder="Ex.: bloco-baiano.jpg"
        value={foto}
        onChange={e => {
          setFoto(e.target.value)
          setFotoFalhou(false)
        }}
      />
      <span className="adm-ajuda">
        Digite o nome do arquivo da foto (a foto precisa estar na pasta do site). Deixe vazio para
        usar o ícone padrão.
      </span>

      {fotoFinal && (
        <div className="adm-previa">
          {fotoFalhou ? (
            <p className="adm-aviso adm-aviso-info">
              Não encontrei essa foto no site. Confira o nome do arquivo.
            </p>
          ) : (
            <img src={fotoFinal} alt="Prévia da foto" onError={() => setFotoFalhou(true)} />
          )}
        </div>
      )}

      {erro && <p className="adm-aviso adm-aviso-erro" role="alert">{erro}</p>}

      <div className="adm-form-acoes">
        <button type="submit" className="adm-btn adm-btn-principal" disabled={salvando}>
          {salvando ? 'Salvando...' : 'Salvar'}
        </button>
        <button type="button" className="adm-btn adm-btn-claro" onClick={aoCancelar} disabled={salvando}>
          Cancelar
        </button>
      </div>
    </form>
  )
}
