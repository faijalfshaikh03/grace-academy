import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { ArrowRight, Camera, Heart, MessageCircle, Share2 } from 'lucide-react'
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

const categories = ['All', 'Academics', 'Sports', 'Cultural', 'Infrastructure', 'Activities', 'Events']

const GalleryPreview = () => {
  const [images, setImages] = useState(FALLBACK)
  const [selectedCategory, setSelectedCategory] = useState('All')
  const [likedImages, setLikedImages] = useState([])

  useEffect(() => {
    getGallery().then(res => { if (res.data.length) setImages(res.data) }).catch(() => {})
  }, [])

  const filtered = selectedCategory === 'All' ? images : images.filter(i => i.category === selectedCategory)

  const toggleLike = (id) => setLikedImages(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id])

  return (
    <section className="py-16 bg-gray-50">
      <div className="container-content">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">School <span className="text-gradient">Gallery</span></h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">Explore memorable moments and vibrant activities that make GA School special.</p>
          <div className="flex flex-wrap justify-center gap-2 mb-8">
            {categories.map((cat) => (
              <button key={cat} onClick={() => setSelectedCategory(cat)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${selectedCategory === cat ? 'bg-primary-600 text-white' : 'bg-white text-gray-700 hover:bg-primary-100 border border-gray-300'}`}>
                {cat}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {filtered.slice(0, 8).map((item) => (
            <div key={item._id} className="group relative overflow-hidden rounded-xl shadow-lg hover-lift">
              <div className="aspect-square overflow-hidden">
                <img src={item.src} alt={item.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
              </div>
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <div className="absolute bottom-0 left-0 right-0 p-4 text-white">
                  <h3 className="font-semibold text-lg mb-1">{item.title}</h3>
                  <p className="text-sm text-gray-200">{item.category}</p>
                </div>
              </div>
              <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <button className="w-8 h-8 bg-white/90 rounded-full flex items-center justify-center hover:bg-white"><Share2 size={14} className="text-gray-700" /></button>
              </div>
              <div className="absolute bottom-4 left-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex space-x-2">
                <button onClick={() => toggleLike(item._id)} className="flex items-center space-x-1 bg-white/90 px-2 py-1 rounded-full hover:bg-white">
                  <Heart size={14} className={likedImages.includes(item._id) ? 'text-red-500 fill-current' : 'text-gray-700'} />
                  <span className="text-xs text-gray-700">{likedImages.includes(item._id) ? item.likes + 1 : item.likes}</span>
                </button>
                <div className="flex items-center space-x-1 bg-white/90 px-2 py-1 rounded-full">
                  <MessageCircle size={14} className="text-gray-700" />
                  <span className="text-xs text-gray-700">{item.comments}</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="text-center">
          <Link to="/gallery" className="btn-primary inline-flex items-center">View Full Gallery <Camera size={20} className="ml-2" /></Link>
        </div>
      </div>
    </section>
  )
}

export default GalleryPreview
