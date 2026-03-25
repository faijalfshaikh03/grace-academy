import { useState } from 'react'
import Header from '../components/Header'
import Footer from '../components/Footer'
import { Phone, Mail, MapPin, Clock, Send, CheckCircle } from 'lucide-react'
import { createEnquiry } from '../api'

export default function Contact() {
  const [form, setForm] = useState({ name: '', email: '', phone: '', grade: '', message: '' })
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState('')

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value })

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    try {
      await createEnquiry(form)
      setSuccess(true)
      setForm({ name: '', email: '', phone: '', grade: '', message: '' })
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to send enquiry. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <div className="bg-primary-900 text-white py-16">
        <div className="container-content text-center">
          <h1 className="text-4xl font-bold mb-4">Contact <span className="text-gradient">Us</span></h1>
          <p className="text-xl text-gray-300">Get in touch with us for admissions and enquiries</p>
        </div>
      </div>

      <div className="container-content py-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Contact Info */}
          <div className="space-y-8">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Get In Touch</h2>
              <p className="text-gray-600 leading-relaxed">We'd love to hear from you. Send us a message and we'll respond as soon as possible.</p>
            </div>
            <div className="space-y-6">
              <div className="flex items-start space-x-4">
                <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <MapPin size={24} className="text-primary-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-1">Address</h3>
                  <p className="text-gray-600">220KV Sub Station, Patkhadki,<br />Chalisgaon, Jalgaon, Maharashtra</p>
                </div>
              </div>
              <div className="flex items-start space-x-4">
                <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <Phone size={24} className="text-primary-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-1">Phone</h3>
                  <p className="text-gray-600">+91 9404052794</p>
                </div>
              </div>
              <div className="flex items-start space-x-4">
                <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <Mail size={24} className="text-primary-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-1">Email</h3>
                  <p className="text-gray-600">gracetoddlerscsn@gmail.com</p>
                </div>
              </div>
              <div className="flex items-start space-x-4">
                <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <Clock size={24} className="text-primary-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-1">Hours</h3>
                  <p className="text-gray-600">Mon–Fri: 8:00 AM – 4:00 PM<br />Sat: 8:00 AM – 1:00 PM</p>
                </div>
              </div>
            </div>
          </div>

          {/* Enquiry Form */}
          <div className="bg-white rounded-xl shadow-xl p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Send an Enquiry</h2>
            {success ? (
              <div className="text-center py-8">
                <CheckCircle size={64} className="text-green-500 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Enquiry Submitted!</h3>
                <p className="text-gray-600 mb-4">Thank you! We'll get back to you within 24 hours.</p>
                <button onClick={() => setSuccess(false)} className="btn-primary">Send Another Enquiry</button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-5">
                {error && <div className="bg-red-50 border border-red-200 text-red-800 rounded-lg p-3 text-sm">{error}</div>}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Full Name *</label>
                    <input type="text" name="name" value={form.name} onChange={handleChange} required className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500" placeholder="Your full name" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Email *</label>
                    <input type="email" name="email" value={form.email} onChange={handleChange} required className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500" placeholder="your@email.com" />
                  </div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                    <input type="tel" name="phone" value={form.phone} onChange={handleChange} className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500" placeholder="+91 XXXXX XXXXX" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Grade Seeking</label>
                    <select name="grade" value={form.grade} onChange={handleChange} className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500">
                      <option value="">Select Grade</option>
                      {['KG-1','KG-2','Grade 1','Grade 2','Grade 3','Grade 4','Grade 5','Grade 6','Grade 7','Grade 8','Grade 9','Grade 10'].map(g => <option key={g} value={g}>{g}</option>)}
                    </select>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Message</label>
                  <textarea name="message" value={form.message} onChange={handleChange} rows={4} className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500" placeholder="Your enquiry or message..." />
                </div>
                <button type="submit" disabled={loading} className="btn-primary w-full justify-center">
                  {loading ? 'Sending...' : <><Send size={18} className="mr-2" />Send Enquiry</>}
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
      <Footer />
    </div>
  )
}
