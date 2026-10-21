import { ChevronLeft, ChevronRight } from 'lucide-react'
export default function Pagination({ page, totalPages, onPage }: { page: number; totalPages: number; onPage: (page: number) => void }) {
  if (totalPages <= 1) return null
  return <nav className="pagination" aria-label="Pagination">
    <button disabled={page <= 1} onClick={() => onPage(page - 1)}><ChevronLeft size={16} /> മുമ്പ്</button>
    <span>പേജ് <strong>{page}</strong> / {totalPages}</span>
    <button disabled={page >= totalPages} onClick={() => onPage(page + 1)}>അടുത്തത് <ChevronRight size={16} /></button>
  </nav>
}
