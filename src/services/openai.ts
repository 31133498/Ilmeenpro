export interface OcrResult {
  raw: string
  diacritized: string
}

export async function extractArabicText(file: File): Promise<OcrResult> {
  const apiKey = import.meta.env.VITE_OPENAI_API_KEY
  if (!apiKey) throw new Error('VITE_OPENAI_API_KEY is not set')

  const base64 = await fileToBase64(file)

  const res = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'content-type': 'application/json',
      authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: 'gpt-4o',
      max_tokens: 2000,
      messages: [
        {
          role: 'user',
          content: [
            {
              type: 'image_url',
              image_url: {
                url: `data:${file.type};base64,${base64}`,
              },
            },
            {
              type: 'text',
              text: 'Extract all Arabic text from this image. Then rewrite the full extracted text with complete tashkeel (harakat/diacritics) added correctly based on linguistic and grammatical context. Return ONLY a JSON object, no explanation, no markdown backticks: { "raw": "extracted text without diacritics", "diacritized": "same text with full harakat added" }',
            },
          ],
        },
      ],
    }),
  })

  if (!res.ok) throw new Error(`OpenAI API error: ${res.status} ${res.statusText}`)

  const data = await res.json()
  const raw: string = data.choices[0].message.content
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
