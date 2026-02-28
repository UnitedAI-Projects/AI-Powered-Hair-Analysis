import { useRef, useState } from 'react'

export default function PhotoUploadZone({ photoType, image, onUpload }) {
  const inputRef = useRef(null)
  const [isDragging, setIsDragging] = useState(false)

  const convertToBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader()
      reader.onload = () => resolve(reader.result)
      reader.onerror = reject
      reader.readAsDataURL(file)
    })
  }

  const handleFileSelect = async (file) => {
    if (file && file.type.startsWith('image/')) {
      const base64 = await convertToBase64(file)
      onUpload(base64)
    }
  }

  const handleClick = () => {
    inputRef.current?.click()
  }

  const handleInputChange = (e) => {
    const file = e.target.files?.[0]
    if (file) {
      handleFileSelect(file)
    }
  }

  const handleDragEnter = (e) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(true)
  }

  const handleDragLeave = (e) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(false)
  }

  const handleDragOver = (e) => {
    e.preventDefault()
    e.stopPropagation()
  }

  const handleDrop = (e) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(false)

    const file = e.dataTransfer.files?.[0]
    if (file) {
      handleFileSelect(file)
    }
  }

  return (
    <div>
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        onChange={handleInputChange}
        className="hidden"
      />

      {image ? (
        <div className="relative">
          <img
            src={image}
            alt={photoType.label}
            className="w-full h-64 object-cover rounded-2xl shadow-lg"
          />
          <button
            onClick={handleClick}
            className="absolute inset-0 flex items-center justify-center bg-purple-deep bg-opacity-0 hover:bg-opacity-40 rounded-2xl transition-all duration-200 opacity-0 hover:opacity-100 group"
          >
            <span className="text-white font-semibold">Change photo</span>
          </button>
        </div>
      ) : (
        <button
          onClick={handleClick}
          onDragEnter={handleDragEnter}
          onDragLeave={handleDragLeave}
          onDragOver={handleDragOver}
          onDrop={handleDrop}
          className={`w-full p-8 border-2 border-dashed rounded-2xl transition-all duration-200 flex flex-col items-center justify-center h-64 ${
            isDragging
              ? 'border-purple-primary bg-lavender'
              : 'border-purple-medium bg-cream hover:border-purple-primary'
          }`}
        >
          <p className="text-4xl mb-3">{photoType.emoji}</p>
          <p className="font-semibold text-purple-deep text-lg">{photoType.label}</p>
          <p className="text-purple-deep opacity-70 text-sm mt-2 text-center">
            {photoType.description}
          </p>
          <p className="text-purple-medium text-xs mt-4">
            Drag and drop or click to upload
          </p>
        </button>
      )}
    </div>
  )
}
