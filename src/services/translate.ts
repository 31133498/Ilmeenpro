export interface WordEntry {
  word: string
  meaning: string
  root: string
  type: 'noun' | 'verb' | 'particle' | 'adjective' | string
}

export async function translateWords(diacritized: string): Promise<WordEntry[]> {
  const apiKey = import.meta.env.VITE_OPENAI_API_KEY
  if (!apiKey) throw new Error('VITE_OPENAI_API_KEY is not set')

  const prompt = `Given this Arabic text: ${diacritized}

Return ONLY a JSON array, no explanation, no markdown:
[
  { "word": "arabic word with harakat", "meaning": "English meaning in context", "root": "3-letter Arabic root", "type": "noun|verb|particle|adjective" }
]

Include every word in order. For particles and conjunctions keep meaning short.`

  const res = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: 'gpt-4o-mini',
      messages: [{ role: 'user', content: prompt }],
      temperature: 0.1,
    }),
  })

  if (!res.ok) throw new Error(`Translation API error: ${res.status}`)

  const data = await res.json()
  const text: string = data.choices[0].message.content
  const clean = text.replace(/```(?:json)?/gi, '').trim()
  return JSON.parse(clean) as WordEntry[]
}
