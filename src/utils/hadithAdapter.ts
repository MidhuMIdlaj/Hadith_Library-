import type { Collection, Hadith } from '../types/hadith'

interface SourceBookName {
  id: number
  arabic?: string
  english?: string
  name?: string
}
interface SourceChapter {
  id: number
  bookId: number
  arabic?: string
  english?: string
}
interface SourceHadith {
  id: number
  idInBook: number
  chapterId: number
  bookId: number
  arabic?: string
  english?: { narrator?: string; text?: string }
}
export interface SourceCollection {
  metadata?: { length?: number; arabic?: { title?: string }; english?: { title?: string } }
  books?: SourceBookName[]
  chapters: SourceChapter[]
  hadiths: SourceHadith[]
}

export function adaptHadiths(source: SourceCollection, collection: Collection): Hadith[] {
  const chaptersById = new Map(source.chapters.map(chapter => [chapter.id, chapter]))
  const booksById = new Map((source.books ?? []).map(book => [book.id, book]))

  return source.hadiths.map(item => {
    const chapter = chaptersById.get(item.chapterId)
    const book = booksById.get(item.bookId)
    const bookArabic = book?.arabic ?? ''
    const bookEnglish = book?.english ?? book?.name ?? ''
    const chapterArabic = chapter?.arabic ?? ''
    const chapterEnglish = chapter?.english ?? ''

    return {
      id: `${collection.replace(/\s+/g, '-')}-${item.id}`,
      collection,
      hadithNumber: item.idInBook,
      bookId: item.bookId,
      chapterId: item.chapterId,
      kitabArabic: bookArabic,
      kitabMalayalam: bookEnglish || `Kitab ${item.bookId}`,
      babArabic: chapterArabic,
      babMalayalam: chapterEnglish || `Chapter ${item.chapterId}`,
      narrator: item.english?.narrator?.trim() || 'Narrator not provided',
      arabic: item.arabic ?? '',
      english: (item.english?.text ?? '').replace(/\s+/g, ' ').trim(),
      malayalam: '',
      grade: 'Not independently graded' as const,
      gradeSource: 'No grading field in this dataset',
      demo: false,
    }
  })
}
