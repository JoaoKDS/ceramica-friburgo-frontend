// Deixa o texto "neutro" para comparar:
// sem acento, em minúsculas, e com o "×" das medidas virando "x"
// (assim quem digita "14x19x29" encontra "14×19×29").
//
// Como tirar o acento: o .normalize('NFD') separa a letra do acento
// ("â" vira "a" + "^"), e o replace apaga só os acentos soltos
// (os caracteres de ̀ até ͯ).
export function normalizar(texto = '') {
  return String(texto)
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/×/g, 'x')
    .toLowerCase()
    .trim()
}

// Um produto combina com a busca quando TODAS as palavras digitadas
// aparecem no nome ou nas dimensões dele (em qualquer ordem).
export function produtoCombinaComBusca(produto, busca) {
  const palavras = normalizar(busca).split(/\s+/).filter(Boolean)
  if (palavras.length === 0) return true

  const texto = normalizar(`${produto.nome ?? ''} ${produto.dimensoes ?? ''}`)
  return palavras.every(palavra => texto.includes(palavra))
}
