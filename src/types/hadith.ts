export type Collection = 'Sahih al-Bukhari' | 'Sahih Muslim'
export type Grade = 'Sahih' | 'Hasan' | 'Daif' | 'Not independently graded'

export interface Hadith {
  id: string
  collection: Collection
  hadithNumber: number
  bookId: number
  chapterId: number
  kitabArabic: string
  kitabMalayalam: string
  babArabic: string
  babMalayalam: string
  narrator: string
  arabic: string
  english: string
  malayalam: string
  grade: Grade
  gradeSource: string
  repeatGroup?: string
  repeatNote?: string
  sourceUrl?: string
  demo?: boolean
}
