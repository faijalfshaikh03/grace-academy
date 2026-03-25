import { Trophy, Users, BookOpen, Star } from 'lucide-react'

const highlights = [
  { icon: Trophy, label: 'Award Winning School', value: '15+ Awards' },
  { icon: Users, label: 'Happy Students', value: '1500+' },
  { icon: BookOpen, label: 'Expert Faculty', value: '50+' },
  { icon: Star, label: 'Years of Excellence', value: '15+' },
]

const QuickHighlights = () => (
  <section className="py-12 bg-primary-900">
    <div className="container-content">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center text-white">
        {highlights.map((h) => (
          <div key={h.label} className="space-y-2">
            <div className="w-14 h-14 bg-secondary-500 rounded-full flex items-center justify-center mx-auto">
              <h.icon size={28} className="text-white" />
            </div>
            <div className="text-3xl font-bold">{h.value}</div>
            <div className="text-gray-300 text-sm">{h.label}</div>
          </div>
        ))}
      </div>
    </div>
  </section>
)

export default QuickHighlights
