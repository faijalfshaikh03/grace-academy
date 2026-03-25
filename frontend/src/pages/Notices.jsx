import { useState, useEffect } from 'react'
import Header from '../components/Header'
import Footer from '../components/Footer'
import { FileText, Download, Calendar, AlertCircle, ChevronRight, Search } from 'lucide-react'
import { getNotices } from '../api'

const FALLBACK = [
  { _id: '1', title: 'Annual Examination Schedule 2024', date: '2024-02-15', category: 'Examination', type: 'urgent', hasAttachment: true, description: 'The annual examination schedule for all grades has been released. Please check the detailed timetable.' },
  { _id: '2', title: 'Parent-Teacher Meeting - March 2024', date: '2024-02-14', category: 'Meeting', type: 'normal', hasAttachment: false, description: 'Parent-teacher meetings are scheduled for March 2nd and 3rd.' },
  { _id: '3', title: 'Summer Camp Registration Open', date: '2024-02-12', category: 'Activity', type: 'normal', hasAttachment: true, description: 'Registration for the summer camp program is now open. Limited seats available.' },
  { _id: '4', title: 'School Holiday - Holi Festival', date: '2024-02-10', category: 'Holiday', type: 'normal', hasAttachment: false, description: 'School will remain closed on March 25th on account of Holi festival.' },
  { _id: '5', title: 'New Admission Form 2024-25', date: '2024-02-08', category: 'Admission', type: 'important', hasAttachment: true, description: 'Admission forms for the academic year 2024-25 are now available for download.' },
  { _id: '6', title: 'Sports Day Announcement', date: '2024-02-05', category: 'Activity', type: 'normal', hasAttachment: false, description: 'Annual Sports Day will be held on March 20, 2024.' },
]

const catColor = { Examination: 'bg-red-100 text-red-800', Meeting: 'bg-blue-100 text-blue-800', Activity: 'bg-green-100 text-green-800', Holiday: 'bg-purple-100 text-purple-800', Admission: 'bg-orange-100 text-orange-800' }
const cats = ['All', 'Examination', 'Meeting', 'Activity', 'Holiday', 'Admission']

export default function Notices() {
  const [notices, setNotices] = useState(FALLBACK)
  const [search, setSearch] = useState('')
  const [cat, setCat] = useState('All')

  useEffect(() => {
    getNotices().then(res => { if (res.data.length) setNotices(res.data) }).catch(() => {})
  }, [])

  const filtered = notices.filter(n => (cat === 'All' || n.category === cat) && (n.title.toLowerCase().includes(search.toLowerCase()) || n.description.toLowerCase().includes(search.toLowerCase())))

  const formatDate = (d) => new Date(d).toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' })

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <div className="bg-primary-900 text-white py-16">
        <div className="container-content text-center">
          <h1 className="text-4xl font-bold mb-4">School <span className="text-gradient">Notices</span></h1>
          <p className="text-xl text-gray-300">Stay updated with the latest announcements and important information</p>
        </div>
      </div>
      <div className="container-content py-12">
        <div className="flex flex-col md:flex-row gap-4 mb-8">
          <div className="relative flex-1">
            <Search size={20} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input type="text" placeholder="Search notices..." value={search} onChange={e => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500" />
          </div>
          <div className="flex flex-wrap gap-2">
            {cats.map(c => (
              <button key={c} onClick={() => setCat(c)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${cat === c ? 'bg-primary-600 text-white' : 'bg-white text-gray-700 hover:bg-primary-100 border border-gray-300'}`}>{c}</button>
            ))}
          </div>
        </div>
        <div className="space-y-4">
          {filtered.map(notice => (
            <div key={notice._id} className="card hover-lift">
              <div className="card-content">
                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-start gap-3 mb-2">
                      {notice.type === 'urgent' ? <AlertCircle size={16} className="text-red-600 mt-1" /> : notice.type === 'important' ? <AlertCircle size={16} className="text-orange-600 mt-1" /> : <FileText size={16} className="text-gray-600 mt-1" />}
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900">{notice.title}</h3>
                        <p className="text-gray-600 text-sm mt-1">{notice.description}</p>
                      </div>
                    </div>
                    <div className="flex flex-wrap items-center gap-4 mt-3">
                      <div className="flex items-center text-sm text-gray-500"><Calendar size={14} className="mr-1" />{formatDate(notice.date)}</div>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${catColor[notice.category] || 'bg-gray-100 text-gray-800'}`}>{notice.category}</span>
                      {notice.hasAttachment && <div className="flex items-center text-sm text-gray-500"><FileText size={14} className="mr-1" />Attachment</div>}
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {notice.hasAttachment && <button className="p-2 text-gray-600 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-colors"><Download size={18} /></button>}
                    <button className="p-2 text-gray-600 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-colors"><ChevronRight size={18} /></button>
                  </div>
                </div>
              </div>
            </div>
          ))}
          {filtered.length === 0 && <div className="text-center py-12 text-gray-500"><FileText size={48} className="mx-auto mb-4 text-gray-300" /><p>No notices found matching your criteria.</p></div>}
        </div>
      </div>
      <Footer />
    </div>
  )
}
