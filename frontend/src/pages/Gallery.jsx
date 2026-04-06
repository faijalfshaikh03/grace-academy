import { useState, useEffect, useCallback } from 'react'
import Header from '../components/Header'
import Footer from '../components/Footer'
import { Heart, MessageCircle, Share2, X, ChevronLeft, ChevronRight, ZoomIn } from 'lucide-react'
import { getGallery } from '../api'

const FALLBACK = [
  { _id: '1', src: 'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?auto=format&fit=crop&w=400&q=80', title: 'Classroom Learning', category: 'Academics', likes: 45, comments: 12 },
  { _id: '2', src: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?auto=format&fit=crop&w=400&q=80', title: 'Sports Competition', category: 'Sports', likes: 67, comments: 23 },
  { _id: '3', src: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?auto=format&fit=crop&w=400&q=80', title: 'Cultural Performance', category: 'Cultural', likes: 89, comments: 34 },
  { _id: '4', src: 'https://images.unsplash.com/photo-1580582932707-520aed937b7b?auto=format&fit=crop&w=400&q=80', title: 'School Campus', category: 'Infrastructure', likes: 56, comments: 8 },
  { _id: '5', src: 'https://images.unsplash.com/photo-1532094349884-543bc11b234d?auto=format&fit=crop&w=400&q=80', title: 'Science Exhibition', category: 'Academics', likes: 72, comments: 19 },
  { _id: '6', src: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=400&q=80', title: 'Art Workshop', category: 'Activities', likes: 48, comments: 15 },
  { _id: '7', src: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?auto=format&fit=crop&w=400&q=80', title: 'Annual Function', category: 'Events', likes: 93, comments: 41 },
  { _id: '8', src: 'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?auto=format&fit=crop&w=400&q=80', title: 'Library Time', category: 'Academics', likes: 61, comments: 11 },
]

const cats = ['All', 'Academics', 'Sports', 'Cultural', 'Infrastructure', 'Activities', 'Events']

export default function Gallery() {
  const [images, setImages] = useState(FALLBACK)
  const [selected, setSelected] = useState('All')
  const [liked, setLiked] = useState([])
  const [lightbox, setLightbox] = useState(null) // index into filtered array

  useEffect(() => {
    getGallery().then(res => { if (res.data.length) setImages(res.data) }).catch(() => {})
  }, [])

  const filtered = selected === 'All' ? images : images.filter(i => i.category === selected)
  const toggleLike = (id) => setLiked(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id])

  const openLightbox = (idx) => { setLightbox(idx); document.body.style.overflow = 'hidden' }
  const closeLightbox = useCallback(() => { setLightbox(null); document.body.style.overflow = '' }, [])
  const goPrev = useCallback(() => setLightbox(i => (i - 1 + filtered.length) % filtered.length), [filtered.length])
  const goNext = useCallback(() => setLightbox(i => (i + 1) % filtered.length), [filtered.length])

  useEffect(() => {
    if (lightbox === null) return
    const handler = (e) => {
      if (e.key === 'Escape') closeLightbox()
      if (e.key === 'ArrowLeft') goPrev()
      if (e.key === 'ArrowRight') goNext()
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [lightbox, closeLightbox, goPrev, goNext])

  const currentImage = lightbox !== null ? filtered[lightbox] : null

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <div className="bg-primary-900 text-white py-16">
        <div className="container-content text-center">
          <h1 className="text-4xl font-bold mb-4">School <span className="text-gradient">Gallery</span></h1>
          <p className="text-xl text-gray-300">Explore memorable moments and vibrant activities</p>
        </div>
      </div>
      <div className="container-content py-12">
        <div className="flex flex-wrap justify-center gap-2 mb-8">
          {cats.map(c => <button key={c} onClick={() => setSelected(c)} className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${selected === c ? 'bg-primary-600 text-white' : 'bg-white text-gray-700 hover:bg-primary-100 border border-gray-300'}`}>{c}</button>)}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filtered.map((item, idx) => (
            <div key={item._id} className="group relative overflow-hidden rounded-xl shadow-lg hover-lift cursor-pointer"
              onClick={() => openLightbox(idx)}>
              <div className="aspect-square overflow-hidden">
                <img src={item.src} alt={item.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
              </div>
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <div className="absolute bottom-0 left-0 right-0 p-4 text-white">
                  <h3 className="font-semibold mb-1">{item.title}</h3>
                  <p className="text-sm text-gray-200">{item.category}</p>
                </div>
              </div>
              {/* Zoom icon hint */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <div className="w-12 h-12 bg-white/30 backdrop-blur-sm rounded-full flex items-center justify-center border border-white/50">
                  <ZoomIn size={22} className="text-white" />
                </div>
              </div>
              <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <button onClick={e => { e.stopPropagation(); navigator.share?.({ title: item.title, url: item.src }) }}
                  className="w-8 h-8 bg-white/90 rounded-full flex items-center justify-center hover:bg-white">
                  <Share2 size={14} className="text-gray-700" />
                </button>
              </div>
              <div className="absolute bottom-4 left-4 opacity-0 group-hover:opacity-100 transition-opacity flex space-x-2">
                <button onClick={e => { e.stopPropagation(); toggleLike(item._id) }}
                  className="flex items-center space-x-1 bg-white/90 px-2 py-1 rounded-full hover:bg-white">
                  <Heart size={14} className={liked.includes(item._id) ? 'text-red-500 fill-current' : 'text-gray-700'} />
                  <span className="text-xs text-gray-700">{liked.includes(item._id) ? item.likes + 1 : item.likes}</span>
                </button>
                <div className="flex items-center space-x-1 bg-white/90 px-2 py-1 rounded-full">
                  <MessageCircle size={14} className="text-gray-700" /><span className="text-xs text-gray-700">{item.comments}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      <Footer />

      {/* ── Lightbox Modal ─────────────────────────────────────── */}
      {currentImage && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center"
          style={{ background: 'rgba(0,0,0,0.92)', backdropFilter: 'blur(6px)', animation: 'fadeIn 0.2s ease' }}
          onClick={closeLightbox}
        >
          <style>{`
            @keyframes fadeIn { from { opacity: 0 } to { opacity: 1 } }
            @keyframes scaleIn { from { opacity: 0; transform: scale(0.92) } to { opacity: 1; transform: scale(1) } }
          `}</style>

          {/* Close button */}
          <button onClick={closeLightbox}
            className="absolute top-5 right-5 w-10 h-10 bg-white/10 hover:bg-white/25 rounded-full flex items-center justify-center transition-colors z-10"
            title="Close (Esc)">
            <X size={22} className="text-white" />
          </button>

          {/* Counter */}
          <div className="absolute top-5 left-1/2 -translate-x-1/2 text-white/70 text-sm select-none">
            {lightbox + 1} / {filtered.length}
          </div>

          {/* Prev arrow */}
          <button onClick={e => { e.stopPropagation(); goPrev() }}
            className="absolute left-4 w-12 h-12 bg-white/10 hover:bg-white/25 rounded-full flex items-center justify-center transition-colors z-10"
            title="Previous (←)">
            <ChevronLeft size={28} className="text-white" />
          </button>

          {/* Image */}
          <div
            className="relative mx-20"
            style={{ maxWidth: '90vw', maxHeight: '90vh', animation: 'scaleIn 0.25s ease' }}
            onClick={e => e.stopPropagation()}
          >
            <img
              src={currentImage.src?.replace('w=400', 'w=1200') ?? currentImage.src}
              alt={currentImage.title}
              className="rounded-xl shadow-2xl object-contain"
              style={{ maxWidth: '85vw', maxHeight: '80vh' }}
            />
            {/* Caption */}
            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent rounded-b-xl px-5 py-4">
              <h3 className="text-white font-semibold text-lg">{currentImage.title}</h3>
              <span className="text-white/60 text-sm">{currentImage.category}</span>
            </div>
          </div>

          {/* Next arrow */}
          <button onClick={e => { e.stopPropagation(); goNext() }}
            className="absolute right-4 w-12 h-12 bg-white/10 hover:bg-white/25 rounded-full flex items-center justify-center transition-colors z-10"
            title="Next (→)">
            <ChevronRight size={28} className="text-white" />
          </button>
        </div>
      )}
    </div>
  )
}


