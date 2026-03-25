import { useState, useEffect, useRef } from 'react'

const ImageSlider = ({ images, autoAdvanceInterval = 4000, transitionDuration = 600 }) => {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isTransitioning, setIsTransitioning] = useState(false)
  const intervalRef = useRef(null)

  const goToNext = () => {
    if (!isTransitioning) {
      setIsTransitioning(true)
      setCurrentIndex(prev => (prev + 1) % images.length)
      setTimeout(() => setIsTransitioning(false), transitionDuration)
    }
  }

  useEffect(() => {
    intervalRef.current = setInterval(goToNext, autoAdvanceInterval)
    return () => clearInterval(intervalRef.current)
  }, [currentIndex, images.length, autoAdvanceInterval])

  return (
    <div className="w-full h-full relative overflow-hidden">
      {images.map((image, index) => (
        <div
          key={index}
          className="absolute inset-0 transition-opacity"
          style={{
            opacity: index === currentIndex ? 1 : 0,
            transitionDuration: `${transitionDuration}ms`,
          }}
        >
          <img src={image.src} alt={image.alt} className="w-full h-full object-cover" />
        </div>
      ))}
    </div>
  )
}

export default ImageSlider
