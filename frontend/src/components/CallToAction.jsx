import { Link } from 'react-router-dom'
import { ArrowRight } from 'lucide-react'

const CallToAction = () => (
  <section className="py-20 relative overflow-hidden" style={{ background: 'linear-gradient(135deg, #00151f 0%, #013e5c 50%, #016798 100%)' }}>
    <div className="absolute inset-0 opacity-10" style={{
      backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.4'%3E%3Ccircle cx='30' cy='30' r='4'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
    }}></div>
    <div className="container-content relative z-10">
      <div className="text-center max-w-4xl mx-auto">
        <div className="mb-12">
          <h2 className="text-3xl md:text-5xl font-bold text-white mb-6 leading-tight">
            Ready to Give Your Child the<span className="block" style={{ color: '#66b1cf' }}>Best Education?</span>
          </h2>
          <p className="text-xl md:text-2xl text-gray-200 mb-8 leading-relaxed">
            Join GA School and become part of a community dedicated to nurturing future leaders through excellence in education.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <Link to="/admissions" className="btn-secondary inline-flex items-center justify-center group" style={{ background: 'white', color: '#013e5c' }}>
              Start Your Journey <ArrowRight size={20} className="ml-2 group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link to="/contact" className="btn-outline inline-flex items-center justify-center" style={{ borderColor: 'white', color: 'white' }}>
              Schedule a Visit
            </Link>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-white mb-12">
          {[
            { title: 'Call Us', detail: '+91 9404052794', sub: 'Mon–Sat: 8:00 AM – 4:00 PM' },
            { title: 'Email Us', detail: 'gracetoddlerscsn@gmail.com', sub: 'admissions@gaschool.edu' },
            { title: 'Visit Us', detail: 'Patkhadki, Chalisgaon', sub: 'Jalgaon, Maharashtra' },
          ].map((info) => (
            <div key={info.title} className="glass-effect rounded-xl p-6 text-center">
              <h3 className="font-semibold text-lg mb-2">{info.title}</h3>
              <p className="text-gray-200">{info.detail}</p>
              <p className="text-sm text-gray-300 mt-1">{info.sub}</p>
            </div>
          ))}
        </div>

        <div className="flex flex-wrap justify-center items-center gap-8">
          {['15+ Years Excellence', '1500+ Happy Students', '50+ Expert Faculty'].map((t) => (
            <div key={t} className="flex items-center space-x-2 text-white">
              <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center"><span className="text-white font-bold text-sm">✓</span></div>
              <span className="text-gray-200">{t}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  </section>
)

export default CallToAction
