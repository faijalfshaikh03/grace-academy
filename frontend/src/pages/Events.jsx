import { useState, useEffect } from 'react'
import Header from '../components/Header'
import Footer from '../components/Footer'
import { Calendar, Clock, MapPin, User, Search, X } from 'lucide-react'
import { getEvents } from '../api'

const FALLBACK = [
  { _id: '1', title: 'Annual Science Exhibition 2024', type: 'event', date: '2024-03-15', time: '9:00 AM - 4:00 PM', location: 'School Auditorium', image: 'https://images.unsplash.com/photo-1532094349884-543bc11b234d?auto=format&fit=crop&w=600&q=80', excerpt: 'Join us for an exciting showcase of scientific innovations by our talented students.', category: 'Academic' },
  { _id: '2', title: 'Sports Day Championship 2024', type: 'event', date: '2024-03-20', time: '8:00 AM - 5:00 PM', location: 'School Ground', image: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?auto=format&fit=crop&w=600&q=80', excerpt: 'Annual sports day featuring various athletic competitions for all grades.', category: 'Sports' },
  { _id: '3', title: 'Outstanding Performance in Board Exams', type: 'news', date: '2024-02-28', author: 'Principal', image: 'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?auto=format&fit=crop&w=600&q=80', excerpt: 'Students achieved remarkable results in board examinations with 95% pass rate.', category: 'Achievement' },
  { _id: '4', title: 'Cultural Festival - Unity in Diversity', type: 'event', date: '2024-04-05', time: '10:00 AM - 8:00 PM', location: 'School Campus', image: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?auto=format&fit=crop&w=600&q=80', excerpt: 'Celebrating our diverse culture through music, dance, drama, and traditional arts.', category: 'Cultural' },
  { _id: '5', title: 'New Computer Lab Inauguration', type: 'news', date: '2024-02-25', author: 'Admin', image: 'https://images.unsplash.com/photo-1581078426770-6d336e5de7bf?auto=format&fit=crop&w=600&q=80', excerpt: 'State-of-the-art computer lab with 30 new systems to enhance digital learning.', category: 'Infrastructure' },
  { _id: '6', title: 'Parent Workshop: Digital Parenting', type: 'event', date: '2024-03-10', time: '2:00 PM - 4:00 PM', location: 'Conference Hall', image: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=600&q=80', excerpt: 'Interactive workshop for parents on navigating digital challenges for children.', category: 'Workshop' },
]

const catColor = { Academic: 'bg-blue-100 text-blue-800', Sports: 'bg-green-100 text-green-800', Achievement: 'bg-yellow-100 text-yellow-800', Cultural: 'bg-purple-100 text-purple-800', Infrastructure: 'bg-gray-100 text-gray-800', Workshop: 'bg-orange-100 text-orange-800' }
const types = ['All', 'event', 'news']

export default function Events() {
  const [items, setItems] = useState(FALLBACK)
  const [search, setSearch] = useState('')
  const [type, setType] = useState('All')
  const [selected, setSelected] = useState(null)

  useEffect(() => {
    getEvents().then(res => { if (res.data.length) setItems(res.data) }).catch(() => {})
  }, [])

  // Close modal on Escape key
  useEffect(() => {
    const handleKey = (e) => { if (e.key === 'Escape') setSelected(null) }
    window.addEventListener('keydown', handleKey)
    return () => window.removeEventListener('keydown', handleKey)
  }, [])

  const filtered = items.filter(i => (type === 'All' || i.type === type) && (i.title.toLowerCase().includes(search.toLowerCase()) || i.excerpt.toLowerCase().includes(search.toLowerCase())))
  const formatDate = (d) => new Date(d).toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' })

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <div className="bg-primary-900 text-white py-16">
        <div className="container-content text-center">
          <h1 className="text-4xl font-bold mb-4">Events & <span className="text-gradient">News</span></h1>
          <p className="text-xl text-gray-300">Latest happenings, achievements, and upcoming events at Grace Academy</p>
        </div>
      </div>
      <div className="container-content py-12">
        <div className="flex flex-col md:flex-row gap-4 mb-8">
          <div className="relative flex-1">
            <Search size={20} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input type="text" placeholder="Search events & news..." value={search} onChange={e => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500" />
          </div>
          <div className="flex gap-2">
            {types.map(t => (
              <button key={t} onClick={() => setType(t)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors capitalize ${type === t ? 'bg-primary-600 text-white' : 'bg-white text-gray-700 hover:bg-primary-100 border border-gray-300'}`}>{t}</button>
            ))}
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filtered.map(item => (
            <article key={item._id} className="card group cursor-pointer" onClick={() => setSelected(item)}>
              <div className="relative h-48 overflow-hidden">
                <img src={item.image} alt={item.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                <div className="absolute top-4 left-4"><span className={`px-3 py-1 rounded-full text-xs font-medium ${catColor[item.category] || 'bg-gray-100 text-gray-800'}`}>{item.category}</span></div>
                <div className="absolute top-4 right-4"><span className={`px-3 py-1 rounded-full text-xs font-medium ${item.type === 'event' ? 'bg-primary-600 text-white' : 'bg-secondary-500 text-white'}`}>{item.type === 'event' ? 'Event' : 'News'}</span></div>
              </div>
              <div className="card-content">
                <h3 className="text-xl font-semibold text-gray-900 mb-2">{item.title}</h3>
                <p className="text-gray-600 mb-4 line-clamp-2">{item.excerpt}</p>
                <div className="space-y-1 text-sm text-gray-500">
                  <div className="flex items-center"><Calendar size={14} className="mr-2" />{formatDate(item.date)}</div>
                  {item.time && <div className="flex items-center"><Clock size={14} className="mr-2" />{item.time}</div>}
                  {item.location && <div className="flex items-center"><MapPin size={14} className="mr-2" />{item.location}</div>}
                  {item.author && <div className="flex items-center"><User size={14} className="mr-2" />{item.author}</div>}
                </div>
              </div>
            </article>
          ))}
        </div>
        {filtered.length === 0 && <div className="text-center py-12 text-gray-500"><p>No events found matching your criteria.</p></div>}
      </div>

      {/* EVENT DETAIL POPUP */}
      {selected && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" onClick={() => setSelected(null)}>
          {/* Backdrop */}
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm"></div>

          {/* Modal */}
          <div className="relative bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden" onClick={e => e.stopPropagation()}
            style={{ animation: 'slideUp 0.3s ease-out' }}>
            
            {/* Close Button */}
            <button onClick={() => setSelected(null)}
              className="absolute top-4 right-4 z-10 w-9 h-9 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center shadow-lg hover:bg-white hover:scale-110 transition-all border border-gray-200">
              <X size={18} className="text-gray-700" />
            </button>

            {/* Image */}
            {selected.image && (
              <div className="relative h-64 overflow-hidden">
                <img src={selected.image} alt={selected.title} className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent"></div>
                <div className="absolute bottom-4 left-5 right-14">
                  <div className="flex gap-2 mb-2">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${catColor[selected.category] || 'bg-gray-100 text-gray-800'}`}>{selected.category}</span>
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${selected.type === 'event' ? 'bg-primary-600 text-white' : 'bg-secondary-500 text-white'}`}>{selected.type === 'event' ? 'Event' : 'News'}</span>
                  </div>
                  <h2 className="text-2xl font-bold text-white leading-tight">{selected.title}</h2>
                </div>
              </div>
            )}

            {/* Content */}
            <div className="p-6 overflow-y-auto" style={{ maxHeight: 'calc(90vh - 256px)' }}>
              {!selected.image && (
                <>
                  <div className="flex gap-2 mb-3">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${catColor[selected.category] || 'bg-gray-100 text-gray-800'}`}>{selected.category}</span>
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${selected.type === 'event' ? 'bg-primary-600 text-white' : 'bg-secondary-500 text-white'}`}>{selected.type === 'event' ? 'Event' : 'News'}</span>
                  </div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-4">{selected.title}</h2>
                </>
              )}

              {/* Details Grid */}
              <div className="grid grid-cols-2 gap-3 mb-5">
                <div className="flex items-center gap-2.5 bg-gray-50 rounded-xl px-4 py-3">
                  <Calendar size={18} className="text-primary-600" />
                  <div>
                    <p className="text-xs text-gray-500">Date</p>
                    <p className="text-sm font-medium text-gray-900">{formatDate(selected.date)}</p>
                  </div>
                </div>
                {selected.time && (
                  <div className="flex items-center gap-2.5 bg-gray-50 rounded-xl px-4 py-3">
                    <Clock size={18} className="text-primary-600" />
                    <div>
                      <p className="text-xs text-gray-500">Time</p>
                      <p className="text-sm font-medium text-gray-900">{selected.time}</p>
                    </div>
                  </div>
                )}
                {selected.location && (
                  <div className="flex items-center gap-2.5 bg-gray-50 rounded-xl px-4 py-3">
                    <MapPin size={18} className="text-primary-600" />
                    <div>
                      <p className="text-xs text-gray-500">Location</p>
                      <p className="text-sm font-medium text-gray-900">{selected.location}</p>
                    </div>
                  </div>
                )}
                {selected.author && (
                  <div className="flex items-center gap-2.5 bg-gray-50 rounded-xl px-4 py-3">
                    <User size={18} className="text-primary-600" />
                    <div>
                      <p className="text-xs text-gray-500">Author</p>
                      <p className="text-sm font-medium text-gray-900">{selected.author}</p>
                    </div>
                  </div>
                )}
              </div>

              {/* Description */}
              <div>
                <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-2">Description</h3>
                <p className="text-gray-700 leading-relaxed">{selected.excerpt}</p>
              </div>
            </div>
          </div>
        </div>
      )}

      <style>{`
        @keyframes slideUp {
          from { opacity: 0; transform: translateY(30px) scale(0.97); }
          to { opacity: 1; transform: translateY(0) scale(1); }
        }
      `}</style>
      <Footer />
    </div>
  )
}
