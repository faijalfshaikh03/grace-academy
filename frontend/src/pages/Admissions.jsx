import { Link } from 'react-router-dom'
import Header from '../components/Header'
import Footer from '../components/Footer'
import { ArrowRight, CheckCircle } from 'lucide-react'

const steps = [
  { step: '01', title: 'Enquiry', desc: 'Submit your enquiry online or visit the school office.' },
  { step: '02', title: 'Application', desc: 'Fill out the admission application form with required documents.' },
  { step: '03', title: 'Assessment', desc: 'Student assessment and interaction with the academic team.' },
  { step: '04', title: 'Admission', desc: 'Receive admission confirmation and complete fee payment.' },
]

const docs = ['Birth Certificate', 'Transfer Certificate (if applicable)', 'Previous Year Report Card', 'Passport-size Photos (4)', 'Aadhar Card Copy', 'Blood Group Certificate']

export default function Admissions() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <div className="bg-primary-900 text-white py-16">
        <div className="container-content text-center">
          <h1 className="text-4xl font-bold mb-4">Admissions <span className="text-gradient">2024-25</span></h1>
          <p className="text-xl text-gray-300">Join the GA School family — admissions now open</p>
        </div>
      </div>

      <section className="py-16 bg-white">
        <div className="container-content">
          <h2 className="text-3xl font-bold text-gray-900 mb-12 text-center">Admission Process</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
            {steps.map(s => (
              <div key={s.step} className="text-center">
                <div className="w-16 h-16 bg-primary-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-white text-xl font-bold">{s.step}</span>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">{s.title}</h3>
                <p className="text-gray-600">{s.desc}</p>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <div>
              <h3 className="text-2xl font-bold text-gray-900 mb-6">Required Documents</h3>
              <div className="space-y-3">
                {docs.map(d => (
                  <div key={d} className="flex items-center space-x-3">
                    <CheckCircle size={20} className="text-green-500 flex-shrink-0" />
                    <span className="text-gray-700">{d}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="bg-primary-50 rounded-2xl p-8">
              <h3 className="text-2xl font-bold text-primary-900 mb-4">Ready to Apply?</h3>
              <p className="text-gray-600 mb-6">Contact us to start the admission process or to get more information about our programs.</p>
              <div className="space-y-3">
                <Link to="/contact" className="btn-primary w-full justify-center">
                  Enquire Now <ArrowRight size={20} className="ml-2" />
                </Link>
                <a href="tel:+919404052794" className="btn-outline w-full justify-center">Call +91 9404052794</a>
              </div>
            </div>
          </div>
        </div>
      </section>
      <Footer />
    </div>
  )
}
