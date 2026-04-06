import { Link } from 'react-router-dom'
import { Globe, MessageCircle, Camera, PlayCircle, MapPin, Phone, Mail, Clock } from 'lucide-react'

const quickLinks = [
  { name: 'About Us', href: '/about' },
  { name: 'Academics', href: '/academics' },
  { name: 'Admissions', href: '/admissions' },
  { name: 'Notices', href: '/notices' },
  { name: 'Events', href: '/events' },
  { name: 'Gallery', href: '/gallery' },
  { name: 'Contact', href: '/contact' },
]

const importantLinks = [
  { name: 'Academic Calendar', href: '/academics' },
  { name: 'Fee Structure', href: '/admissions' },
  { name: 'Downloads', href: '/notices' },
]

const socialLinks = [
  { icon: Globe, href: '#', label: 'Facebook' },
  { icon: MessageCircle, href: '#', label: 'Twitter' },
  { icon: Camera, href: '#', label: 'Instagram' },
  { icon: PlayCircle, href: '#', label: 'YouTube' },
]

const Footer = () => (
  <footer className="bg-primary-900 text-white">
    <div className="section-padding">
      <div className="container-content">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <div className="space-y-4">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-secondary-500 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-lg">GA</span>
              </div>
              <div>
                <h3 className="text-lg font-bold">GA School</h3>
                <p className="text-xs text-gray-300">Excellence in Education</p>
              </div>
            </div>
            <p className="text-gray-300 text-sm leading-relaxed">
              Building strong foundations for future leaders through quality education, modern facilities, and holistic development programs.
            </p>
            <div className="flex space-x-3">
              {socialLinks.map((s) => (
                <a key={s.label} href={s.href} aria-label={s.label}
                  className="w-10 h-10 bg-white/10 hover:bg-secondary-500 rounded-full flex items-center justify-center transition-colors duration-200">
                  <s.icon size={18} />
                </a>
              ))}
            </div>
          </div>

          <div>
            <h4 className="text-lg font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2">
              {quickLinks.map((l) => (
                <li key={l.name}>
                  <Link to={l.href} className="text-gray-300 hover:text-secondary-400 text-sm transition-colors duration-200">{l.name}</Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-lg font-semibold mb-4">Important Links</h4>
            <ul className="space-y-2">
              {importantLinks.map((l) => (
                <li key={l.name}>
                  <Link to={l.href} className="text-gray-300 hover:text-secondary-400 text-sm transition-colors duration-200">{l.name}</Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-lg font-semibold mb-4">Contact Info</h4>
            <div className="space-y-3">
              <div className="flex items-start space-x-3">
                <MapPin size={18} className="text-secondary-400 mt-1 flex-shrink-0" />
                <p className="text-sm text-gray-300">220KV Sub Station,<br />Patkhadki, Chalisgaon, Jalgaon<br />Maharashtra</p>
              </div>
              <div className="flex items-center space-x-3">
                <Phone size={18} className="text-secondary-400" />
                <p className="text-sm text-gray-300">+91-9404052794</p>
              </div>
              <div className="flex items-center space-x-3">
                <Mail size={18} className="text-secondary-400" />
                <p className="text-sm text-gray-300">gracetoddlerscsn@gmail.com</p>
              </div>
              <div className="flex items-start space-x-3">
                <Clock size={18} className="text-secondary-400 mt-1" />
                <p className="text-sm text-gray-300">Mon–Fri: 8:00 AM – 4:00 PM<br />Sat: 8:00 AM – 1:00 PM<br />Sun: Closed</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div className="border-t border-primary-800">
      <div className="container-content py-6">
        <div className="rounded-lg overflow-hidden">
          <iframe
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3738.527011086973!2d74.97678197524075!3d20.443536581063437!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3bd9555a9fda50db%3A0x961f64f3cb007ee1!2sGrace%20Academy!5e0!3m2!1sen!2sin!4v1772602425925!5m2!1sen!2sin"
            width="100%" height="300" style={{ border: 0 }} allowFullScreen loading="lazy" referrerPolicy="no-referrer-when-downgrade"
          ></iframe>
        </div>
      </div>
    </div>

    <div className="border-t border-primary-800 bg-primary-950">
      <div className="container-content py-4">
        <div className="flex flex-col md:flex-row justify-between items-center space-y-2 md:space-y-0">
          <p className="text-sm text-gray-400">© 2024 Grace Academy. All rights reserved.</p>
          <div className="flex space-x-6 text-sm">
            <a href="#" className="text-gray-400 hover:text-secondary-400 transition-colors">Privacy Policy</a>
            <a href="#" className="text-gray-400 hover:text-secondary-400 transition-colors">Terms of Service</a>
          </div>
        </div>
      </div>
    </div>
  </footer>
)

export default Footer
