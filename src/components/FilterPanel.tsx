import type { Hadith } from '../types/hadith'

interface Props {
  hadiths: Hadith[]
  collection: string
  kitab: string
  bab: string
  grade: string
  repeatsOnly: boolean
  onCollection: (value: string) => void
  onKitab: (value: string) => void
  onBab: (value: string) => void
  onGrade: (value: string) => void
  onRepeatsOnly: (value: boolean) => void
  onReset: () => void
}

export default function FilterPanel(props: Props) {
  const { hadiths } = props
  const unique = (values: string[]) => [...new Set(values.filter(Boolean))].sort((a, b) => a.localeCompare(b))
  const kitabOptions = unique(hadiths.map(h => `${h.kitabMalayalam} — ${h.kitabArabic}`))
  const babOptions = unique(hadiths.map(h => `${h.babMalayalam} — ${h.babArabic}`))
  return <aside className="filter-panel">
    <div className="filter-heading"><h3>ഫിൽട്ടറുകൾ</h3><button onClick={props.onReset}>Reset</button></div>
    <label>Collection<select value={props.collection} onChange={e => props.onCollection(e.target.value)}><option value="all">എല്ലാ ഗ്രന്ഥങ്ങളും</option><option value="Sahih al-Bukhari">സ്വഹീഹുൽ ബുഖാരി</option><option value="Sahih Muslim">സ്വഹീഹുൽ മുസ്‌ലിം</option></select></label>
    <label>കിതാബ് / Book<select value={props.kitab} onChange={e => props.onKitab(e.target.value)}><option value="all">എല്ലാ കിതാബുകളും</option>{kitabOptions.map(v => <option key={v} value={v}>{v}</option>)}</select></label>
    <label>ബാബ് / Chapter<select value={props.bab} onChange={e => props.onBab(e.target.value)}><option value="all">എല്ലാ ബാബുകളും</option>{babOptions.map(v => <option key={v} value={v}>{v}</option>)}</select></label>
    <label>Grading<select value={props.grade} onChange={e => props.onGrade(e.target.value)}><option value="all">എല്ലാം</option><option value="Sahih">Sahih</option><option value="Hasan">Hasan</option><option value="Daif">Daif</option><option value="Not independently graded">Not independently graded</option></select></label>
    <label className="checkbox-label"><input type="checkbox" checked={props.repeatsOnly} onChange={e => props.onRepeatsOnly(e.target.checked)} /> ബന്ധപ്പെട്ട നിവേദനങ്ങൾ മാത്രം</label>
  </aside>
}
