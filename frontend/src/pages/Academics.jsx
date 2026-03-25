import Header from '../components/Header'
import Footer from '../components/Footer'
import ProgramsOverview from '../components/ProgramsOverview'

export default function Academics() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <div className="bg-primary-900 text-white py-16">
        <div className="container-content text-center">
          <h1 className="text-4xl font-bold mb-4">Our <span className="text-gradient">Academics</span></h1>
          <p className="text-xl text-gray-300">Comprehensive programs designed for academic excellence</p>
        </div>
      </div>
      <ProgramsOverview />

      <section className="py-16 bg-white">
        <div className="container-content">
          <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">Curriculum Highlights</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { title: 'CBSE Curriculum', desc: 'Following the Central Board of Secondary Education curriculum with emphasis on conceptual understanding.' },
              { title: 'Digital Learning', desc: 'Smart classrooms, computer labs, and digital resources to enhance the learning experience.' },
              { title: 'Language Programs', desc: 'Proficiency in English, Hindi, and Marathi to prepare students for diverse opportunities.' },
            ].map(item => (
              <div key={item.title} className="card">
                <div className="card-content">
                  <h3 className="text-xl font-semibold text-primary-900 mb-3">{item.title}</h3>
                  <p className="text-gray-600">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
      <Footer />
    </div>
  )
}
