import { Link } from 'react-router-dom'
import { ArrowRight, BookOpen, Trophy, Music } from 'lucide-react'

const programs = [
  { icon: BookOpen, title: 'Primary School', description: 'Grades K-5 focusing on foundational learning and cognitive development.', image: 'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?auto=format&fit=crop&w=600&q=80', features: ['Activity-Based Learning', 'Small Class Sizes', 'Individual Attention'], color: 'bg-blue-500' },
  { icon: BookOpen, title: 'Middle School', description: 'Grades 6-8 emphasizing subject specialization and critical thinking.', image: 'https://images.unsplash.com/photo-1581078426770-6d336e5de7bf?auto=format&fit=crop&w=600&q=80', features: ['Advanced Curriculum', 'Lab Facilities', 'Career Guidance'], color: 'bg-green-500' },
  { icon: Trophy, title: 'Sports Program', description: 'Comprehensive sports education promoting physical fitness and teamwork.', image: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?auto=format&fit=crop&w=600&q=80', features: ['Multiple Sports', 'Professional Coaching', 'Inter-School Competitions'], color: 'bg-orange-500' },
  { icon: Music, title: 'Extracurricular Activities', description: 'Music, arts, drama, and clubs for holistic personality development.', image: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?auto=format&fit=crop&w=600&q=80', features: ['Music & Arts', 'Drama & Theater', 'Various Clubs'], color: 'bg-purple-500' },
]

const ProgramsOverview = () => (
  <section className="py-16 bg-gray-50">
    <div className="container-content">
      <div className="text-center mb-12">
        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Our <span className="text-gradient">Programs</span></h2>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto">Discover our comprehensive educational programs designed to nurture talent and build strong foundations.</p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        {programs.map((p) => (
          <div key={p.title} className="card group cursor-pointer">
            <div className="relative h-48 overflow-hidden">
              <img src={p.image} alt={p.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
              <div className="absolute top-4 right-4">
                <div className={`w-12 h-12 ${p.color} rounded-full flex items-center justify-center shadow-lg`}>
                  <p.icon size={24} className="text-white" />
                </div>
              </div>
              <div className="absolute bottom-4 left-4"><h3 className="text-xl font-bold text-white">{p.title}</h3></div>
            </div>
            <div className="card-content">
              <p className="text-gray-600 mb-4 leading-relaxed">{p.description}</p>
              <div className="space-y-2 mb-4">
                {p.features.map((f) => (
                  <div key={f} className="flex items-center text-sm text-gray-700">
                    <div className="w-2 h-2 bg-secondary-500 rounded-full mr-2"></div>{f}
                  </div>
                ))}
              </div>
              <Link to="/academics" className="inline-flex items-center text-primary-600 hover:text-primary-700 font-semibold group">
                Learn More <ArrowRight size={16} className="ml-1 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          </div>
        ))}
      </div>
      <div className="text-center mt-12">
        <Link to="/academics" className="btn-primary inline-flex items-center">View All Programs <ArrowRight size={20} className="ml-2" /></Link>
      </div>
    </div>
  </section>
)

export default ProgramsOverview
