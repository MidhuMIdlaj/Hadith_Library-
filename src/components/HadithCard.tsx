import { Bookmark, ExternalLink, Hash } from 'lucide-react'
import { useState } from 'react'
import type { Hadith } from '../types/hadith'

export default function HadithCard({ hadith }: { hadith: Hadith }) {
  const [saved, setSaved] = useState(() => {
    try { return (JSON.parse(localStorage.getItem('saved-hadiths') || '[]') as string[]).includes(hadith.id) } catch { return false }
  })

  function toggleSaved() {
    let ids: string[] = []
    try { ids = JSON.parse(localStorage.getItem('saved-hadiths') || '[]') as string[] } catch { ids = [] }
    const next = saved ? ids.filter(id => id !== hadith.id) : [...ids, hadith.id]
    localStorage.setItem('saved-hadiths', JSON.stringify(next))
    setSaved(!saved)
  }

  return <article className="hadith-card">
    <div className="card-topline">
      <div className="reference-chip"><Hash size={13} /> {hadith.collection === 'Sahih al-Bukhari' ? 'ബുഖാരി' : 'മുസ്‌ലിം'} · {hadith.hadithNumber}</div>
      <button className={`icon-button ${saved ? 'is-saved' : ''}`} onClick={toggleSaved} title={saved ? 'Remove bookmark' : 'Bookmark hadith'} aria-label={saved ? 'Remove bookmark' : 'Bookmark hadith'}><Bookmark size={17} fill={saved ? 'currentColor' : 'none'} /></button>
    </div>
    <div className="meta-grid">
      <div><span>കിതാബ് / Book</span><strong>{hadith.kitabMalayalam}</strong>{hadith.kitabArabic && <small dir="rtl">{hadith.kitabArabic}</small>}</div>
      <div><span>ബാബ് / Chapter</span><strong>{hadith.babMalayalam}</strong>{hadith.babArabic && <small dir="rtl">{hadith.babArabic}</small>}</div>
    </div>
    <div className="hadith-section"><div className="section-title"><span className="section-dot arabic-dot" /> അറബി മൂലപാഠം <span className="english-label">ARABIC ORIGINAL</span></div><p className="arabic-text" dir="rtl" lang="ar">{hadith.arabic || 'Arabic text unavailable'}</p></div>
    <div className="hadith-section translation-section"><div className="section-title"><span className="section-dot english-dot" /> English translation <span className="english-label">ENGLISH</span></div><p className="translation-text">{hadith.english || 'English text unavailable in this record.'}</p></div>
    <div className="hadith-section translation-section"><div className="section-title"><span className="section-dot malayalam-dot" /> മലയാള പരിഭാഷ <span className="english-label">MALAYALAM</span></div><p className="malayalam-text">{hadith.malayalam || 'വിശ്വസനീയമായ മലയാള പരിഭാഷ ഇതുവരെ ചേർത്തിട്ടില്ല.'}</p></div>
    <div className="card-footer"><div className="narrator"><span>റാവി / Narrator</span><strong>{hadith.narrator}</strong></div><div className="grade-area"><span className="grade-pill grade-unknown">സ്വതന്ത്രമായി ഗ്രേഡ് ചെയ്തിട്ടില്ല</span><small>{hadith.gradeSource}</small></div></div>
    {hadith.sourceUrl && <a className="source-link" href={hadith.sourceUrl} target="_blank" rel="noreferrer">ഉറവിടം പരിശോധിക്കുക <ExternalLink size={13} /></a>}
  </article>
}
