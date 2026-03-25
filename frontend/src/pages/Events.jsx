import { useState, useEffect } from 'react'
import Header from '../components/Header'
import Footer from '../components/Footer'
import { Calendar, Clock, MapPin, User, Search } from 'lucide-react'
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

  useEffect(() => {
    getEvents().then(res => { if (res.data.length) setItems(res.data) }).catch(() => {})
  }, [])

  const filtered = items.filter(i => (type === 'All' || i.type === type) && (i.title.toLowerCase().includes(search.toLowerCase()) || i.excerpt.toLowerCase().includes(search.toLowerCase())))
  const formatDate = (d) => new Date(d).toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' })

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <div className="bg-primary-900 text-white py-16">
        <div className="container-content text-center">
          <h1 className="text-4xl font-bold mb-4">Events & <span className="text-gradient">News</span></h1>
          <p className="text-xl text-gray-300">Latest happenings, achievements, and upcoming events at GA School</p>
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
            <article key={item._id} className="card group">
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
      <Footer />
    </div>
  )
}
