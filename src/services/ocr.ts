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
  const apiKey = import.meta.env.VITE_OPENAI_API_KEY
  if (!apiKey) throw new Error('VITE_OPENAI_API_KEY is not set')

  const base64 = await fileToBase64(file)
  const dataUrl = `data:${file.type};base64,${base64}`

  const res = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: 'gpt-4o',
      messages: [
        {
          role: 'user',
          content: [
            { type: 'image_url', image_url: { url: dataUrl, detail: 'high' } },
            { type: 'text', text: PROMPT },
          ],
        },
      ],
      temperature: 0.1,
      max_tokens: 4096,
    }),
  })

  if (!res.ok) {
    const body = await res.text().catch(() => '')
    throw new Error(`OCR API error: ${res.status} ${res.statusText}${body ? ' — ' + body : ''}`)
  }

  const data = await res.json()
  const text: string = data.choices[0].message.content
  const clean = text.replace(/```(?:json)?/gi, '').trim()
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
