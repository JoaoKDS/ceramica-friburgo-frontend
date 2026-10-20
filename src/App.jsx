import { useEffect, useState } from 'react'
import { WHATSAPP_NUMERO } from './constants'
import { useProdutos } from './hooks/useProdutos'
import { useCarrinho } from './hooks/useCarrinho'
import { produtoCombinaComBusca } from './utils/busca'

import { Header } from './components/Header'
import { Banner } from './components/Banner'
import { Sobre } from './components/Sobre'
import { ParaSuaObra } from './components/ParaSuaObra'
import { ComoFunciona } from './components/ComoFunciona'
import { PorQueEscolher } from './components/PorQueEscolher'
import { Catalogo } from './components/Catalogo'
import { Footer } from './components/Footer'
import { WhatsappFlutuante } from './components/WhatsappFlutuante'

function App() {
  // Dados e lógica vindos dos hooks
  const { produtos, carregando, erroCarregamento, categorias, recarregar } = useProdutos()
  const carrinhoHook = useCarrinho()
  const { carrinho, totalItens, temGrandeQuantidade, adicionadoId, adicionarAoCarrinho } =
    carrinhoHook

  // Estados que pertencem à página como um todo
  const [busca, setBusca] = useState('')
  const [categoriaSelecionada, setCategoriaSelecionada] = useState('Todos')
  const [mostrarOrcamento, setMostrarOrcamento] = useState(false)
  const [pedidoRolagem, setPedidoRolagem] = useState(0)
  const [menuAberto, setMenuAberto] = useState(false)
  const [nome, setNome] = useState('')
  const [endereco, setEndereco] = useState('')
  const [observacoes, setObservacoes] = useState('')
  const [errosFormulario, setErrosFormulario] = useState({})

  // Busca sem acento e sem diferença entre maiúscula/minúscula
  const produtosFiltrados = produtos.filter(produto => {
    const bateCategoria =
      categoriaSelecionada === 'Todos' || produto.categoria === categoriaSelecionada
    return bateCategoria && produtoCombinaComBusca(produto, busca)
  })

  // Abre o painel de orçamento e leva a tela até ele.
  // A rolagem acontece no efeito logo abaixo, porque só depois que o React
  // desenha o painel é que ele existe na página para a tela rolar até lá.
  function abrirOrcamento() {
    setMostrarOrcamento(true)
    setPedidoRolagem(n => n + 1)
  }

  useEffect(() => {
    if (pedidoRolagem === 0) return
    document
      .getElementById('painel-orcamento')
      ?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }, [pedidoRolagem])

  function escolherPorObra(categoria) {
    setCategoriaSelecionada(categoria)
    setBusca('')
    document.getElementById('catalogo').scrollIntoView({ behavior: 'smooth' })
  }

  function montarMensagem() {
    let mensagem = `Olá! Meu nome é *${nome.trim()}*.\nQuero um orçamento:\n\n`
    carrinho.forEach(item => {
      mensagem += `▪ ${item.quantidade}x ${item.nome} (${item.dimensoes})\n`
    })
    mensagem += `\n📍 Entrega: ${endereco.trim()}`
    if (observacoes.trim()) mensagem += `\n📝 Obs: ${observacoes.trim()}`
    if (temGrandeQuantidade)
      mensagem += `\n\n⚠️ Pedido acima de 1.000 peças — favor informar condições especiais.`
    return mensagem
  }

  // Validação sem alert() — preenche um objeto de erros usado para
  // mostrar mensagens ao lado de cada campo do formulário.
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

  // Props que o painel de orçamento precisa (agrupadas pra facilitar a passagem)
  const carrinhoProps = {
    carrinho,
    temGrandeQuantidade,
    alterarQuantidade: carrinhoHook.alterarQuantidade,
    definirQuantidadeNoCarrinho: carrinhoHook.definirQuantidadeNoCarrinho,
    removerDoCarrinho: carrinhoHook.removerDoCarrinho,
    nome,
    setNome,
    endereco,
    setEndereco,
    observacoes,
    setObservacoes,
    errosFormulario,
    enviarOrcamentoWhatsApp,
    onFechar: () => setMostrarOrcamento(false),
  }

  return (
    <div>
      <Header
        totalItens={totalItens}
        abrirOrcamento={abrirOrcamento}
        menuAberto={menuAberto}
        setMenuAberto={setMenuAberto}
      />

      <Banner />
      <Sobre />
      <ParaSuaObra escolherPorObra={escolherPorObra} />
      <ComoFunciona />
      <PorQueEscolher
        totalProdutos={produtos.length}
        totalCategorias={Math.max(0, categorias.length - 1)}
      />

      <Catalogo
        mostrarOrcamento={mostrarOrcamento}
        carrinhoProps={carrinhoProps}
        busca={busca}
        setBusca={setBusca}
        categorias={categorias}
        categoriaSelecionada={categoriaSelecionada}
        setCategoriaSelecionada={setCategoriaSelecionada}
        carregando={carregando}
        erroCarregamento={erroCarregamento}
        recarregar={recarregar}
        produtosFiltrados={produtosFiltrados}
        adicionadoId={adicionadoId}
        obterQuantidadeSelecionada={carrinhoHook.obterQuantidadeSelecionada}
        definirQuantidadeSelecionada={carrinhoHook.definirQuantidadeSelecionada}
        incrementarQuantidadeSelecionada={carrinhoHook.incrementarQuantidadeSelecionada}
        adicionarAoCarrinho={adicionarAoCarrinho}
      />

      <Footer />
      <WhatsappFlutuante />
    </div>
  )
}

export default App
