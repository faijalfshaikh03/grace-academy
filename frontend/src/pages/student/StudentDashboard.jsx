import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import {
  LogOut, Menu, X, Home, CheckSquare, TrendingUp, BookOpen, FileText,
  Eye, GraduationCap, Calendar
} from 'lucide-react'
import { getAttendance, getProgress, getHomework, getNotices, getStudent } from '../../api'

const formatDate = (d) => new Date(d).toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' })

export default function StudentDashboard() {
  const [tab, setTab] = useState('overview')
  const [sidebar, setSidebar] = useState(false)
  const navigate = useNavigate()
  const name = localStorage.getItem('ga_name') || 'Student'

  const [attendance, setAttendance] = useState([])
  const [progress, setProgress] = useState([])
  const [homework, setHomework] = useState([])
  const [notices, setNotices] = useState([])
  const [profile, setProfile] = useState(null)

  useEffect(() => {
    const token = localStorage.getItem('ga_token')
    if (!token) return
    // Decode student ID from JWT
    try {
      const payload = JSON.parse(atob(token.split('.')[1]))
      const sid = payload.id
      getStudent(sid).then(r => setProfile(r.data)).catch(() => {})
      getAttendance({ student_id: sid }).then(r => setAttendance(r.data)).catch(() => {})
      getProgress({ student_id: sid }).then(r => setProgress(r.data)).catch(() => {})
    } catch {}
    getHomework({}).then(r => setHomework(r.data)).catch(() => {})
    getNotices().then(r => setNotices(r.data)).catch(() => {})
  }, [])

  const logout = () => { localStorage.clear(); navigate('/admin') }

  const presentCount = attendance.filter(a => a.status === 'Present').length
  const absentCount = attendance.filter(a => a.status === 'Absent').length
  const attendancePercent = attendance.length ? Math.round((presentCount / attendance.length) * 100) : 0

  const tabs = [
    { id: 'overview', label: 'Overview', icon: Home },
    { id: 'attendance', label: 'Attendance', icon: CheckSquare },
    { id: 'progress', label: 'Progress', icon: TrendingUp },
    { id: 'homework', label: 'Homework', icon: BookOpen },
    { id: 'notices', label: 'Notices', icon: FileText },
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b sticky top-0 z-40">
        <div className="flex items-center justify-between h-14 px-4 lg:px-6">
          <div className="flex items-center gap-3">
            <button onClick={() => setSidebar(!sidebar)} className="lg:hidden p-1.5 rounded-lg hover:bg-gray-100">{sidebar ? <X size={20} /> : <Menu size={20} />}</button>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-gradient-to-br from-green-500 to-green-600 rounded-lg flex items-center justify-center"><GraduationCap size={16} className="text-white" /></div>
              <span className="font-semibold text-gray-900 hidden sm:block">Student Portal</span>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-sm text-gray-500 hidden sm:block">Hi, {name}</span>
            <Link to="/" className="text-sm text-gray-500 hover:text-primary-600 flex items-center gap-1"><Eye size={15} /> Site</Link>
            <button onClick={logout} className="flex items-center gap-1 text-sm text-gray-500 hover:text-red-600"><LogOut size={15} /> Logout</button>
          </div>
        </div>
      </header>

      <div className="flex">
        <aside className={`${sidebar ? 'block' : 'hidden'} lg:block w-56 bg-white border-r min-h-[calc(100vh-56px)] fixed lg:sticky top-14 z-30`}>
          <nav className="p-3 space-y-1">
            {tabs.map(t => (
              <button key={t.id} onClick={() => { setTab(t.id); setSidebar(false) }}
                className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${tab === t.id ? 'bg-green-50 text-green-700' : 'text-gray-600 hover:bg-gray-50'}`}>
                <t.icon size={18} />{t.label}
              </button>
            ))}
          </nav>
        </aside>

        <main className="flex-1 p-4 lg:p-6">
          {/* OVERVIEW */}
          {tab === 'overview' && (
            <div className="space-y-6 max-w-4xl">
              <h2 className="text-xl font-bold">Welcome, {name}</h2>
              {profile && (
                <div className="bg-white rounded-xl border p-4 flex flex-wrap gap-6">
                  <div><p className="text-xs text-gray-500">Roll Number</p><p className="font-semibold">{profile.roll_number}</p></div>
                  <div><p className="text-xs text-gray-500">Class</p><p className="font-semibold">{profile.class_id?.class_name}-{profile.class_id?.section}</p></div>
                  <div><p className="text-xs text-gray-500">Parent</p><p className="font-semibold">{profile.parent_name || '—'}</p></div>
                  <div><p className="text-xs text-gray-500">Phone</p><p className="font-semibold">{profile.parent_phone || '—'}</p></div>
                </div>
              )}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                {[
                  { label: 'Attendance', value: `${attendancePercent}%`, color: 'from-green-500 to-green-600', icon: CheckSquare },
                  { label: 'Present', value: presentCount, color: 'from-emerald-500 to-emerald-600', icon: CheckSquare },
                  { label: 'Progress Reports', value: progress.length, color: 'from-blue-500 to-blue-600', icon: TrendingUp },
                  { label: 'Homework', value: homework.length, color: 'from-violet-500 to-violet-600', icon: BookOpen },
                ].map(s => (
                  <div key={s.label} className={`bg-gradient-to-br ${s.color} rounded-xl p-4 text-white shadow-lg`}>
                    <s.icon size={20} className="opacity-80 mb-2" />
                    <div className="text-2xl font-bold">{s.value}</div>
                    <div className="text-sm opacity-80">{s.label}</div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ATTENDANCE */}
          {tab === 'attendance' && (
            <div className="max-w-4xl space-y-4">
              <h2 className="text-xl font-bold">My Attendance</h2>
              <div className="bg-white rounded-xl border p-4 flex gap-6 mb-4">
                <div><p className="text-xs text-gray-500">Total Days</p><p className="text-lg font-bold">{attendance.length}</p></div>
                <div><p className="text-xs text-gray-500">Present</p><p className="text-lg font-bold text-green-600">{presentCount}</p></div>
                <div><p className="text-xs text-gray-500">Absent</p><p className="text-lg font-bold text-red-600">{absentCount}</p></div>
                <div><p className="text-xs text-gray-500">Percentage</p><p className="text-lg font-bold text-blue-600">{attendancePercent}%</p></div>
              </div>
              <div className="bg-white rounded-xl border divide-y divide-gray-100 overflow-hidden">
                {attendance.map(a => (
                  <div key={a._id} className="px-4 py-2.5 flex items-center justify-between hover:bg-gray-50">
                    <span className="text-sm text-gray-700">{formatDate(a.date)}</span>
                    <span className={`text-xs px-3 py-1 rounded-full font-medium ${a.status === 'Present' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>{a.status}</span>
                  </div>
                ))}
                {!attendance.length && <p className="px-4 py-8 text-sm text-gray-400 text-center">No attendance records</p>}
              </div>
            </div>
          )}

          {/* PROGRESS */}
          {tab === 'progress' && (
            <div className="max-w-4xl space-y-4">
              <h2 className="text-xl font-bold">My Progress Reports</h2>
              <div className="bg-white rounded-xl border divide-y divide-gray-100 overflow-hidden">
                {progress.map(p => (
                  <div key={p._id} className="px-4 py-3 hover:bg-gray-50">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-900">{p.subject}</p>
                        <p className="text-xs text-gray-500 mt-0.5">{p.remarks} · By: {p.teacher_id?.name || 'Teacher'} · {formatDate(p.date)}</p>
                      </div>
                      <div className="text-right">
                        {p.marks != null && <p className="text-sm font-bold text-gray-900">{p.marks}/100</p>}
                        <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${p.performance_status === 'Good' ? 'bg-green-100 text-green-700' : p.performance_status === 'Average' ? 'bg-amber-100 text-amber-700' : 'bg-red-100 text-red-700'}`}>{p.performance_status}</span>
                      </div>
                    </div>
                  </div>
                ))}
                {!progress.length && <p className="px-4 py-8 text-sm text-gray-400 text-center">No progress reports yet</p>}
              </div>
            </div>
          )}

          {/* HOMEWORK */}
          {tab === 'homework' && (
            <div className="max-w-4xl space-y-4">
              <h2 className="text-xl font-bold">My Homework</h2>
              <div className="bg-white rounded-xl border divide-y divide-gray-100 overflow-hidden">
                {homework.map(h => (
                  <div key={h._id} className="px-4 py-3 hover:bg-gray-50">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-900">{h.title}</p>
                        <p className="text-xs text-gray-500 mt-0.5">{h.description}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-xs text-gray-500"><Calendar size={12} className="inline mr-1" />Due: {formatDate(h.due_date)}</p>
                        {h.file_url && <a href={h.file_url} target="_blank" rel="noreferrer" className="text-xs text-blue-600 hover:underline">View File</a>}
                      </div>
                    </div>
                  </div>
                ))}
                {!homework.length && <p className="px-4 py-8 text-sm text-gray-400 text-center">No homework assigned</p>}
              </div>
            </div>
          )}

          {/* NOTICES */}
          {tab === 'notices' && (
            <div className="max-w-4xl space-y-4">
              <h2 className="text-xl font-bold">School Notices</h2>
              <div className="bg-white rounded-xl border divide-y divide-gray-100 overflow-hidden">
                {notices.map(n => (
                  <div key={n._id} className="px-4 py-3 hover:bg-gray-50">
                    <p className="text-sm font-medium text-gray-900">{n.title}</p>
                    <p className="text-xs text-gray-500 mt-0.5">{n.description}</p>
                    <p className="text-xs text-gray-400 mt-1">{formatDate(n.date)} · {n.category}</p>
                  </div>
                ))}
                {!notices.length && <p className="px-4 py-8 text-sm text-gray-400 text-center">No notices</p>}
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  )
}
