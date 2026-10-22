// Ícones de linha simples (um traço só, na cor do texto ao redor).
// Substituem os emojis, que mudam de desenho em cada aparelho.
const DESENHOS = {
  casa: <><path d="M3 11l9-7 9 7" /><path d="M5 10v10h14V10" /><path d="M10 20v-6h4v6" /></>,
  predio: <><rect x="5" y="3" width="14" height="18" rx="1" /><path d="M9 7h2M13 7h2M9 11h2M13 11h2M9 15h2M13 15h2" /><path d="M10 21v-3h4v3" /></>,
  piso: <><rect x="3" y="3" width="18" height="18" rx="1" /><path d="M3 12h18M12 3v18" /></>,
  bloco: <><rect x="3" y="6" width="18" height="12" rx="1" /><rect x="7" y="10" width="3.5" height="4" /><rect x="13.5" y="10" width="3.5" height="4" /></>,
  preco: <><path d="M20 12l-8 8-9-9V3h8z" /><circle cx="7.5" cy="7.5" r="1.2" /></>,
  caminhao: <><path d="M2 6h11v10H2z" /><path d="M13 9h5l3 3v4h-8" /><circle cx="7" cy="17.5" r="1.8" /><circle cx="17" cy="17.5" r="1.8" /></>,
  celular: <><rect x="7" y="2.5" width="10" height="19" rx="2" /><path d="M11 18.5h2" /></>,
  telefone: <path d="M5 4h4l2 5-2.5 1.5a11 11 0 005 5L15 13l5 2v4a2 2 0 01-2 2A16 16 0 013 6a2 2 0 012-2z" />,
  conversa: <path d="M4 5h16v11H9l-5 4z" />,
  email: <><rect x="3" y="5" width="18" height="14" rx="1.5" /><path d="M3 7l9 6 9-6" /></>,
  relogio: <><circle cx="12" cy="12" r="9" /><path d="M12 7v5l3 2" /></>,
  local: <><path d="M12 21s-7-6.2-7-11a7 7 0 0114 0c0 4.8-7 11-7 11z" /><circle cx="12" cy="10" r="2.5" /></>,
  lupa: <><circle cx="11" cy="11" r="7" /><path d="M16.5 16.5L21 21" /></>,
  recarregar: <><path d="M20 12a8 8 0 11-2.4-5.7" /><path d="M20 4v5h-5" /></>,
  mais: <path d="M12 5v14M5 12h14" />,
  lixeira: <><path d="M4 7h16" /><path d="M9 7V4h6v3" /><path d="M6 7l1 13h10l1-13" /></>,
  prancheta: <><rect x="5" y="4" width="14" height="17" rx="1.5" /><path d="M9 4h6v3H9z" /><path d="M9 12h6M9 16h6" /></>,
  aviso: <><path d="M12 3l10 18H2z" /><path d="M12 10v5M12 18v.5" /></>,
  salvo: <><circle cx="12" cy="12" r="9" /><path d="M8 12.5l3 3 5-6" /></>,
  calculadora: <><rect x="5" y="3" width="14" height="18" rx="1.5" /><path d="M8 7h8" /><path d="M8.5 11h1M12 11h1M15.5 11h.5M8.5 14.5h1M12 14.5h1M15.5 14.5h.5M8.5 18h1M12 18h1M15.5 18h.5" /></>,
  enviar: <path d="M21 3L3 11l7 3 3 7z M10 14l11-11" />,
}

export function Icone({ nome, tamanho }) {
  return (
    <svg
      className="icone"
      style={tamanho ? { width: tamanho, height: tamanho } : undefined}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      {DESENHOS[nome]}
    </svg>
  )
}
