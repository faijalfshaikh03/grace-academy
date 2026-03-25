import { Link } from 'react-router-dom'
import { ArrowRight, Award, Users, BookOpen, Heart } from 'lucide-react'

const stats = [
  { icon: Users, number: '1500+', label: 'Students Enrolled' },
  { icon: BookOpen, number: '50+', label: 'Experienced Faculty' },
  { icon: Award, number: '15+', label: 'Years of Excellence' },
  { icon: Heart, number: '100%', label: 'Parent Satisfaction' },
]

const AboutPreview = () => (
  <section className="py-16 bg-gray-50">
    <div className="container-content">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        <div className="space-y-6">
          <div>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Welcome to <span className="text-gradient">GA School</span>
            </h2>
            <p className="text-xl text-gray-600 leading-relaxed">
              Where education meets innovation and every child's potential is nurtured to create tomorrow's leaders.
            </p>
          </div>
          <div className="space-y-4">
            <p className="text-gray-600 leading-relaxed">
              Established with a vision to provide quality education, GA School has been a beacon of academic excellence for over 15 years. We believe in creating a learning environment that fosters creativity, critical thinking, and character development.
            </p>
            <p className="text-gray-600 leading-relaxed">
              Our comprehensive curriculum is designed to meet the diverse learning needs of students from Kindergarten through Grade 10. With state-of-the-art facilities, experienced faculty, and a focus on holistic development, we ensure that every student receives the best possible education.
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {['Academic Excellence', 'Character Building', 'Innovation', 'Community'].map((val, i) => (
              <div key={i} className="flex items-start space-x-3">
                <div className="w-6 h-6 bg-secondary-500 rounded-full flex-shrink-0 mt-1"></div>
                <div>
                  <h4 className="font-semibold text-gray-900">{val}</h4>
                  <p className="text-sm text-gray-600">{['Rigorous curriculum with proven results','Strong values and ethics education','Modern teaching methodologies','Strong parent-school partnership'][i]}</p>
                </div>
              </div>
            ))}
          </div>
          <Link to="/about" className="btn-primary inline-flex items-center">
            Learn More About Us <ArrowRight size={20} className="ml-2" />
          </Link>
        </div>
        <div className="space-y-8">
          <div className="relative rounded-2xl overflow-hidden shadow-2xl">
            <img
              src="https://images.unsplash.com/photo-1580582932707-520aed937b7b?auto=format&fit=crop&w=1170&q=80"
              alt="School Campus"
              className="w-full h-96 object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent"></div>
          </div>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {stats.map((stat) => (
              <div key={stat.label} className="bg-white rounded-xl p-4 text-center shadow-lg hover-lift">
                <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <stat.icon size={24} className="text-primary-600" />
                </div>
                <div className="text-2xl font-bold text-gray-900 mb-1">{stat.number}</div>
                <div className="text-sm text-gray-600">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  </section>
)

export default AboutPreview
