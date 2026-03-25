import { useState } from 'react'
import { Quote, Star, ChevronLeft, ChevronRight } from 'lucide-react'

const testimonials = [
  { id: 1, name: 'Sarah Johnson', role: 'Parent of Grade 8 Student', content: "GA School has transformed my child's learning experience. The dedicated teachers and modern facilities have helped her excel both academically and personally.", rating: 5, avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?auto=format&fit=crop&w=150&q=80' },
  { id: 2, name: 'Michael Chen', role: 'Parent of Grade 5 Student', content: 'The holistic approach to education at GA School is remarkable. My son has developed not just academic skills but also confidence and social skills.', rating: 5, avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80' },
  { id: 3, name: 'Emily Rodriguez', role: 'Alumni (Class of 2020)', content: 'The foundation I received at GA School prepared me perfectly for higher education. The values, skills, and confidence I gained here continue to help me.', rating: 5, avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=150&q=80' },
  { id: 4, name: 'David Thompson', role: 'Parent of Grade 2 Student', content: 'The primary school program is outstanding. The teachers are patient and caring, creating a nurturing environment that makes learning fun.', rating: 5, avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=150&q=80' },
  { id: 5, name: 'Lisa Anderson', role: 'Parent of Grade 10 Student', content: "GA School's focus on academic excellence combined with character development has helped my daughter become a confident, responsible young adult.", rating: 5, avatar: 'https://images.unsplash.com/photo-1489424731084-a5d8b219a5bb?auto=format&fit=crop&w=150&q=80' },
]

const Stars = ({ rating }) => Array.from({ length: 5 }, (_, i) => (
  <Star key={i} size={20} className={i < rating ? 'text-yellow-400 fill-current' : 'text-gray-300'} />
))

const Testimonials = () => {
  const [currentIndex, setCurrentIndex] = useState(0)
  const prev = () => setCurrentIndex((i) => (i - 1 + testimonials.length) % testimonials.length)
  const next = () => setCurrentIndex((i) => (i + 1) % testimonials.length)
  const t = testimonials[currentIndex]

  return (
    <section className="py-16 bg-white">
      <div className="container-content">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">What Parents & <span className="text-gradient">Students Say</span></h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">Hear from our community about their experiences at GA School.</p>
        </div>
        <div className="max-w-4xl mx-auto">
          <div className="relative">
            <div className="card bg-gradient-to-br from-primary-50 to-secondary-50 border border-primary-100">
              <div className="card-content text-center">
                <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Quote size={32} className="text-primary-600" />
                </div>
                <blockquote className="text-xl md:text-2xl text-gray-800 leading-relaxed mb-8 font-medium">"{t.content}"</blockquote>
                <div className="flex justify-center space-x-1 mb-6"><Stars rating={t.rating} /></div>
                <div className="flex items-center justify-center space-x-4">
                  <img src={t.avatar} alt={t.name} className="w-16 h-16 rounded-full object-cover border-4 border-white shadow-lg" />
                  <div className="text-left">
                    <h4 className="text-lg font-semibold text-gray-900">{t.name}</h4>
                    <p className="text-gray-600">{t.role}</p>
                  </div>
                </div>
              </div>
            </div>
            <button onClick={prev} className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 lg:-translate-x-12 w-12 h-12 bg-white rounded-full shadow-lg flex items-center justify-center hover:bg-primary-50 hover:text-primary-600 transition-colors z-10"><ChevronLeft size={24} /></button>
            <button onClick={next} className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 lg:translate-x-12 w-12 h-12 bg-white rounded-full shadow-lg flex items-center justify-center hover:bg-primary-50 hover:text-primary-600 transition-colors z-10"><ChevronRight size={24} /></button>
          </div>
          <div className="flex justify-center space-x-2 mt-8">
            {testimonials.map((_, i) => (
              <button key={i} onClick={() => setCurrentIndex(i)} className={`w-3 h-3 rounded-full transition-colors ${i === currentIndex ? 'bg-primary-600' : 'bg-gray-300 hover:bg-gray-400'}`} />
            ))}
          </div>
        </div>

        <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-6">
          {testimonials.slice(0, 3).map((te) => (
            <div key={te.id} className="card bg-white border border-gray-200 hover-lift">
              <div className="card-content">
                <div className="flex items-center space-x-1 mb-3"><Stars rating={te.rating} /></div>
                <blockquote className="text-gray-700 mb-4 line-clamp-3">"{te.content}"</blockquote>
                <div className="flex items-center space-x-3">
                  <img src={te.avatar} alt={te.name} className="w-10 h-10 rounded-full object-cover" />
                  <div>
                    <h4 className="font-semibold text-gray-900 text-sm">{te.name}</h4>
                    <p className="text-gray-600 text-xs">{te.role}</p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default Testimonials
