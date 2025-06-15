import { useState, useEffect } from 'react'

type Image = {
  url: string
  label?: string
}

type EnlargedImageModalProps = {
  images: Image[]
  isOpen: boolean
  onClose: () => void
  initialIndex?: number
}

const EnlargedImageModal = ({
  images,
  isOpen,
  onClose,
  initialIndex = 0,
}: EnlargedImageModalProps) => {
  const [currentIndex, setCurrentIndex] = useState(initialIndex)

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
    }
    return () => {
      document.body.style.overflow = 'unset'
    }
  }, [isOpen])

  if (!isOpen) return null

  const handlePrev = () =>
    setCurrentIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1))

  const handleNext = () =>
    setCurrentIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1))

  return (
    <div
      className="fixed inset-0 bg-black/80 backdrop-blur-lg z-50 flex items-center justify-center"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
    >
      <div
        className="relative max-w-4xl w-full mx-4 bg-white rounded-lg shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          aria-label="Close modal"
          className="absolute top-4 right-4 text-2xl font-bold text-gray-700 hover:text-gray-900 z-10"
        >
          &times;
        </button>

        <div className="relative aspect-square p-4">
          <img
            src={images[currentIndex].url}
            alt={
              images[currentIndex].label || `Product view ${currentIndex + 1}`
            }
            className="w-full h-full object-contain"
            data-testid="enlarged-image"
          />

          {images.length > 1 && (
            <>
              <div className="absolute top-1/2 left-4 right-4 flex justify-between transform -translate-y-1/2">
                <button
                  onClick={handlePrev}
                  aria-label="Previous image"
                  className="bg-white/80 hover:bg-[#d9c9b7] rounded-full p-2 shadow-md cursor-pointer transition-all"
                >
                  {'<'}
                </button>
                <button
                  onClick={handleNext}
                  aria-label="Next image"
                  className="bg-white/80 hover:bg-[#d9c9b7] rounded-full p-2 shadow-md transition-all"
                >
                  {'>'}
                </button>
              </div>

              <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-2">
                {images.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentIndex(index)}
                    aria-label={`View image ${index + 1}`}
                    className={`w-3 h-3 rounded-full transition-colors ${
                      index === currentIndex ? 'bg-gray-800' : 'bg-gray-300'
                    }`}
                  />
                ))}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  )
}

export default EnlargedImageModal
