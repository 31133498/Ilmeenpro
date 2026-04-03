import type { WordEntry } from './translate'

export interface Session {
  id: string
  createdAt: string
  title: string
  raw: string
  diacritized: string
  wordMap: WordEntry[]
  memorizedLines: number[]
  image: string
  audio?: string

}

const KEY = 'ilmeen_sessions'

export function loadSessions(): Session[] {
  try {
    return JSON.parse(localStorage.getItem(KEY) ?? '[]')
  } catch {
    return []
  }
}

export function saveSession(session: Session): void {
  const sessions = loadSessions()
  sessions.unshift(session)
  localStorage.setItem(KEY, JSON.stringify(sessions))
}

export function deleteSession(id: string): void {
  const sessions = loadSessions().filter(s => s.id !== id)
  localStorage.setItem(KEY, JSON.stringify(sessions))
}

export function updateMemorized(id: string, memorizedLines: number[]): void {
  const sessions = loadSessions().map(s => s.id === id ? { ...s, memorizedLines } : s)
  localStorage.setItem(KEY, JSON.stringify(sessions))
}

export function buildSession(
  raw: string,
  diacritized: string,
  wordMap: WordEntry[],
  imageFile: File
): Promise<Session> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => {
      const title = raw.trim().split(/\s+/).slice(0, 4).join(' ') + '…'
      resolve({
        id: crypto.randomUUID(),
        createdAt: new Date().toISOString(),
        title,
        raw,
        diacritized,
        wordMap,
        memorizedLines: [],
        image: reader.result as string,
      })
    }
    reader.onerror = reject
    reader.readAsDataURL(imageFile)
  })
}
