import { useState } from 'react'
import EnlargedImageModal from './enlarged-image-modal'

type Image = {
  url: string
  label?: string
}

type Props = {
  images: Image[]
}

const ImageSlider = ({ images }: Props) => {
  const [modalOpen, setModalOpen] = useState(false)
  const [current, setCurrent] = useState(0)

  if (!images || images.length === 0) {
    return <p className="text-gray-500">No images available</p>
  }

  const hasMultiple = images.length > 1

  const prevSlide = () =>
    setCurrent((prev) => (prev === 0 ? images.length - 1 : prev - 1))
  const nextSlide = () =>
    setCurrent((prev) => (prev === images.length - 1 ? 0 : prev + 1))
  const goToSlide = (index: number) => setCurrent(index)

  return (
    <>
      <div
        className="relative w-full aspect-square rounded-lg overflow-hidden shadow-md cursor-zoom-in"
        onClick={() => setModalOpen(true)}
      >
        <img
          src={images[current].url}
          alt={images[current].label ?? `Product image ${current + 1}`}
          className="w-full h-full object-cover"
        />

        {hasMultiple && (
          <>
            <button
              onClick={prevSlide}
              className="absolute top-1/2 left-2 transform -translate-y-1/2 bg-white bg-opacity-70 rounded-full p-1 hover:scale-105 transition"
            >
              ◀
            </button>
            <button
              onClick={nextSlide}
              className="absolute top-1/2 right-2 transform -translate-y-1/2 bg-white bg-opacity-70 rounded-full p-1 hover:scale-105 transition"
            >
              ▶
            </button>

            <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 flex gap-2">
              {images.map((_, i) => (
                <button
                  key={i}
                  onClick={() => goToSlide(i)}
                  className={`w-2.5 h-2.5 rounded-full ${
                    current === i ? 'bg-white' : 'bg-white/50'
                  }`}
                />
              ))}
            </div>
          </>
        )}
      </div>
      <EnlargedImageModal
        images={images}
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        initialIndex={current}
      />
    </>
  )
}

export default ImageSlider
