import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import {
  LogOut, Menu, X, Home, Users, BookOpen, CheckSquare, TrendingUp,
  FileText, Eye, Plus, Save, Trash2, Calendar, Clock, ArrowUpRight
} from 'lucide-react'
import {
  getClasses, getStudents, markAttendance, getAttendance,
  addProgress, getProgress, addHomework, getHomework, getNotices
} from '../../api'

const formatDate = (d) => new Date(d).toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' })
const today = () => new Date().toISOString().split('T')[0]

export default function TeacherDashboard() {
  const [tab, setTab] = useState('overview')
  const [sidebar, setSidebar] = useState(false)
  const navigate = useNavigate()
  const name = localStorage.getItem('ga_name') || 'Teacher'

  const [classes, setClasses] = useState([])
  const [selectedClass, setSelectedClass] = useState(null)
  const [students, setStudents] = useState([])
  const [attendanceRecords, setAttendanceRecords] = useState({})
  const [attendanceDate, setAttendanceDate] = useState(today())
  const [existingAttendance, setExistingAttendance] = useState([])
  const [progressList, setProgressList] = useState([])
  const [homeworkList, setHomeworkList] = useState([])
  const [notices, setNotices] = useState([])
  const [msg, setMsg] = useState('')
  const [saving, setSaving] = useState(false)

  // Forms
  const [showForm, setShowForm] = useState(false)
  const [progressForm, setProgressForm] = useState({ student_id: '', subject: '', marks: '', remarks: '', performance_status: 'Good' })
  const [homeworkForm, setHomeworkForm] = useState({ title: '', description: '', due_date: '', file_url: '' })

  useEffect(() => {
    getClasses().then(r => { setClasses(r.data); if (r.data.length) setSelectedClass(r.data[0]) }).catch(() => {})
    getNotices().then(r => setNotices(r.data)).catch(() => {})
  }, [])

  useEffect(() => {
    if (!selectedClass) return
    getStudents({ class_id: selectedClass._id }).then(r => setStudents(r.data)).catch(() => {})
    getHomework({ class_id: selectedClass._id }).then(r => setHomeworkList(r.data)).catch(() => {})
  }, [selectedClass])

  const flash = (m) => { setMsg(m); setTimeout(() => setMsg(''), 2500) }
  const logout = () => { localStorage.clear(); navigate('/admin') }

  // Attendance
  const loadAttendance = async () => {
    if (!selectedClass) return
    try {
      const r = await getAttendance({ class_id: selectedClass._id, date: attendanceDate })
      setExistingAttendance(r.data)
      const map = {}
      r.data.forEach(a => { map[a.student_id?._id || a.student_id] = a.status })
      setAttendanceRecords(map)
    } catch { setExistingAttendance([]) }
  }
  useEffect(() => { if (tab === 'attendance' && selectedClass) loadAttendance() }, [tab, selectedClass, attendanceDate])

  const toggleAttendance = (sid) => {
    setAttendanceRecords(prev => ({ ...prev, [sid]: prev[sid] === 'Present' ? 'Absent' : 'Present' }))
  }
  const submitAttendance = async () => {
    setSaving(true)
    try {
      const records = students.map(s => ({ student_id: s._id, status: attendanceRecords[s._id] || 'Present' }))
      await markAttendance({ class_id: selectedClass._id, date: attendanceDate, records })
      flash('Attendance saved!')
      loadAttendance()
    } catch { flash('Error saving') } finally { setSaving(false) }
  }

  // Progress
  const loadProgress = async (sid) => {
    try { const r = await getProgress({ student_id: sid }); setProgressList(r.data) } catch { setProgressList([]) }
  }
  const submitProgress = async () => {
    setSaving(true)
    try {
      await addProgress(progressForm)
      flash('Progress added!')
      setShowForm(false)
      loadProgress(progressForm.student_id)
      setProgressForm({ student_id: '', subject: '', marks: '', remarks: '', performance_status: 'Good' })
    } catch (e) { flash(e.response?.data?.message || 'Error') } finally { setSaving(false) }
  }

  // Homework
  const submitHomework = async () => {
    setSaving(true)
    try {
      await addHomework({ ...homeworkForm, class_id: selectedClass._id })
      flash('Homework added!')
      setShowForm(false)
      setHomeworkForm({ title: '', description: '', due_date: '', file_url: '' })
      getHomework({ class_id: selectedClass._id }).then(r => setHomeworkList(r.data))
    } catch (e) { flash(e.response?.data?.message || 'Error') } finally { setSaving(false) }
  }

  const tabs = [
    { id: 'overview', label: 'Overview', icon: Home },
    { id: 'students', label: 'Students', icon: Users },
    { id: 'attendance', label: 'Attendance', icon: CheckSquare },
    { id: 'progress', label: 'Progress', icon: TrendingUp },
    { id: 'homework', label: 'Homework', icon: BookOpen },
    { id: 'notices', label: 'Notices', icon: FileText },
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      {msg && <div className="fixed top-4 right-4 z-50 bg-emerald-500 text-white px-5 py-2.5 rounded-xl shadow-lg font-medium">{msg}</div>}

      <header className="bg-white border-b sticky top-0 z-40">
        <div className="flex items-center justify-between h-14 px-4 lg:px-6">
          <div className="flex items-center gap-3">
            <button onClick={() => setSidebar(!sidebar)} className="lg:hidden p-1.5 rounded-lg hover:bg-gray-100">{sidebar ? <X size={20} /> : <Menu size={20} />}</button>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center"><BookOpen size={16} className="text-white" /></div>
              <span className="font-semibold text-gray-900 hidden sm:block">Teacher Panel</span>
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
          <div className="p-3">
            {selectedClass && (
              <select value={selectedClass._id} onChange={e => setSelectedClass(classes.find(c => c._id === e.target.value))}
                className="w-full mb-3 text-sm border border-gray-200 rounded-lg px-3 py-2 font-medium">
                {classes.map(c => <option key={c._id} value={c._id}>Class {c.class_name} - {c.section}</option>)}
              </select>
            )}
            <nav className="space-y-1">
              {tabs.map(t => (
                <button key={t.id} onClick={() => { setTab(t.id); setSidebar(false); setShowForm(false) }}
                  className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${tab === t.id ? 'bg-blue-50 text-blue-700' : 'text-gray-600 hover:bg-gray-50'}`}>
                  <t.icon size={18} />{t.label}
                </button>
              ))}
            </nav>
          </div>
        </aside>

        <main className="flex-1 p-4 lg:p-6">
          {/* OVERVIEW */}
          {tab === 'overview' && (
            <div className="space-y-6 max-w-4xl">
              <h2 className="text-xl font-bold">Welcome, {name}</h2>
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                {[
                  { label: 'My Classes', value: classes.length, color: 'from-blue-500 to-blue-600', icon: BookOpen },
                  { label: 'Students', value: students.length, color: 'from-emerald-500 to-emerald-600', icon: Users },
                  { label: 'Homework', value: homeworkList.length, color: 'from-violet-500 to-violet-600', icon: BookOpen },
                  { label: 'Notices', value: notices.length, color: 'from-amber-500 to-amber-600', icon: FileText },
                ].map(s => (
                  <div key={s.label} className={`bg-gradient-to-br ${s.color} rounded-xl p-4 text-white shadow-lg`}>
                    <s.icon size={20} className="opacity-80 mb-2" />
                    <div className="text-2xl font-bold">{s.value}</div>
                    <div className="text-sm opacity-80">{s.label}</div>
                  </div>
                ))}
              </div>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                <div className="bg-white rounded-xl border p-4">
                  <h3 className="font-semibold text-sm mb-3">Recent Notices</h3>
                  {notices.slice(0, 4).map(n => (
                    <div key={n._id} className="py-2 border-b border-gray-50 last:border-0">
                      <p className="text-sm font-medium text-gray-900 truncate">{n.title}</p>
                      <p className="text-xs text-gray-500">{formatDate(n.date)}</p>
                    </div>
                  ))}
                  {!notices.length && <p className="text-sm text-gray-400">No notices</p>}
                </div>
                <div className="bg-white rounded-xl border p-4">
                  <h3 className="font-semibold text-sm mb-3">Upcoming Homework</h3>
                  {homeworkList.slice(0, 4).map(h => (
                    <div key={h._id} className="py-2 border-b border-gray-50 last:border-0">
                      <p className="text-sm font-medium text-gray-900 truncate">{h.title}</p>
                      <p className="text-xs text-gray-500">Due: {formatDate(h.due_date)}</p>
                    </div>
                  ))}
                  {!homeworkList.length && <p className="text-sm text-gray-400">No homework</p>}
                </div>
              </div>
            </div>
          )}

          {/* STUDENTS */}
          {tab === 'students' && (
            <div className="max-w-4xl space-y-4">
              <h2 className="text-xl font-bold">Students — Class {selectedClass?.class_name}-{selectedClass?.section}</h2>
              <div className="bg-white rounded-xl border overflow-hidden">
                <table className="w-full text-sm">
                  <thead><tr className="border-b text-left">
                    <th className="px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Roll</th>
                    <th className="px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Name</th>
                    <th className="px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Parent</th>
                    <th className="px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Phone</th>
                  </tr></thead>
                  <tbody className="divide-y divide-gray-50">
                    {students.map(s => (
                      <tr key={s._id} className="hover:bg-gray-50">
                        <td className="px-4 py-3 font-medium text-gray-900">{s.roll_number}</td>
                        <td className="px-4 py-3 text-gray-900">{s.name}</td>
                        <td className="px-4 py-3 text-gray-600">{s.parent_name || '—'}</td>
                        <td className="px-4 py-3 text-gray-600">{s.parent_phone || '—'}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                {!students.length && <p className="px-4 py-8 text-sm text-gray-400 text-center">No students in this class</p>}
              </div>
            </div>
          )}

          {/* ATTENDANCE */}
          {tab === 'attendance' && (
            <div className="max-w-4xl space-y-4">
              <div className="flex items-center justify-between flex-wrap gap-3">
                <h2 className="text-xl font-bold">Attendance — Class {selectedClass?.class_name}-{selectedClass?.section}</h2>
                <input type="date" value={attendanceDate} onChange={e => setAttendanceDate(e.target.value)} className="border rounded-lg px-3 py-2 text-sm" />
              </div>
              <div className="bg-white rounded-xl border overflow-hidden">
                <table className="w-full text-sm">
                  <thead><tr className="border-b text-left">
                    <th className="px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Roll</th>
                    <th className="px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Name</th>
                    <th className="px-4 py-3 text-xs font-semibold text-gray-500 uppercase text-center">Status</th>
                  </tr></thead>
                  <tbody className="divide-y divide-gray-50">
                    {students.map(s => (
                      <tr key={s._id} className="hover:bg-gray-50">
                        <td className="px-4 py-3 font-medium">{s.roll_number}</td>
                        <td className="px-4 py-3">{s.name}</td>
                        <td className="px-4 py-3 text-center">
                          <button onClick={() => toggleAttendance(s._id)}
                            className={`px-4 py-1.5 rounded-full text-xs font-medium transition-colors ${(attendanceRecords[s._id] || 'Present') === 'Present' ? 'bg-green-100 text-green-700 hover:bg-green-200' : 'bg-red-100 text-red-700 hover:bg-red-200'}`}>
                            {attendanceRecords[s._id] || 'Present'}
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                {!students.length && <p className="px-4 py-8 text-sm text-gray-400 text-center">No students</p>}
              </div>
              {students.length > 0 && (
                <button onClick={submitAttendance} disabled={saving} className="bg-blue-600 text-white px-5 py-2.5 rounded-lg text-sm font-medium hover:bg-blue-700 flex items-center gap-2">
                  <Save size={16} />{saving ? 'Saving...' : 'Save Attendance'}
                </button>
              )}
            </div>
          )}

          {/* PROGRESS */}
          {tab === 'progress' && (
            <div className="max-w-4xl space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold">Progress Reports</h2>
                <button onClick={() => setShowForm(!showForm)} className="bg-blue-600 text-white px-3 py-2 rounded-lg text-sm font-medium flex items-center gap-1.5 hover:bg-blue-700">
                  <Plus size={16} /> Add Report
                </button>
              </div>
              {showForm && (
                <div className="bg-white border rounded-xl p-4 space-y-3">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <select value={progressForm.student_id} onChange={e => setProgressForm({...progressForm, student_id: e.target.value})} className="border rounded-lg px-3 py-2 text-sm">
                      <option value="">Select Student</option>
                      {students.map(s => <option key={s._id} value={s._id}>{s.roll_number} — {s.name}</option>)}
                    </select>
                    <input placeholder="Subject" value={progressForm.subject} onChange={e => setProgressForm({...progressForm, subject: e.target.value})} className="border rounded-lg px-3 py-2 text-sm" />
                    <input type="number" placeholder="Marks (0-100)" value={progressForm.marks} onChange={e => setProgressForm({...progressForm, marks: e.target.value})} className="border rounded-lg px-3 py-2 text-sm" />
                    <select value={progressForm.performance_status} onChange={e => setProgressForm({...progressForm, performance_status: e.target.value})} className="border rounded-lg px-3 py-2 text-sm">
                      {['Good', 'Average', 'Needs Improvement'].map(s => <option key={s}>{s}</option>)}
                    </select>
                  </div>
                  <input placeholder="Remarks" value={progressForm.remarks} onChange={e => setProgressForm({...progressForm, remarks: e.target.value})} className="w-full border rounded-lg px-3 py-2 text-sm" />
                  <div className="flex gap-2">
                    <button onClick={submitProgress} disabled={saving} className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-1.5"><Save size={14} />{saving ? 'Saving...' : 'Save'}</button>
                    <button onClick={() => setShowForm(false)} className="px-4 py-2 rounded-lg text-sm border text-gray-600 hover:bg-gray-50">Cancel</button>
                  </div>
                </div>
              )}
              <div className="bg-white rounded-xl border p-4">
                <p className="text-sm text-gray-500 mb-3">Select a student to view progress:</p>
                <div className="flex flex-wrap gap-2 mb-4">
                  {students.map(s => (
                    <button key={s._id} onClick={() => loadProgress(s._id)}
                      className="px-3 py-1.5 rounded-lg text-xs font-medium border hover:bg-blue-50 hover:text-blue-700 hover:border-blue-300 transition-colors">{s.name}</button>
                  ))}
                </div>
                {progressList.length > 0 && (
                  <div className="divide-y divide-gray-100">
                    {progressList.map(p => (
                      <div key={p._id} className="py-3 flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium text-gray-900">{p.subject} — {p.marks != null ? `${p.marks}/100` : ''}</p>
                          <p className="text-xs text-gray-500">{p.remarks} · {formatDate(p.date)}</p>
                        </div>
                        <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${p.performance_status === 'Good' ? 'bg-green-100 text-green-700' : p.performance_status === 'Average' ? 'bg-amber-100 text-amber-700' : 'bg-red-100 text-red-700'}`}>{p.performance_status}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* HOMEWORK */}
          {tab === 'homework' && (
            <div className="max-w-4xl space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold">Homework — Class {selectedClass?.class_name}-{selectedClass?.section}</h2>
                <button onClick={() => setShowForm(!showForm)} className="bg-blue-600 text-white px-3 py-2 rounded-lg text-sm font-medium flex items-center gap-1.5 hover:bg-blue-700"><Plus size={16} /> Assign</button>
              </div>
              {showForm && (
                <div className="bg-white border rounded-xl p-4 space-y-3">
                  <input placeholder="Title" value={homeworkForm.title} onChange={e => setHomeworkForm({...homeworkForm, title: e.target.value})} className="w-full border rounded-lg px-3 py-2 text-sm" />
                  <textarea placeholder="Description" rows={2} value={homeworkForm.description} onChange={e => setHomeworkForm({...homeworkForm, description: e.target.value})} className="w-full border rounded-lg px-3 py-2 text-sm" />
                  <div className="grid grid-cols-2 gap-3">
                    <input type="date" value={homeworkForm.due_date} onChange={e => setHomeworkForm({...homeworkForm, due_date: e.target.value})} className="border rounded-lg px-3 py-2 text-sm" />
                    <input placeholder="File URL (optional)" value={homeworkForm.file_url} onChange={e => setHomeworkForm({...homeworkForm, file_url: e.target.value})} className="border rounded-lg px-3 py-2 text-sm" />
                  </div>
                  <div className="flex gap-2">
                    <button onClick={submitHomework} disabled={saving} className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-1.5"><Save size={14} />{saving ? 'Saving...' : 'Assign'}</button>
                    <button onClick={() => setShowForm(false)} className="px-4 py-2 rounded-lg text-sm border text-gray-600 hover:bg-gray-50">Cancel</button>
                  </div>
                </div>
              )}
              <div className="bg-white rounded-xl border divide-y divide-gray-100 overflow-hidden">
                {homeworkList.map(h => (
                  <div key={h._id} className="px-4 py-3 hover:bg-gray-50">
                    <p className="text-sm font-medium text-gray-900">{h.title}</p>
                    <p className="text-xs text-gray-500 mt-0.5">{h.description}</p>
                    <p className="text-xs text-gray-400 mt-1"><Calendar size={12} className="inline mr-1" />Due: {formatDate(h.due_date)}</p>
                  </div>
                ))}
                {!homeworkList.length && <p className="px-4 py-8 text-sm text-gray-400 text-center">No homework assigned</p>}
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
