import Header from '../components/Header'
import Footer from '../components/Footer'
import AboutPreview from '../components/AboutPreview'

export default function About() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <div className="bg-primary-900 text-white py-16">
        <div className="container-content text-center">
          <h1 className="text-4xl font-bold mb-4">About <span className="text-gradient">Us</span></h1>
          <p className="text-xl text-gray-300">Learn more about Grace Academy and our mission</p>
        </div>
      </div>
      <AboutPreview />

      {/* Vision & Mission */}
      <section className="py-16 bg-white">
        <div className="container-content">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            <div className="bg-primary-50 rounded-2xl p-8">
              <h2 className="text-2xl font-bold text-primary-900 mb-4">Our Vision</h2>
              <p className="text-gray-700 leading-relaxed">To be the leading educational institution that transforms young minds into compassionate, innovative, and responsible global citizens who contribute positively to society.</p>
            </div>
            <div className="bg-secondary-50 rounded-2xl p-8">
              <h2 className="text-2xl font-bold text-primary-900 mb-4">Our Mission</h2>
              <p className="text-gray-700 leading-relaxed">To provide exceptional education through innovative teaching methodologies, fostering intellectual curiosity, moral values, and life skills that prepare students for a rapidly changing world.</p>
            </div>
          </div>
        </div>
      </section>
      <Footer />
    </div>
  )
}
