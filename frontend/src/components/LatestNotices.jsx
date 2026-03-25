import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { FileText, Download, Calendar, AlertCircle, ChevronRight } from 'lucide-react'
import { getNotices } from '../api'

const FALLBACK = [
  { _id: '1', title: 'Annual Examination Schedule 2024', date: '2024-02-15', category: 'Examination', type: 'urgent', hasAttachment: true, description: 'The annual examination schedule for all grades has been released.' },
  { _id: '2', title: 'Parent-Teacher Meeting - March 2024', date: '2024-02-14', category: 'Meeting', type: 'normal', hasAttachment: false, description: 'Parent-teacher meetings are scheduled for March 2nd and 3rd.' },
  { _id: '3', title: 'Summer Camp Registration Open', date: '2024-02-12', category: 'Activity', type: 'normal', hasAttachment: true, description: 'Registration for the summer camp program is now open.' },
  { _id: '4', title: 'School Holiday - Holi Festival', date: '2024-02-10', category: 'Holiday', type: 'normal', hasAttachment: false, description: 'School will remain closed on March 25th on account of Holi festival.' },
  { _id: '5', title: 'New Admission Form 2024-25', date: '2024-02-08', category: 'Admission', type: 'important', hasAttachment: true, description: 'Admission forms for the academic year 2024-25 are now available.' },
]

const catColor = { Examination: 'bg-red-100 text-red-800', Meeting: 'bg-blue-100 text-blue-800', Activity: 'bg-green-100 text-green-800', Holiday: 'bg-purple-100 text-purple-800', Admission: 'bg-orange-100 text-orange-800' }

const LatestNotices = () => {
  const [notices, setNotices] = useState(FALLBACK)

  useEffect(() => {
    getNotices().then(res => { if (res.data.length) setNotices(res.data) }).catch(() => {})
  }, [])

  const formatDate = (d) => new Date(d).toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' })

  return (
    <section className="py-16 bg-white">
      <div className="container-content">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h2 className="text-3xl font-bold text-gray-900 mb-2">Latest <span className="text-gradient">Notices</span></h2>
            <p className="text-gray-600">Stay updated with the latest announcements and important information</p>
          </div>
          <Link to="/notices" className="btn-outline hidden md:flex items-center">
            View All Notices <ChevronRight size={20} className="ml-2" />
          </Link>
        </div>

        <div className="space-y-4">
          {notices.slice(0, 5).map((notice) => (
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
                      <div className="flex items-center text-sm text-gray-500">
                        <Calendar size={14} className="mr-1" />{formatDate(notice.date)}
                      </div>
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
        </div>

        <div className="text-center mt-8 md:hidden">
          <Link to="/notices" className="btn-primary inline-flex items-center">View All Notices <ChevronRight size={20} className="ml-2" /></Link>
        </div>
      </div>
    </section>
  )
}

export default LatestNotices
