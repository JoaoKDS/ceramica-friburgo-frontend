// Aceita só o nome do arquivo ("bloco.jpg"), um caminho ("/produtos/bloco.jpg")
// ou um endereço completo (https://...) e devolve um endereço que funciona.
export function normalizarFoto(valor) {
  const texto = (valor ?? '').trim()
  if (!texto) return ''
  if (texto.startsWith('/') || /^https?:/i.test(texto)) return texto
  return `/produtos/${texto}`
}
