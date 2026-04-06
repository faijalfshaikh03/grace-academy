import { useState, useEffect, useCallback } from 'react'
import Header from '../components/Header'
import Footer from '../components/Footer'
import { FileText, Download, Calendar, AlertCircle, Search, X, Paperclip } from 'lucide-react'
import { getNotices } from '../api'

const FALLBACK = [
  { _id: '1', title: 'Annual Examination Schedule 2024', date: '2024-02-15', category: 'Examination', type: 'urgent', hasAttachment: true, description: 'The annual examination schedule for all grades has been released. Please check the detailed timetable.' },
  { _id: '2', title: 'Parent-Teacher Meeting - March 2024', date: '2024-02-14', category: 'Meeting', type: 'normal', hasAttachment: false, description: 'Parent-teacher meetings are scheduled for March 2nd and 3rd.' },
  { _id: '3', title: 'Summer Camp Registration Open', date: '2024-02-12', category: 'Activity', type: 'normal', hasAttachment: true, description: 'Registration for the summer camp program is now open. Limited seats available.' },
  { _id: '4', title: 'School Holiday - Holi Festival', date: '2024-02-10', category: 'Holiday', type: 'normal', hasAttachment: false, description: 'School will remain closed on March 25th on account of Holi festival.' },
  { _id: '5', title: 'New Admission Form 2024-25', date: '2024-02-08', category: 'Admission', type: 'important', hasAttachment: true, description: 'Admission forms for the academic year 2024-25 are now available for download.' },
  { _id: '6', title: 'Sports Day Announcement', date: '2024-02-05', category: 'Activity', type: 'normal', hasAttachment: false, description: 'Annual Sports Day will be held on March 20, 2024.' },
]

const catColor = { Examination: 'bg-red-100 text-red-800', Meeting: 'bg-blue-100 text-blue-800', Activity: 'bg-green-100 text-green-800', Holiday: 'bg-purple-100 text-purple-800', Admission: 'bg-orange-100 text-orange-800', General: 'bg-gray-100 text-gray-800' }
const typeIcon = { urgent: 'border-l-red-500', important: 'border-l-orange-500', normal: 'border-l-primary-500' }
const cats = ['All', 'Examination', 'Meeting', 'Activity', 'Holiday', 'Admission', 'General']

export default function Notices() {
  const [notices, setNotices] = useState(FALLBACK)
  const [search, setSearch] = useState('')
  const [cat, setCat] = useState('All')
  const [selected, setSelected] = useState(null) // notice object for modal

  useEffect(() => {
    getNotices().then(res => { if (res.data.length) setNotices(res.data) }).catch(() => {})
  }, [])

  const closeModal = useCallback(() => { setSelected(null); document.body.style.overflow = '' }, [])
  const openModal = (notice) => { setSelected(notice); document.body.style.overflow = 'hidden' }

  useEffect(() => {
    if (!selected) return
    const handler = (e) => { if (e.key === 'Escape') closeModal() }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [selected, closeModal])

  const filtered = notices.filter(n => (cat === 'All' || n.category === cat) && (n.title.toLowerCase().includes(search.toLowerCase()) || (n.description || '').toLowerCase().includes(search.toLowerCase())))
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
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none" />
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
            <div key={notice._id}
              onClick={() => openModal(notice)}
              className={`bg-white rounded-xl shadow-sm border border-gray-200 border-l-4 ${typeIcon[notice.type] || typeIcon.normal} hover:shadow-md transition-all cursor-pointer`}>
              <div className="p-5">
                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-3">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start gap-3">
                      {notice.type === 'urgent' ? <AlertCircle size={18} className="text-red-600 mt-0.5 flex-shrink-0" /> : notice.type === 'important' ? <AlertCircle size={18} className="text-orange-600 mt-0.5 flex-shrink-0" /> : <FileText size={18} className="text-gray-500 mt-0.5 flex-shrink-0" />}
                      <div>
                        <h3 className="text-base font-semibold text-gray-900">{notice.title}</h3>
                        <p className="text-gray-500 text-sm mt-1 line-clamp-1">{notice.description}</p>
                      </div>
                    </div>
                    <div className="flex flex-wrap items-center gap-3 mt-3 ml-8">
                      <div className="flex items-center text-sm text-gray-500"><Calendar size={14} className="mr-1" />{formatDate(notice.date)}</div>
                      <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${catColor[notice.category] || catColor.General}`}>{notice.category}</span>
                      {(notice.hasAttachment || notice.attachmentUrl) && (
                        <div className="flex items-center text-sm text-primary-600 font-medium"><Paperclip size={14} className="mr-1" />PDF Attached</div>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-2 ml-8 lg:ml-0">
                    <span className="text-xs text-primary-600 font-medium hover:underline">View Details →</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
          {filtered.length === 0 && (
            <div className="text-center py-16 text-gray-500">
              <FileText size={48} className="mx-auto mb-4 text-gray-300" />
              <p>No notices found matching your criteria.</p>
            </div>
          )}
        </div>
      </div>
      <Footer />

      {/* ── Notice Detail Modal ─────────────────────────── */}
      {selected && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          style={{ background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(4px)', animation: 'fadeIn 0.2s ease' }}
          onClick={closeModal}
        >
          <style>{`
            @keyframes fadeIn { from { opacity: 0 } to { opacity: 1 } }
            @keyframes slideUp { from { opacity: 0; transform: translateY(20px) } to { opacity: 1; transform: translateY(0) } }
          `}</style>
          <div
            className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[85vh] overflow-y-auto"
            style={{ animation: 'slideUp 0.25s ease' }}
            onClick={e => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className={`p-6 border-b border-gray-100 relative`}>
              <button onClick={closeModal}
                className="absolute top-4 right-4 w-9 h-9 bg-gray-100 hover:bg-gray-200 rounded-full flex items-center justify-center transition-colors"
                title="Close (Esc)">
                <X size={18} className="text-gray-600" />
              </button>

              <div className="flex items-start gap-3 pr-10">
                {selected.type === 'urgent' ? <AlertCircle size={22} className="text-red-600 mt-0.5 flex-shrink-0" /> : selected.type === 'important' ? <AlertCircle size={22} className="text-orange-600 mt-0.5 flex-shrink-0" /> : <FileText size={22} className="text-primary-600 mt-0.5 flex-shrink-0" />}
                <div>
                  <h2 className="text-xl font-bold text-gray-900 leading-tight">{selected.title}</h2>
                  <div className="flex flex-wrap items-center gap-3 mt-3">
                    <div className="flex items-center text-sm text-gray-500"><Calendar size={14} className="mr-1.5" />{formatDate(selected.date)}</div>
                    <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${catColor[selected.category] || catColor.General}`}>{selected.category}</span>
                    {selected.type !== 'normal' && (
                      <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold ${selected.type === 'urgent' ? 'bg-red-100 text-red-700' : 'bg-orange-100 text-orange-700'}`}>
                        {selected.type.charAt(0).toUpperCase() + selected.type.slice(1)}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Modal Body */}
            <div className="p-6">
              <div className="prose prose-sm max-w-none text-gray-700 leading-relaxed whitespace-pre-wrap">
                {selected.description}
              </div>

              {/* Attachment */}
              {(selected.hasAttachment || selected.attachmentUrl) && selected.attachmentUrl && (
                <div className="mt-8 p-4 bg-primary-50 border border-primary-200 rounded-xl flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-primary-100 rounded-lg flex items-center justify-center flex-shrink-0">
                      <Paperclip size={20} className="text-primary-600" />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-gray-900">PDF Attachment</p>
                      <p className="text-xs text-gray-500">Click to download or view</p>
                    </div>
                  </div>
                  <a href={selected.attachmentUrl} target="_blank" rel="noreferrer"
                    className="flex items-center gap-2 bg-primary-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-primary-700 transition-colors">
                    <Download size={16} />Download
                  </a>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
