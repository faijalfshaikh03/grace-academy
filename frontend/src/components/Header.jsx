import { useState, useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { Menu, X, Phone, Mail } from 'lucide-react'

const Header = () => {
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const location = useLocation()

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const navigationItems = [
    { name: 'Home', href: '/' },
    { name: 'About', href: '/about' },
    { name: 'Academics', href: '/academics' },
    { name: 'Admissions', href: '/admissions' },
    { name: 'Notices', href: '/notices' },
    { name: 'Events', href: '/events' },
    { name: 'Gallery', href: '/gallery' },
    { name: 'Contact', href: '/contact' },
  ]

  return (
    <>
      {/* Top Bar */}
      <div className="bg-primary-900 text-white py-2 px-4">
        <div className="container-content flex justify-between items-center text-sm">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <Phone size={14} />
              <span>+91 9404052794</span>
            </div>
            <div className="flex items-center space-x-2">
              <Mail size={14} />
              <span>gracetoddlerscsn@gmail.com</span>
            </div>
          </div>
          <div className="hidden md:flex items-center space-x-4">
            <Link to="/admin" className="hover:text-secondary-400 transition-colors">
              Admin Login
            </Link>
          </div>
        </div>
      </div>

      {/* Main Navigation */}
      <header className={`sticky top-0 z-50 bg-white transition-all duration-300 ${isScrolled ? 'shadow-lg' : 'shadow-md'}`}>
        <div className="container-content">
          <div className="flex justify-between items-center py-4">
            {/* Logo */}
            <Link to="/" className="flex items-center space-x-3">
              <div className="w-12 h-12">
                <img src="/assets/logo/gslogo.png" alt="GA School Logo" className="w-full h-full object-contain" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-primary-900">Grace Academy</h1>
                <p className="text-xs text-gray-600">Excellence in Education</p>
              </div>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center space-x-6">
              {navigationItems.map((item) => (
                <Link
                  key={item.name}
                  to={item.href}
                  className={`font-medium transition-colors duration-200 ${location.pathname === item.href ? 'text-primary-600' : 'text-gray-700 hover:text-primary-600'}`}
                >
                  {item.name}
                </Link>
              ))}
            </nav>

            {/* CTA + Mobile Toggle */}
            <div className="flex items-center space-x-4">
              <Link to="/contact" className="btn-primary hidden md:inline-flex" style={{ padding: '0.5rem 1rem', fontSize: '0.875rem' }}>
                Enquire Now
              </Link>
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="lg:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors"
              >
                {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="lg:hidden bg-white border-t border-gray-200">
            <nav className="container-content py-4">
              <div className="space-y-3">
                {navigationItems.map((item) => (
                  <Link
                    key={item.name}
                    to={item.href}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="block py-2 text-gray-700 hover:text-primary-600 font-medium transition-colors"
                  >
                    {item.name}
                  </Link>
                ))}
                <Link to="/contact" onClick={() => setIsMobileMenuOpen(false)} className="btn-primary block text-center">
                  Enquire Now
                </Link>
                <Link to="/admin" onClick={() => setIsMobileMenuOpen(false)} className="block text-center text-primary-600 hover:text-primary-700 font-medium">
                  Admin Login
                </Link>
              </div>
            </nav>
          </div>
        )}
      </header>
    </>
  )
}

export default Header
