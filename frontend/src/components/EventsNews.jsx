import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Calendar, Clock, MapPin, ArrowRight, User } from 'lucide-react'
import { getEvents } from '../api'

const FALLBACK = [
  { _id: '1', title: 'Annual Science Exhibition 2024', type: 'event', date: '2024-03-15', time: '9:00 AM - 4:00 PM', location: 'School Auditorium', image: 'https://images.unsplash.com/photo-1532094349884-543bc11b234d?auto=format&fit=crop&w=600&q=80', excerpt: 'Join us for an exciting showcase of scientific innovations.', category: 'Academic' },
  { _id: '2', title: 'Sports Day Championship 2024', type: 'event', date: '2024-03-20', time: '8:00 AM - 5:00 PM', location: 'School Ground', image: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?auto=format&fit=crop&w=600&q=80', excerpt: 'Annual sports day featuring various athletic competitions.', category: 'Sports' },
  { _id: '3', title: 'Outstanding Performance in Board Exams', type: 'news', date: '2024-02-28', author: 'Principal', image: 'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?auto=format&fit=crop&w=600&q=80', excerpt: 'Our students achieved remarkable results with 95% pass rate.', category: 'Achievement' },
  { _id: '4', title: 'Cultural Festival - Unity in Diversity', type: 'event', date: '2024-04-05', time: '10:00 AM - 8:00 PM', location: 'School Campus', image: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?auto=format&fit=crop&w=600&q=80', excerpt: 'Celebrating our diverse culture through music, dance, drama.', category: 'Cultural' },
  { _id: '5', title: 'New Computer Lab Inauguration', type: 'news', date: '2024-02-25', author: 'Admin', image: 'https://images.unsplash.com/photo-1581078426770-6d336e5de7bf?auto=format&fit=crop&w=600&q=80', excerpt: 'State-of-the-art computer lab with 30 new systems.', category: 'Infrastructure' },
  { _id: '6', title: 'Parent Workshop: Digital Parenting', type: 'event', date: '2024-03-10', time: '2:00 PM - 4:00 PM', location: 'Conference Hall', image: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=600&q=80', excerpt: 'Interactive workshop for parents on digital challenges.', category: 'Workshop' },
]

const catColor = { Academic: 'bg-blue-100 text-blue-800', Sports: 'bg-green-100 text-green-800', Achievement: 'bg-yellow-100 text-yellow-800', Cultural: 'bg-purple-100 text-purple-800', Infrastructure: 'bg-gray-100 text-gray-800', Workshop: 'bg-orange-100 text-orange-800' }

const EventsNews = () => {
  const [items, setItems] = useState(FALLBACK)

  useEffect(() => {
    getEvents().then(res => { if (res.data.length) setItems(res.data) }).catch(() => {})
  }, [])

  const formatDate = (d) => new Date(d).toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' })

  return (
    <section className="py-16 bg-white">
      <div className="container-content">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Events & <span className="text-gradient">News</span></h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">Stay updated with the latest happenings, achievements, and upcoming events at GA School.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {items.slice(0, 6).map((item) => (
            <article key={item._id} className="card group cursor-pointer animate-slide-up">
              <div className="relative h-48 overflow-hidden">
                <img src={item.image} alt={item.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                <div className="absolute top-4 left-4">
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${catColor[item.category] || 'bg-gray-100 text-gray-800'}`}>{item.category}</span>
                </div>
                <div className="absolute top-4 right-4">
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${item.type === 'event' ? 'bg-primary-600 text-white' : 'bg-secondary-500 text-white'}`}>{item.type === 'event' ? 'Event' : 'News'}</span>
                </div>
              </div>
              <div className="card-content">
                <h3 className="text-xl font-semibold text-gray-900 mb-2 group-hover:text-primary-600 transition-colors">{item.title}</h3>
                <p className="text-gray-600 mb-4 line-clamp-3">{item.excerpt}</p>
                <div className="space-y-2 mb-4">
                  <div className="flex items-center text-sm text-gray-500"><Calendar size={14} className="mr-2" />{formatDate(item.date)}</div>
                  {item.type === 'event' && item.time && <div className="flex items-center text-sm text-gray-500"><Clock size={14} className="mr-2" />{item.time}</div>}
                  {item.type === 'event' && item.location && <div className="flex items-center text-sm text-gray-500"><MapPin size={14} className="mr-2" />{item.location}</div>}
                  {item.type === 'news' && item.author && <div className="flex items-center text-sm text-gray-500"><User size={14} className="mr-2" />{item.author}</div>}
                </div>
                <Link to={item.type === 'event' ? '/events' : '/events'} className="inline-flex items-center text-primary-600 hover:text-primary-700 font-semibold group">
                  Read More <ArrowRight size={16} className="ml-1 group-hover:translate-x-1 transition-transform" />
                </Link>
              </div>
            </article>
          ))}
        </div>

        <div className="flex flex-col sm:flex-row gap-4 justify-center mt-12">
          <Link to="/events" className="btn-primary inline-flex items-center justify-center">View All Events <ArrowRight size={20} className="ml-2" /></Link>
        </div>
      </div>
    </section>
  )
}

export default EventsNews
