import { useRef } from 'react'
import { Camera } from 'lucide-react'

interface Props {
  onFile: (file: File) => void
  disabled: boolean
}

export default function ImageUploader({ onFile, disabled }: Props) {
  const fileRef = useRef<HTMLInputElement>(null)
  const cameraRef = useRef<HTMLInputElement>(null)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) onFile(file)
    e.target.value = ''
  }

  return (
    <div className="flex flex-col items-center gap-4">
      <div
        onClick={() => !disabled && fileRef.current?.click()}
        className={`w-full max-w-lg border-2 border-dashed border-gold/40 rounded-lg p-10 text-center cursor-pointer transition-colors
          ${disabled ? 'opacity-50 cursor-not-allowed' : 'hover:border-gold hover:bg-gold-pale/30'}`}
      >
        <Camera className="w-12 h-12 mb-3 text-ink-muted" />
        <p className="text-ink font-medium mb-1">Drop an image or click to upload</p>
        <p className="text-ink-muted text-sm">JPG, PNG, WEBP — any Arabic text</p>
      </div>

      <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleChange} />

      <button
        disabled={disabled}
        onClick={() => cameraRef.current?.click()}
        className="flex items-center gap-2 px-5 py-2.5 rounded-full border border-gold/30 text-ink-muted text-sm
          hover:border-gold hover:text-ink transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <Camera className="w-4 h-4 mr-1" /> Use camera
      </button>
      <input ref={cameraRef} type="file" accept="image/*" capture="environment" className="hidden" onChange={handleChange} />
    </div>
  )
}
