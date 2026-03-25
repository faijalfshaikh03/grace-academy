import Header from '../components/Header'
import Hero from '../components/Hero'
import QuickHighlights from '../components/QuickHighlights'
import CallToAction from '../components/CallToAction'
import Footer from '../components/Footer'
import { Link } from 'react-router-dom'
import { ArrowRight, BookOpen, Trophy, Users, Heart, FileText, Calendar, Image as ImageIcon } from 'lucide-react'

const features = [
  { icon: BookOpen, title: 'Academic Excellence', desc: 'CBSE curriculum with modern teaching methodologies and smart classrooms.', link: '/academics' },
  { icon: Trophy, title: 'Sports & Activities', desc: 'Comprehensive sports programs and extracurricular clubs for holistic growth.', link: '/academics' },
  { icon: Users, title: 'Expert Faculty', desc: '50+ experienced teachers dedicated to nurturing every student\'s potential.', link: '/about' },
  { icon: Heart, title: 'Values & Character', desc: 'Strong focus on moral values, ethics, and community responsibility.', link: '/about' },
]

const quickLinks = [
  { icon: FileText, title: 'Notices', desc: 'Latest announcements & updates', link: '/notices', color: 'bg-blue-500' },
  { icon: Calendar, title: 'Events', desc: 'Upcoming events & news', link: '/events', color: 'bg-violet-500' },
  { icon: ImageIcon, title: 'Gallery', desc: 'School life in pictures', link: '/gallery', color: 'bg-amber-500' },
]

export default function Home() {
  return (
    <main className="min-h-screen">
      <Header />
      <Hero />
      <QuickHighlights />

      {/* Why Choose Us — concise */}
      <section className="py-16 bg-white">
        <div className="container-content">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">
              Why Choose <span className="text-gradient">Grace Academy?</span>
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Building strong foundations through quality education, modern facilities, and a caring community.
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map(f => (
              <Link to={f.link} key={f.title} className="group p-6 rounded-xl border border-gray-200 hover:border-primary-300 hover:shadow-lg transition-all hover-lift">
                <div className="w-12 h-12 bg-primary-100 rounded-xl flex items-center justify-center mb-4 group-hover:bg-primary-600 transition-colors">
                  <f.icon size={24} className="text-primary-600 group-hover:text-white transition-colors" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">{f.title}</h3>
                <p className="text-gray-600 text-sm leading-relaxed">{f.desc}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Quick Access Cards */}
      <section className="py-12 bg-gray-50">
        <div className="container-content">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {quickLinks.map(q => (
              <Link to={q.link} key={q.title} className="flex items-center gap-4 bg-white rounded-xl p-5 border border-gray-200 hover:shadow-lg transition-all group hover-lift">
                <div className={`w-14 h-14 ${q.color} rounded-xl flex items-center justify-center flex-shrink-0`}>
                  <q.icon size={24} className="text-white" />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-900 group-hover:text-primary-600 transition-colors">{q.title}</h3>
                  <p className="text-sm text-gray-500">{q.desc}</p>
                </div>
                <ArrowRight size={18} className="text-gray-400 group-hover:text-primary-600 group-hover:translate-x-1 transition-all" />
              </Link>
            ))}
          </div>
        </div>
      </section>

      <CallToAction />
      <Footer />
    </main>
  )
}
