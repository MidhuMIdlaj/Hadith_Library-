import { useEffect, useMemo, useState } from 'react'
import { BookOpen, Search, ShieldCheck, Sparkles, LibraryBig, Languages, SlidersHorizontal } from 'lucide-react'
import FilterPanel from './components/FilterPanel'
import HadithCard from './components/HadithCard'
import Pagination from './components/Pagination'
import type { Hadith } from './types/hadith'
import { adaptHadiths, type SourceCollection } from './utils/hadithAdapter'
// @ts-expect-error CSS is loaded by the bundler and has no TypeScript module declaration.
import './index.css'

const PAGE_SIZE = 10
export default function App() {
  const [allHadiths, setAllHadiths] = useState<Hadith[]>([])
  const [loading, setLoading] = useState(true)
  const [dataError, setDataError] = useState('')
  const [query, setQuery] = useState('')
  const [collection, setCollection] = useState('all')
  const [kitab, setKitab] = useState('all')
  const [bab, setBab] = useState('all')
  const [grade, setGrade] = useState('all')
  const [repeatsOnly, setRepeatsOnly] = useState(false)
  const [page, setPage] = useState(1)
  const [mobileFilters, setMobileFilters] = useState(false)

  useEffect(() => {
    let cancelled = false
    async function load() {
      try {
        setLoading(true)
        setDataError('')
        const [bRes, mRes] = await Promise.all([fetch('/data/bukhari.json'), fetch('/data/muslim.json')])
        if (!bRes.ok || !mRes.ok) throw new Error('Could not load /data/bukhari.json and /data/muslim.json. Check that both files are inside public/data/.')
        const [bukhari, muslim] = await Promise.all([bRes.json() as Promise<SourceCollection>, mRes.json() as Promise<SourceCollection>])
        const records = [...adaptHadiths(bukhari, 'Sahih al-Bukhari'), ...adaptHadiths(muslim, 'Sahih Muslim')]
        if (!cancelled) setAllHadiths(records)
      } catch (err) {
        if (!cancelled) setDataError(err instanceof Error ? err.message : 'An unknown error occurred while loading data.')
      } finally { if (!cancelled) setLoading(false) }
    }
    void load()
    return () => { cancelled = true }
  }, [])

  useEffect(() => { setPage(1) }, [query, collection, kitab, bab, grade, repeatsOnly])
  const filtered = useMemo(() => {
    const q = query.trim().toLocaleLowerCase()
    return allHadiths.filter(h => {
      const kitabLabel = `${h.kitabMalayalam} — ${h.kitabArabic}`
      const babLabel = `${h.babMalayalam} — ${h.babArabic}`
      const searchable = [h.arabic, h.english, h.malayalam, h.narrator, h.kitabArabic, h.kitabMalayalam, h.babArabic, h.babMalayalam, String(h.hadithNumber), h.collection].join(' ').toLocaleLowerCase()
      return (!q || searchable.includes(q)) && (collection === 'all' || h.collection === collection) && (kitab === 'all' || kitabLabel === kitab) && (bab === 'all' || babLabel === bab) && (grade === 'all' || h.grade === grade) && (!repeatsOnly || Boolean(h.repeatGroup))
    }).sort((a, b) => a.collection.localeCompare(b.collection) || a.hadithNumber - b.hadithNumber)
  }, [allHadiths, query, collection, kitab, bab, grade, repeatsOnly])
  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE))
  const visible = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE)
  function resetFilters() { setQuery(''); setCollection('all'); setKitab('all'); setBab('all'); setGrade('all'); setRepeatsOnly(false); setPage(1) }

  return <div className="app-shell">
    <div className="topbar"><div className="topbar-inner"><div className="brand-mini"><span className="brand-mark">ه</span><span>HADITH <b>LIBRARY</b></span></div><span className="topbar-note"><ShieldCheck size={14} /> References matter. Verify every narration.</span></div></div>
    <header className="hero"><div className="hero-pattern"/><div className="hero-content"><div className="eyebrow"><Sparkles size={14}/> അറിവിലേക്കുള്ള വിശ്വസനീയമായ വഴി</div><h1>Hadith <em>Library</em></h1><p className="hero-malayalam">സ്വഹീഹുൽ ബുഖാരി · സ്വഹീഹുൽ മുസ്‌ലിം</p><p className="hero-description">Browse, search, and study hadiths with Arabic text, available English text, and references.</p><div className="hero-stats"><div><BookOpen size={17}/><span><strong>2</strong><small>പ്രധാന ഗ്രന്ഥങ്ങൾ</small></span></div><div><Languages size={17}/><span><strong>AR + EN</strong><small>അറബി · ഇംഗ്ലീഷ്</small></span></div><div><LibraryBig size={17}/><span><strong>Chapter-wise</strong><small>കിതാബ് & ബാബ്</small></span></div></div></div><div className="hero-seal" aria-hidden="true"><span>الحديث</span><small>HADITH</small></div></header>
    <main className="main-container"><div className="page-intro"><div><p className="overline">THE COLLECTION</p><h2>ഹദീസ് തിരയുക</h2><p>Search by text, narrator, reference, book, or chapter.</p></div><button className="mobile-filter-button" onClick={() => setMobileFilters(v => !v)}><SlidersHorizontal size={16}/> ഫിൽട്ടറുകൾ</button></div>
      <div className="search-box"><Search size={19}/><input value={query} onChange={e => setQuery(e.target.value)} placeholder="ഹദീസ്, റാവി, കിതാബ്, ബാബ്, നമ്പർ എന്നിവ തിരയുക..." aria-label="Search hadiths"/>{query && <button onClick={() => setQuery('')} aria-label="Clear search">×</button>}<kbd>SEARCH</kbd></div>
      {loading && <div className="status-box">ഹദീസ് ഡാറ്റ ലോഡ് ചെയ്യുന്നു...</div>}{dataError && <div className="status-box error"><strong>ഡാറ്റ ലോഡ് ചെയ്യാനായില്ല</strong><p>{dataError}</p></div>}
      {!loading && !dataError && <div className="content-layout"><div className={`filters-wrap ${mobileFilters ? 'filters-open' : ''}`}><FilterPanel hadiths={allHadiths} collection={collection} kitab={kitab} bab={bab} grade={grade} repeatsOnly={repeatsOnly} onCollection={setCollection} onKitab={setKitab} onBab={setBab} onGrade={setGrade} onRepeatsOnly={setRepeatsOnly} onReset={resetFilters}/></div><section className="results-section"><div className="results-toolbar"><div><span className="results-label">RESULTS</span><h3>{filtered.length.toLocaleString()} <span>നിവേദനങ്ങൾ</span></h3></div><div className="result-controls"><span className="data-indicator"><span/> FULL SOURCE DATA</span><label className="sort-control">നമ്പർ ക്രമത്തിൽ <select aria-label="Sort order" value="ascending" onChange={() => {}}><option value="ascending">↑</option></select></label></div></div>
        {visible.length > 0 ? <div className="cards-list">{visible.map(h => <HadithCard key={h.id} hadith={h}/>)}</div> : <div className="empty-state"><Search size={28}/><h3>ഫലം കണ്ടെത്തിയില്ല</h3><p>തിരച്ചിൽ വാക്കോ ഫിൽട്ടറുകളോ മാറ്റി നോക്കൂ.</p><button onClick={resetFilters}>എല്ലാ ഫിൽട്ടറുകളും നീക്കുക</button></div>}
        <Pagination page={page} totalPages={totalPages} onPage={setPage}/><div className="data-notice"><ShieldCheck size={17}/><p><strong>ഡാറ്റയെക്കുറിച്ചുള്ള കുറിപ്പ്</strong><br/>ഈ പേജ് ഡൗൺലോഡ് ചെയ്ത സോഴ്‌സ് റെക്കോർഡുകൾ പ്രദർശിപ്പിക്കുന്നു. ലഭ്യമായ ഇംഗ്ലീഷ് പാഠം കാണിക്കുന്നു; സ്ഥിരീകരിച്ച മലയാള പരിഭാഷയും കൃത്യമായ Kitab/Bab ക്രമീകരണവും പ്രത്യേകമായി പരിശോധിച്ച് ചേർക്കണം. ഗ്രേഡിംഗും ആവർത്തന ബന്ധങ്ങളും സോഴ്‌സിൽ നിന്ന് സ്ഥിരീകരിച്ചിട്ടില്ല.</p></div>
      </section></div>}
    </main><footer className="site-footer"><div className="footer-brand"><span className="brand-mark">ه</span><span>HADITH <b>LIBRARY</b></span></div><p>Built for careful reading, reliable references, and responsible study.</p><span className="footer-bottom">© 2026 Hadith Library</span></footer>
  </div>
}
