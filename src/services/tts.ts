export interface TtsResult {
  source: AudioBufferSourceNode
  arrayBuffer: ArrayBuffer
}

async function speakArabic(text: string, speed?: number): Promise<TtsResult> {

  const response = await fetch('https://api.openai.com/v1/audio/speech', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${import.meta.env.VITE_OPENAI_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: 'tts-1',
      input: text,
      voice: 'nova',
      speed: speed || 0.9,
    }),

  })

  if (!response.ok) throw new Error(`TTS failed: ${response.status} ${response.statusText}`)

  const arrayBuffer = await response.arrayBuffer()
  const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)()
  const audioBuffer = await audioContext.decodeAudioData(arrayBuffer)
  const source = audioContext.createBufferSource()
  source.buffer = audioBuffer
  source.connect(audioContext.destination)
  source.start(0)
  return { source, arrayBuffer }
}

export default speakArabic

