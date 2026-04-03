export interface OcrResult {
  raw: string
  diacritized: string
}

const PROMPT = `You are an expert Arabic linguist and OCR engine. 
Your job is to extract Arabic text from images with perfect accuracy.

Instructions:
1. Extract every Arabic word exactly as it appears, preserving the original line breaks and poem structure. Each line in the image must be a separate line in your output. Do not merge lines.
2. Rewrite the full extracted text with complete and correct tashkeel (harakat) — fathah, kasrah, dammah, sukun, shaddah, tanwin — placed correctly on every word based on proper Arabic grammar and the meaning of the text.
3. If the text is a poem, preserve the poetic line structure exactly. Do not reformat it into prose.

Return ONLY this JSON, no explanation, no markdown, no backticks:
{
  "raw": "extracted text preserving original line breaks with \\n",
  "diacritized": "same structure with full harakat on every word, preserving \\n line breaks"
}`

export async function extractArabicText(file: File): Promise<OcrResult> {
  const apiKey = import.meta.env.VITE_GEMINI_API_KEY
  if (!apiKey) throw new Error('VITE_GEMINI_API_KEY is not set')

  const base64 = await fileToBase64(file)

  const body = JSON.stringify({
    contents: [
      {
        parts: [
          { inline_data: { mime_type: file.type, data: base64 } },
          { text: PROMPT },
        ],
      },
    ],
  })

  const doFetch = () =>
    fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`,
      { method: 'POST', headers: { 'content-type': 'application/json' }, body }
    )

  let res = await doFetch()

  if (res.status === 429) {
    await new Promise(resolve => setTimeout(resolve, 3000))
    res = await doFetch()
  }

  if (!res.ok) throw new Error(`Gemini API error: ${res.status} ${res.statusText}`)

  const data = await res.json()
  const raw: string = data.candidates[0].content.parts[0].text
  const clean = raw.replace(/```(?:json)?/gi, '').trim()
  return JSON.parse(clean) as OcrResult
}

function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => resolve((reader.result as string).split(',')[1])
    reader.onerror = reject
    reader.readAsDataURL(file)
  })
}
