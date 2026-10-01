import { useEffect, useState } from 'react'
import axios from 'axios'
import { Search, ArrowUpRight, RotateCw, Radio, ChevronLeft, ChevronRight } from 'lucide-react'

const API = 'https://rickandmortyapi.com/api/character'
const statusColors = { Alive: 'bg-[#628b62]', Dead: 'bg-[#bb6251]', unknown: 'bg-[#a29b85]' }

function App() {
  const [characters, setCharacters] = useState([])
  const [info, setInfo] = useState({ pages: 1, count: 0 })
  const [page, setPage] = useState(1)
  const [query, setQuery] = useState('')
  const [status, setStatus] = useState('')
  const [species, setSpecies] = useState('')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const controller = new AbortController()
    async function loadCharacters() {
      setLoading(true); setError('')
      try {
        const response = await axios.get(API, { params: { page, name: query || undefined, status: status || undefined, species: species || undefined }, signal: controller.signal })
        setCharacters(response.data.results)
        setInfo(response.data.info)
      } catch (requestError) {
        if (requestError.name === 'CanceledError') return
        if (requestError.response?.status === 404) {
          setCharacters([]); setInfo({ pages: 1, count: 0 })
          setError('Nenhum personagem encontrado com esses filtros. Tente outra combinação.')
        } else {
          setCharacters([])
          setError('O portal está instável agora. Aguarde um instante e tente novamente.')
        }
      } finally { if (!controller.signal.aborted) setLoading(false) }
    }
    loadCharacters()
    return () => controller.abort()
  }, [page, query, status, species])

  function changeFilter(setter, value) { setter(value); setPage(1) }

  return <div className="min-h-screen bg-[#f4f1eb] text-[#24241f]">
    <header className="border-b border-[#ded9ce] bg-[#faf9f5]"><div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-4 sm:px-8"><a href="#topo" className="flex items-center gap-3"><span className="archive-mark"><Radio size={19}/></span><span><strong className="block text-sm tracking-[.12em]">ARQUIVO</strong><small className="text-[10px] tracking-[.18em] text-[#77766c]">INTERDIMENSIONAL</small></span></a><span className="hidden text-xs text-[#77766c] sm:block">CENTRAL DE PESQUISA · SETOR C-137</span><a href="https://rickandmortyapi.com/documentation" target="_blank" rel="noreferrer" className="flex items-center gap-1 text-xs font-semibold hover:text-[#bc533c]">API usada <ArrowUpRight size={13}/></a></div></header>
    <main id="topo" className="mx-auto max-w-7xl px-5 pb-16 sm:px-8">
      <section className="py-12 sm:py-16"><p className="eyebrow">RELATÓRIO DE CAMPO Nº 001</p><div className="mt-3 grid gap-7 md:grid-cols-[1fr_auto] md:items-end"><div><h1 className="max-w-3xl text-5xl font-semibold leading-[.98] tracking-[-.055em] sm:text-7xl">Toda dimensão<br/>deixa <span className="font-serif italic font-normal text-[#bc533c]">rastros.</span></h1><p className="mt-5 max-w-xl text-sm leading-6 text-[#77766c]">Um catálogo de formas de vida catalogadas no multiverso. Pesquise por nome, espécie ou situação atual.</p></div><div className="record-stamp"><span>REGISTROS</span><strong>{info.count.toLocaleString('pt-BR')}</strong><small>ENTIDADES MAPEADAS</small></div></div></section>

      <section className="border-t border-[#ded9ce] pt-7"><div className="flex flex-col justify-between gap-4 lg:flex-row lg:items-end"><div><p className="eyebrow">BANCO DE DADOS</p><h2 className="mt-1 text-2xl font-semibold tracking-tight">Personagens identificados</h2></div><div className="flex flex-col gap-2 sm:flex-row"><label className="search-field"><Search size={16}/><input value={query} onChange={(event) => changeFilter(setQuery, event.target.value)} placeholder="Nome do personagem" aria-label="Buscar personagem por nome"/></label><select className="data-select" value={status} onChange={(event) => changeFilter(setStatus, event.target.value)} aria-label="Filtrar por status"><option value="">Todos os status</option><option value="Alive">Vivo</option><option value="Dead">Morto</option><option value="unknown">Desconhecido</option></select><select className="data-select" value={species} onChange={(event) => changeFilter(setSpecies, event.target.value)} aria-label="Filtrar por espécie"><option value="">Todas as espécies</option><option value="Human">Humano</option><option value="Alien">Alienígena</option><option value="Robot">Robô</option><option value="Animal">Animal</option></select></div></div>

      {loading && <div className="feedback"><span className="loader"></span><p>Estabelecendo conexão com o multiverso...</p></div>}
      {!loading && error && <div className="feedback error-feedback" role="alert"><p>{error}</p><button onClick={() => window.location.reload()}><RotateCw size={14}/> Tentar novamente</button></div>}
      {!loading && !error && characters.length === 0 && <div className="feedback"><p>Nenhum resultado disponível.</p></div>}
      {!loading && !error && characters.length > 0 && <><div className="character-grid">{characters.map((person) => <article key={person.id} className="character-row"><div className="portrait"><img loading="lazy" src={person.image} alt={`Retrato de ${person.name}`}/><span className={`status-dot ${statusColors[person.status] || statusColors.unknown}`}></span></div><div className="person-info"><div className="flex items-start justify-between gap-2"><h3>{person.name}</h3><span className="person-id">#{String(person.id).padStart(3, '0')}</span></div><p className="person-species">{person.species}{person.type ? ` · ${person.type}` : ''}</p><dl><div><dt>ORIGEM</dt><dd>{person.origin.name}</dd></div><div><dt>STATUS</dt><dd>{person.status === 'Alive' ? 'Vivo' : person.status === 'Dead' ? 'Morto' : 'Desconhecido'}</dd></div></dl></div></article>)}</div><div className="pagination"><p>Página <strong>{page}</strong> de <strong>{info.pages}</strong><span className="mx-2 text-[#b6b0a3]">·</span>{info.count.toLocaleString('pt-BR')} registros</p><div className="flex gap-2"><button aria-label="Página anterior" disabled={page <= 1} onClick={() => setPage(page - 1)}><ChevronLeft size={16}/></button><button aria-label="Próxima página" disabled={page >= info.pages} onClick={() => setPage(page + 1)}><ChevronRight size={16}/></button></div></div></>}
      </section>
      <footer className="mt-14 border-t border-[#ded9ce] pt-5 text-xs text-[#77766c]"><div className="flex flex-col justify-between gap-2 sm:flex-row"><p>Projeto acadêmico · API Hunters</p><p>Dados fornecidos pela Rick and Morty API · Imagens pertencem aos seus respectivos criadores.</p></div></footer>
    </main>
  </div>
}

export default App
