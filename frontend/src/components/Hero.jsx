import { useState } from 'react'
import ImageSlider from './ImageSlider'
import { Link } from 'react-router-dom'
import { ArrowRight, Play } from 'lucide-react'

const sliderImages = [
  { src: '/assets/pic1.jpg', alt: 'School facility 1' },
  { src: '/assets/pic2.jpg', alt: 'School facility 2' },
]

const Hero = () => {
  return (
    <section className="relative h-screen min-h-[600px] overflow-hidden">
      <div className="absolute inset-0">
        <ImageSlider images={sliderImages} autoAdvanceInterval={4000} transitionDuration={600} />
        <div className="hero-gradient absolute inset-0 opacity-40 z-10"></div>
        <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent z-10"></div>
      </div>

      <div className="relative z-20 h-full flex items-center">
        <div className="container-content">
          <div className="max-w-3xl">
            <div className="animate-fade-in">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight text-shadow">
                Building Strong Foundations for
                <span className="text-gradient block">Future Leaders</span>
              </h1>
              <p className="text-xl md:text-2xl text-gray-200 mb-8 leading-relaxed max-w-2xl">
                Providing quality education with experienced faculty, modern facilities,
                and holistic development programs for K-10 students.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link to="/contact" className="btn-secondary inline-flex items-center justify-center group">
                  Enquire Now
                  <ArrowRight size={20} className="ml-2 group-hover:translate-x-1 transition-transform" />
                </Link>
                <Link to="/academics" className="btn-outline inline-flex items-center justify-center border-white text-white hover:bg-white hover:text-primary-900" style={{ borderColor: 'white', color: 'white' }}>
                  View Programs
                </Link>
                <a
                  href="https://maps.app.goo.gl/9bfDL1Qr8C9zAVTK7"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-outline inline-flex items-center justify-center"
                  style={{ borderColor: 'white', color: 'white' }}
                >
                  <Play size={20} className="mr-2" />
                  Watch Tour
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce z-20">
        <div className="w-6 h-10 border-2 border-white rounded-full flex justify-center">
          <div className="w-1 h-3 bg-white rounded-full mt-2 animate-pulse"></div>
        </div>
      </div>
    </section>
  )
}

export default Hero
