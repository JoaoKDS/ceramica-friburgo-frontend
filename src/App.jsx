import { useEffect, useMemo, useState } from 'react'

// ⚠️ IMPORTANTE: essa linha detecta se você está usando Vite ou Next.js
// e pega a URL da API do arquivo .env. Se você não criar o .env, ele usa
// localhost:8080 como padrão (bom pra testar, mas ruim pra produção).
const API_URL =
  (typeof import.meta !== 'undefined' && import.meta.env?.VITE_API_URL) ||
  (typeof process !== 'undefined' && process.env?.NEXT_PUBLIC_API_URL) ||
  'http://localhost:8080'

const WHATSAPP_NUMERO = '5519993369208'
const ANOS_NO_MERCADO = 30

const EMOJIS_POR_CATEGORIA = {
  'Blocos Cerâmicos': '🧱',
  'Blocos Estruturais': '🏗️',
  'Lajotas': '🟫',
  'Canaletas': '📏',
}

// Fotos da empresa (rodam sozinhas no carrossel)
const FOTOS = [
  '/ceramica.jpeg',
  '/entrada2.jpeg',
  '/entrada3.jpeg',
  '/entrada4.jpeg',
  '/foto-empresa.jpeg',
]

function Contador({ valor }) {
  const [numero, setNumero] = useState(0)

  useEffect(() => {
    let atual = 0
    const passo = Math.max(1, Math.ceil(valor / 40))
    const timer = setInterval(() => {
      atual += passo
      if (atual >= valor) {
        atual = valor
        clearInterval(timer)
      }
      setNumero(atual)
    }, 40)
    return () => clearInterval(timer)
  }, [valor])

  return <strong>+{numero}</strong>
}

function App() {
  const [produtos, setProdutos] = useState([])
  const [carregando, setCarregando] = useState(true)
  const [erroCarregamento, setErroCarregamento] = useState(null)
  const [busca, setBusca] = useState('')
  const [categoriaSelecionada, setCategoriaSelecionada] = useState('Todos')
  const [carrinho, setCarrinho] = useState([])
  const [mostrarOrcamento, setMostrarOrcamento] = useState(false)
  const [nome, setNome] = useState('')
  const [endereco, setEndereco] = useState('')
  const [observacoes, setObservacoes] = useState('')
  const [errosFormulario, setErrosFormulario] = useState({})
  const [fotoAtual, setFotoAtual] = useState(0)
  const [quantidadesSelecionadas, setQuantidadesSelecionadas] = useState({})
  const [menuAberto, setMenuAberto] = useState(false)

  // ===== SALVAR/CARREGAR ORÇAMENTO NO NAVEGADOR (localStorage) =====
  // Assim, se a pessoa atualizar a página ou fechar o navegador sem querer,
  // o orçamento que ela montou não se perde.
  const CHAVE_CARRINHO = 'ceramica-friburgo-orcamento'

  // Controla se o carregamento inicial já terminou. Isso evita que o efeito
  // de "salvar" rode com o carrinho ainda vazio e apague o que tinha sido
  // salvo antes, logo no primeiro instante em que a página abre.
  const [carregouOrcamentoSalvo, setCarregouOrcamentoSalvo] = useState(false)

  // Carrega o orçamento salvo assim que o site abre (só roda uma vez)
  useEffect(() => {
    try {
      const salvo = localStorage.getItem(CHAVE_CARRINHO)
      if (salvo) {
        setCarrinho(JSON.parse(salvo))
      }
    } catch (erro) {
      // Se der algum problema ao ler (ex: dado corrompido), simplesmente
      // ignora e começa com o orçamento vazio, sem quebrar o site.
      console.error('Não foi possível carregar o orçamento salvo:', erro)
    } finally {
      setCarregouOrcamentoSalvo(true)
    }
  }, [])

  // Toda vez que o carrinho mudar, salva a versão mais recente —
  // mas só depois que o carregamento inicial já tiver terminado
  useEffect(() => {
    if (!carregouOrcamentoSalvo) return
    try {
      localStorage.setItem(CHAVE_CARRINHO, JSON.stringify(carrinho))
    } catch (erro) {
      console.error('Não foi possível salvar o orçamento:', erro)
    }
  }, [carrinho, carregouOrcamentoSalvo])

  // ===== BUSCAR PRODUTOS (agora com tratamento de erro) =====
  useEffect(() => {
    setCarregando(true)
    setErroCarregamento(null)

    fetch(`${API_URL}/produtos`)
      .then(resposta => {
        if (!resposta.ok) {
          throw new Error(`Erro ${resposta.status} ao buscar produtos`)
        }
        return resposta.json()
      })
      .then(dados => setProdutos(dados))
      .catch(() => {
        setErroCarregamento(
          'Não foi possível carregar o catálogo agora. Verifique sua conexão e tente novamente em instantes.'
        )
      })
      .finally(() => setCarregando(false))
  }, [])

  // Carrossel de fotos
  useEffect(() => {
    const timer = setInterval(() => {
      setFotoAtual(atual => (atual + 1) % FOTOS.length)
    }, 4000)
    return () => clearInterval(timer)
  }, [])

  // useMemo evita recalcular a lista de categorias a cada renderização
  const categorias = useMemo(
    () => ['Todos', ...new Set(produtos.map(p => p.categoria))],
    [produtos]
  )

  const produtosFiltrados = produtos.filter(produto => {
    const bateBusca = produto.nome.toLowerCase().includes(busca.toLowerCase())
    const bateCategoria =
      categoriaSelecionada === 'Todos' || produto.categoria === categoriaSelecionada
    return bateBusca && bateCategoria
  })

  function escolherPorObra(categoria) {
    setCategoriaSelecionada(categoria)
    setBusca('')
    document.getElementById('catalogo').scrollIntoView({ behavior: 'smooth' })
  }

  // Quantidade que está digitada no seletor de cada card (padrão: 1)
  function obterQuantidadeSelecionada(produtoId) {
    return quantidadesSelecionadas[produtoId] ?? 1
  }

  function definirQuantidadeSelecionada(produtoId, valor) {
    // Aceita string vazia temporariamente (enquanto a pessoa está digitando)
    if (valor === '') {
      setQuantidadesSelecionadas({ ...quantidadesSelecionadas, [produtoId]: '' })
      return
    }
    const numero = Math.max(1, parseInt(valor, 10) || 1)
    setQuantidadesSelecionadas({ ...quantidadesSelecionadas, [produtoId]: numero })
  }

  function incrementarQuantidadeSelecionada(produtoId, delta) {
    const atual = obterQuantidadeSelecionada(produtoId) || 1
    const novoValor = Math.max(1, Number(atual) + delta)
    setQuantidadesSelecionadas({ ...quantidadesSelecionadas, [produtoId]: novoValor })
  }

  function adicionarAoCarrinho(produto) {
    const quantidade = Math.max(1, Number(obterQuantidadeSelecionada(produto.id)) || 1)
    const jaEstaNoCarrinho = carrinho.some(item => item.id === produto.id)
    if (jaEstaNoCarrinho) {
      setCarrinho(
        carrinho.map(item =>
          item.id === produto.id
            ? { ...item, quantidade: item.quantidade + quantidade }
            : item
        )
      )
    } else {
      setCarrinho([...carrinho, { ...produto, quantidade }])
    }
    // volta o seletor do card para 1 depois de adicionar
    setQuantidadesSelecionadas({ ...quantidadesSelecionadas, [produto.id]: 1 })
  }

  function alterarQuantidade(id, delta) {
    setCarrinho(
      carrinho
        .map(item =>
          item.id === id ? { ...item, quantidade: item.quantidade + delta } : item
        )
        .filter(item => item.quantidade > 0)
    )
  }

  // Permite digitar a quantidade diretamente no carrinho (útil para pedidos grandes)
  function definirQuantidadeNoCarrinho(id, valor) {
    if (valor === '') {
      setCarrinho(carrinho.map(item => (item.id === id ? { ...item, quantidade: '' } : item)))
      return
    }
    const quantidade = Math.max(0, parseInt(valor, 10) || 0)
    if (quantidade === 0) {
      removerDoCarrinho(id)
    } else {
      setCarrinho(carrinho.map(item => (item.id === id ? { ...item, quantidade } : item)))
    }
  }

  function removerDoCarrinho(id) {
    setCarrinho(carrinho.filter(item => item.id !== id))
  }

  const totalItens = carrinho.reduce((soma, item) => soma + item.quantidade, 0)
  const temGrandeQuantidade = carrinho.some(item => item.quantidade >= 1000)

  function montarMensagem() {
    let mensagem = `Olá! Meu nome é *${nome}*.\nQuero um orçamento:\n\n`
    carrinho.forEach(item => {
      mensagem += `▪ ${item.quantidade}x ${item.nome} (${item.dimensoes})\n`
    })
    mensagem += `\n📍 Entrega: ${endereco}`
    if (observacoes.trim()) mensagem += `\n📝 Obs: ${observacoes}`
    if (temGrandeQuantidade)
      mensagem += `\n\n⚠️ Pedido acima de 1.000 peças — favor informar condições especiais.`
    return mensagem
  }

  // Validação sem alert() — agora preenche um objeto de erros
  // que é usado para mostrar mensagens ao lado de cada campo.
  function validarFormulario() {
    const erros = {}
    if (carrinho.length === 0) {
      erros.carrinho = 'Seu orçamento está vazio. Adicione produtos primeiro.'
    }
    if (!nome.trim()) {
      erros.nome = 'Informe seu nome.'
    }
    if (!endereco.trim()) {
      erros.endereco = 'Informe o endereço de entrega.'
    }
    setErrosFormulario(erros)
    return Object.keys(erros).length === 0
  }

  function enviarOrcamentoWhatsApp() {
    if (!validarFormulario()) return
    const url = `https://wa.me/${WHATSAPP_NUMERO}?text=${encodeURIComponent(montarMensagem())}`
    window.open(url, '_blank')
  }

  return (
    <div>
      {/* ===== TOPO ===== */}
      <header className="topo">
        <div className="topo-conteudo">
          <a href="#" className="logo">
            <img src="/logo.png" alt="Logotipo Cerâmica Friburgo" className="logo-img" />
            <span>Cerâmica Friburgo</span>
          </a>

          <div className="topo-direita">
            <button
              className="btn-badge-topo"
              onClick={() => setMostrarOrcamento(!mostrarOrcamento)}
              aria-label={`Ver orçamento, ${totalItens} itens`}
            >
              📋 Orçamento ({totalItens})
            </button>

            <button
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

      {/* ===== BANNER ===== */}
      <section className="banner">
        <img src="/logo.png" alt="Logo Cerâmica Friburgo" className="banner-logo" />
        <h1>Materiais cerâmicos de qualidade para a sua obra</h1>
        <p>
          Há mais de {ANOS_NO_MERCADO} anos fornecendo blocos, lajotas e canaletas
          com o melhor preço da região. Faça seu orçamento em 1 minuto pelo WhatsApp.
        </p>
        <a href="#catalogo" className="btn-banner">Ver catálogo 🧱</a>
      </section>

      {/* ===== SOBRE ===== */}
      <section className="sobre" id="sobre">
        <div className="sobre-conteudo">
          <div className="sobre-texto">
            <h2>Quem somos</h2>
            <p>
              A <strong>Cerâmica Friburgo</strong> é uma empresa familiar de Campinas/SP
              que há <strong>mais de {ANOS_NO_MERCADO} anos</strong> fabrica produtos
              cerâmicos de qualidade para a construção civil.
            </p>
            <p>
              Nossos blocos, lajotas e canaletas saem direto do forno para a sua obra —
              sem intermediários, com preço justo e entrega na região.
            </p>
            <ul className="sobre-lista">
              <li>✅ Produto artesanal de qualidade comprovada</li>
              <li>✅ Atendimento direto com quem entende do assunto</li>
              <li>✅ Orçamento rápido pelo WhatsApp</li>
              <li>✅ Grandes quantidades com condições especiais</li>
            </ul>
          </div>
          <div className="sobre-card sobre-fotos">
            <img
              src={FOTOS[fotoAtual]}
              alt={`Foto ${fotoAtual + 1} das instalações da Cerâmica Friburgo`}
              className="foto-empresa"
            />
            <div className="foto-dots">
              {FOTOS.map((foto, i) => (
                <button
                  key={foto}
                  aria-label={`Ver foto ${i + 1} de ${FOTOS.length}`}
                  className={i === fotoAtual ? 'dot ativo' : 'dot'}
                  onClick={() => setFotoAtual(i)}
                />
              ))}
            </div>
            <p className="sobre-card-frase">
              "Tradição e qualidade que constroem confiança."
            </p>
          </div>
        </div>
      </section>

      {/* ===== PARA SUA OBRA ===== */}
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

      {/* ===== COMO FUNCIONA ===== */}
      <section className="como-funciona" id="como-funciona">
        <h2>Como funciona</h2>
        <div className="passos">
          <div className="passo">
            <span>1️⃣</span>
            <h3>Escolha os produtos</h3>
            <p>Navegue pelo catálogo e adicione o que precisa ao orçamento.</p>
          </div>
          <div className="passo">
            <span>2️⃣</span>
            <h3>Informe a entrega</h3>
            <p>Diga a quantidade de cada item e o endereço de entrega.</p>
          </div>
          <div className="passo">
            <span>3️⃣</span>
            <h3>Receba no WhatsApp</h3>
            <p>Seu orçamento chega pronto no nosso WhatsApp. Respondemos rápido!</p>
          </div>
        </div>
      </section>

      {/* ===== POR QUE ESCOLHER ===== */}
      <section className="porque">
        <h2>Por que escolher a Cerâmica Friburgo?</h2>
        <div className="porque-stats">
          <div className="stat">
            <Contador valor={ANOS_NO_MERCADO} />
            <span>anos de mercado</span>
          </div>
          <div className="stat">
            <Contador valor={15} />
            <span>produtos no catálogo</span>
          </div>
          <div className="stat">
            <Contador valor={4} />
            <span>categorias completas</span>
          </div>
        </div>
        <div className="porque-motivos">
          <div>🧱 Qualidade comprovada no mercado</div>
          <div>💰 Preço justo, direto da fábrica</div>
          <div>🚚 Entrega na região de Campinas</div>
          <div>📲 Orçamento em 1 minuto, sem cadastro</div>
        </div>
      </section>

      {/* ===== CATÁLOGO ===== */}
      <main className="container" id="catalogo">
        <h2 className="titulo-secao">Nosso catálogo</h2>

        {mostrarOrcamento && (
          <section className="painel-orcamento">
            <h2>📋 Seu Orçamento</h2>
            {carrinho.length > 0 && (
              <p className="aviso-salvamento">
                💾 Seu orçamento é salvo automaticamente neste navegador — pode
                fechar e voltar depois que ele continua aqui.
              </p>
            )}
            {carrinho.length === 0 ? (
              <p className="vazio">Seu orçamento está vazio. Adicione produtos abaixo! 👇</p>
            ) : (
              <>
                {carrinho.map(item => (
                  <div className="item-orcamento" key={item.id}>
                    <div className="item-info">
                      <strong>{item.nome}</strong>
                      <span>{item.dimensoes}</span>
                    </div>
                    <div className="item-controles">
                      <button
                        onClick={() => alterarQuantidade(item.id, -1)}
                        aria-label={`Diminuir quantidade de ${item.nome}`}
                      >
                        −
                      </button>
                      <input
                        type="number"
                        min="1"
                        className="input-quantidade-carrinho"
                        value={item.quantidade}
                        onChange={e => definirQuantidadeNoCarrinho(item.id, e.target.value)}
                        aria-label={`Quantidade de ${item.nome}`}
                      />
                      <button
                        onClick={() => alterarQuantidade(item.id, 1)}
                        aria-label={`Aumentar quantidade de ${item.nome}`}
                      >
                        +
                      </button>
                    </div>
                    <button
                      className="btn-remover"
                      onClick={() => removerDoCarrinho(item.id)}
                      aria-label={`Remover ${item.nome} do orçamento`}
                    >
                      🗑️
                    </button>
                  </div>
                ))}

                {temGrandeQuantidade && (
                  <p className="aviso-milheiro">
                    ⚠️ Você tem itens acima de 1.000 peças — grandes quantidades
                    podem ter condições especiais!
                  </p>
                )}

                <div className="formulario">
                  <div className="campo-formulario">
                    <input
                      type="text"
                      placeholder="Seu nome *"
                      value={nome}
                      onChange={e => setNome(e.target.value)}
                      aria-invalid={Boolean(errosFormulario.nome)}
                    />
                    {errosFormulario.nome && (
                      <span className="erro-campo">{errosFormulario.nome}</span>
                    )}
                  </div>

                  <div className="campo-formulario">
                    <input
                      type="text"
                      placeholder="Endereço de entrega *"
                      value={endereco}
                      onChange={e => setEndereco(e.target.value)}
                      aria-invalid={Boolean(errosFormulario.endereco)}
                    />
                    {errosFormulario.endereco && (
                      <span className="erro-campo">{errosFormulario.endereco}</span>
                    )}
                  </div>

                  <textarea
                    placeholder="Observações (opcional)"
                    rows={3}
                    value={observacoes}
                    onChange={e => setObservacoes(e.target.value)}
                  />

                  <button className="btn-whatsapp" onClick={enviarOrcamentoWhatsApp}>
                    📲 Enviar orçamento pelo WhatsApp
                  </button>
                </div>
              </>
            )}
          </section>
        )}

        <div className="busca">
          <input
            type="text"
            placeholder="🔍 Buscar produto... (ex: caixote, lajota)"
            value={busca}
            onChange={e => setBusca(e.target.value)}
          />
        </div>

        <div className="filtros">
          {categorias.map(categoria => (
            <button
              key={categoria}
              className={categoria === categoriaSelecionada ? 'filtro ativo' : 'filtro'}
              onClick={() => setCategoriaSelecionada(categoria)}
            >
              {categoria}
            </button>
          ))}
        </div>

        {carregando && <p className="vazio">Carregando produtos...</p>}

        {!carregando && erroCarregamento && (
          <p className="vazio erro-carregamento">{erroCarregamento}</p>
        )}

        {!carregando && !erroCarregamento && produtosFiltrados.length === 0 && (
          <p className="vazio">Nenhum produto encontrado. 😕</p>
        )}

        <div className="grid">
          {produtosFiltrados.map(produto => (
            <div className="card" key={produto.id}>
              <div className="foto">
                {EMOJIS_POR_CATEGORIA[produto.categoria] || '🏗️'}
              </div>
              <span className="badge">{produto.categoria}</span>
              <h3>{produto.nome}</h3>
              <p className="dimensoes">{produto.dimensoes}</p>
              <p className="descricao">{produto.descricao}</p>
              <div className="seletor-quantidade">
                <button
                  onClick={() => incrementarQuantidadeSelecionada(produto.id, -1)}
                  aria-label={`Diminuir quantidade de ${produto.nome}`}
                >
                  −
                </button>
                <input
                  type="number"
                  min="1"
                  value={obterQuantidadeSelecionada(produto.id)}
                  onChange={e => definirQuantidadeSelecionada(produto.id, e.target.value)}
                  aria-label={`Quantidade de ${produto.nome} a adicionar`}
                />
                <button
                  onClick={() => incrementarQuantidadeSelecionada(produto.id, 1)}
                  aria-label={`Aumentar quantidade de ${produto.nome}`}
                >
                  +
                </button>
              </div>
              <button className="btn-adicionar" onClick={() => adicionarAoCarrinho(produto)}>
                ➕ Adicionar ao orçamento
              </button>
            </div>
          ))}
        </div>
      </main>

      {/* ===== RODAPÉ ===== */}
      <footer id="contato">
        <div className="rodape-conteudo">
          <div>
            <img src="/logo.png" alt="Logotipo Cerâmica Friburgo" className="rodape-logo" />
            <p>Blocos, lajotas e canaletas cerâmicas para construção civil.</p>
          </div>
          <div>
            <h4>Contato</h4>
            <p>📞 (19) 3266-0508 / (19) 99336-9208</p>
            <p>✉️ olariafriburgo@hotmail.com</p>
          </div>
          <div>
            <h4>Atendimento</h4>
            <p>📅 Segunda a sábado</p>
            <p>🚚 Entrega na região — consulte</p>
          </div>
        </div>
        <p className="copyright">© 2026 Cerâmica Friburgo. Todos os direitos reservados.</p>
      </footer>

      <a
        className="whatsapp-flutuante"
        href={`https://wa.me/${WHATSAPP_NUMERO}?text=${encodeURIComponent('Olá! Vim pelo site e gostaria de fazer um orçamento.')}`}
        target="_blank"
        rel="noreferrer"
        aria-label="Abrir conversa no WhatsApp"
      >
        💬
      </a>
    </div>
  )
}

export default App