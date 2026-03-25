import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import {
  FileText, Calendar, Image, MessageSquare, TrendingUp, Users, BookOpen, GraduationCap,
  LogOut, Menu, X, Home, Plus, Trash2, Save, Eye, ArrowUpRight, Pencil
} from 'lucide-react'
import {
  getAllNotices, createNotice, deleteNotice,
  getEvents, createEvent, deleteEvent,
  getEnquiries, updateEnquiry, deleteEnquiry,
  getGallery, createGalleryImage, deleteGalleryImage,
  getTeachers, createTeacher, updateTeacher, deleteTeacher,
  getClasses, createClass, updateClass, deleteClass,
  getStudents, createStudent, updateStudent, deleteStudent
} from '../../api'

const formatDate = (d) => new Date(d).toLocaleDateString('en-US', { day: 'numeric', month: 'short' })
const statusColor = { new: 'bg-blue-100 text-blue-700', contacted: 'bg-green-100 text-green-700', pending: 'bg-amber-100 text-amber-700', closed: 'bg-gray-100 text-gray-600', published: 'bg-emerald-100 text-emerald-700', draft: 'bg-gray-100 text-gray-600' }

export default function AdminDashboard() {
  const [tab, setTab] = useState('overview')
  const [sidebar, setSidebar] = useState(false)
  const navigate = useNavigate()

  const [notices, setNotices] = useState([])
  const [events, setEvents] = useState([])
  const [enquiries, setEnquiries] = useState([])
  const [gallery, setGallery] = useState([])
  const [teachers, setTeachers] = useState([])
  const [classes, setClasses] = useState([])
  const [students, setStudents] = useState([])
  const [msg, setMsg] = useState('')
  const [saving, setSaving] = useState(false)

  const [showForm, setShowForm] = useState(false)
  const [editId, setEditId] = useState(null)
  const [noticeForm, setNoticeForm] = useState({ title: '', description: '', category: 'General', type: 'normal', status: 'published' })
  const [eventForm, setEventForm] = useState({ title: '', type: 'event', date: '', time: '', location: '', image: '', excerpt: '', category: 'General' })
  const [galleryForm, setGalleryForm] = useState({ src: '', title: '', category: 'Events' })
  const [teacherForm, setTeacherForm] = useState({ name: '', email: '', phone: '', subject: '', password: '' })
  const [classForm, setClassForm] = useState({ class_name: '', section: '', class_teacher_id: '' })
  const [studentForm, setStudentForm] = useState({ name: '', roll_number: '', class_id: '', parent_name: '', parent_phone: '', email: '', password: '' })

  useEffect(() => {
    getAllNotices().then(r => setNotices(r.data)).catch(() => {})
    getEvents().then(r => setEvents(r.data)).catch(() => {})
    getEnquiries().then(r => setEnquiries(r.data)).catch(() => {})
    getGallery().then(r => setGallery(r.data)).catch(() => {})
    getTeachers().then(r => setTeachers(r.data)).catch(() => {})
    getClasses().then(r => setClasses(r.data)).catch(() => {})
    getStudents({}).then(r => setStudents(r.data)).catch(() => {})
  }, [])

  const logout = () => { localStorage.clear(); navigate('/admin') }
  const flash = (m) => { setMsg(m); setTimeout(() => setMsg(''), 2500) }
  const resetForms = () => { setShowForm(false); setEditId(null) }

  // Teachers
  const openEditTeacher = (t) => { setTeacherForm({ name: t.name, email: t.email, phone: t.phone || '', subject: t.subject, password: '' }); setEditId(t._id); setShowForm(true) }
  const saveTeacher = async () => {
    setSaving(true)
    try {
      if (editId) {
        const body = { ...teacherForm }; if (!body.password) delete body.password
        const r = await updateTeacher(editId, body)
        setTeachers(teachers.map(t => t._id === editId ? r.data : t))
        flash('Teacher updated!')
      } else {
        const r = await createTeacher(teacherForm)
        setTeachers([r.data, ...teachers])
        flash('Teacher added!')
      }
      resetForms(); setTeacherForm({ name: '', email: '', phone: '', subject: '', password: '' })
    } catch (e) { flash(e.response?.data?.message || 'Error') } finally { setSaving(false) }
  }
  const removeTeacher = async (id) => { if (!confirm('Delete this teacher?')) return; await deleteTeacher(id); setTeachers(teachers.filter(t => t._id !== id)); flash('Teacher deleted') }

  // Classes
  const openEditClass = (c) => { setClassForm({ class_name: c.class_name, section: c.section, class_teacher_id: c.class_teacher_id?._id || '' }); setEditId(c._id); setShowForm(true) }
  const saveClassItem = async () => {
    setSaving(true)
    try {
      if (editId) {
        const r = await updateClass(editId, classForm)
        setClasses(classes.map(c => c._id === editId ? r.data : c))
        flash('Class updated!')
      } else {
        const r = await createClass(classForm)
        setClasses([r.data, ...classes])
        flash('Class created!')
      }
      resetForms(); setClassForm({ class_name: '', section: '', class_teacher_id: '' })
    } catch (e) { flash(e.response?.data?.message || 'Error') } finally { setSaving(false) }
  }
  const removeClass = async (id) => { if (!confirm('Delete this class?')) return; await deleteClass(id); setClasses(classes.filter(c => c._id !== id)); flash('Class deleted') }

  // Students
  const openEditStudent = (s) => { setStudentForm({ name: s.name, roll_number: s.roll_number, class_id: s.class_id?._id || '', parent_name: s.parent_name || '', parent_phone: s.parent_phone || '', email: s.email || '', password: '' }); setEditId(s._id); setShowForm(true) }
  const saveStudent = async () => {
    setSaving(true)
    try {
      if (editId) {
        const body = { ...studentForm }; if (!body.password) delete body.password
        const r = await updateStudent(editId, body)
        setStudents(students.map(s => s._id === editId ? r.data : s))
        flash('Student updated!')
      } else {
        const r = await createStudent(studentForm)
        setStudents([r.data, ...students])
        flash('Student added!')
      }
      resetForms(); setStudentForm({ name: '', roll_number: '', class_id: '', parent_name: '', parent_phone: '', email: '', password: '' })
    } catch (e) { flash(e.response?.data?.message || 'Error') } finally { setSaving(false) }
  }
  const removeStudent = async (id) => { if (!confirm('Delete this student?')) return; await deleteStudent(id); setStudents(students.filter(s => s._id !== id)); flash('Student deleted') }

  // Notices/Events/Gallery (unchanged logic)
  const saveNotice = async () => { setSaving(true); try { const r = await createNotice(noticeForm); setNotices([r.data, ...notices]); resetForms(); setNoticeForm({ title: '', description: '', category: 'General', type: 'normal', status: 'published' }); flash('Notice created!') } catch { flash('Error') } finally { setSaving(false) } }
  const saveEvent = async () => { setSaving(true); try { const r = await createEvent(eventForm); setEvents([r.data, ...events]); resetForms(); setEventForm({ title: '', type: 'event', date: '', time: '', location: '', image: '', excerpt: '', category: 'General' }); flash('Event created!') } catch { flash('Error') } finally { setSaving(false) } }
  const saveGallery = async () => { setSaving(true); try { const r = await createGalleryImage(galleryForm); setGallery([r.data, ...gallery]); resetForms(); setGalleryForm({ src: '', title: '', category: 'Events' }); flash('Image added!') } catch { flash('Error') } finally { setSaving(false) } }

  const tabs = [
    { id: 'overview', label: 'Overview', icon: Home },
    { id: 'teachers', label: 'Teachers', icon: BookOpen, count: teachers.length },
    { id: 'classes', label: 'Classes', icon: Users, count: classes.length },
    { id: 'students', label: 'Students', icon: GraduationCap, count: students.length },
    { id: 'notices', label: 'Notices', icon: FileText, count: notices.length },
    { id: 'events', label: 'Events', icon: Calendar, count: events.length },
    { id: 'gallery', label: 'Gallery', icon: Image, count: gallery.length },
    { id: 'enquiries', label: 'Enquiries', icon: MessageSquare, count: enquiries.length },
  ]

  const stats = [
    { label: 'Teachers', value: teachers.length, icon: BookOpen, color: 'from-indigo-500 to-indigo-600' },
    { label: 'Classes', value: classes.length, icon: Users, color: 'from-cyan-500 to-cyan-600' },
    { label: 'Students', value: students.length, icon: GraduationCap, color: 'from-emerald-500 to-emerald-600' },
    { label: 'Enquiries', value: enquiries.length, icon: MessageSquare, color: 'from-blue-500 to-blue-600' },
    { label: 'Notices', value: notices.length, icon: FileText, color: 'from-violet-500 to-violet-600' },
    { label: 'Events', value: events.length, icon: Calendar, color: 'from-amber-500 to-amber-600' },
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      {msg && <div className="fixed top-4 right-4 z-50 bg-emerald-500 text-white px-5 py-2.5 rounded-xl shadow-lg font-medium">{msg}</div>}

      <header className="bg-white border-b border-gray-200 sticky top-0 z-40">
        <div className="flex items-center justify-between h-14 px-4 lg:px-6">
          <div className="flex items-center gap-3">
            <button onClick={() => setSidebar(!sidebar)} className="lg:hidden p-1.5 rounded-lg hover:bg-gray-100">{sidebar ? <X size={20} /> : <Menu size={20} />}</button>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-gradient-to-br from-primary-600 to-primary-800 rounded-lg flex items-center justify-center"><span className="text-white font-bold text-sm">GA</span></div>
              <span className="font-semibold text-gray-900 hidden sm:block">Admin Panel</span>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Link to="/" className="text-sm text-gray-500 hover:text-primary-600 flex items-center gap-1"><Eye size={15} /> View Site</Link>
            <button onClick={logout} className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-red-600"><LogOut size={15} /> Logout</button>
          </div>
        </div>
      </header>

      <div className="flex">
        <aside className={`${sidebar ? 'block' : 'hidden'} lg:block w-56 bg-white border-r min-h-[calc(100vh-56px)] fixed lg:sticky top-14 z-30`}>
          <nav className="p-3 space-y-1">
            {tabs.map(t => (
              <button key={t.id} onClick={() => { setTab(t.id); setSidebar(false); resetForms() }}
                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${tab === t.id ? 'bg-primary-50 text-primary-700' : 'text-gray-600 hover:bg-gray-50'}`}>
                <div className="flex items-center gap-2.5"><t.icon size={18} />{t.label}</div>
                {t.count !== undefined && <span className={`text-xs px-1.5 py-0.5 rounded-full ${tab === t.id ? 'bg-primary-100 text-primary-700' : 'bg-gray-100 text-gray-500'}`}>{t.count}</span>}
              </button>
            ))}
          </nav>
        </aside>

        <main className="flex-1 p-4 lg:p-6 min-h-[calc(100vh-56px)]">

          {/* OVERVIEW */}
          {tab === 'overview' && (
            <div className="space-y-6 max-w-5xl">
              <h2 className="text-xl font-bold text-gray-900">Dashboard Overview</h2>
              <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
                {stats.map(s => (
                  <div key={s.label} className={`bg-gradient-to-br ${s.color} rounded-xl p-4 text-white shadow-lg`}>
                    <div className="flex items-center justify-between mb-3"><s.icon size={20} className="opacity-80" /><TrendingUp size={14} className="opacity-60" /></div>
                    <div className="text-2xl font-bold">{s.value}</div>
                    <div className="text-sm opacity-80">{s.label}</div>
                  </div>
                ))}
              </div>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                <div className="bg-white rounded-xl border overflow-hidden">
                  <div className="flex items-center justify-between px-4 py-3 border-b"><h3 className="font-semibold text-sm">Recent Enquiries</h3><button onClick={() => setTab('enquiries')} className="text-xs text-primary-600 hover:underline flex items-center gap-1">View all <ArrowUpRight size={12} /></button></div>
                  <div className="divide-y divide-gray-50">
                    {enquiries.slice(0, 4).map(e => (<div key={e._id} className="px-4 py-2.5 flex items-center justify-between"><div><p className="text-sm font-medium text-gray-900">{e.name}</p><p className="text-xs text-gray-500">{e.email}</p></div><span className={`text-xs px-2 py-0.5 rounded-full font-medium ${statusColor[e.status]}`}>{e.status}</span></div>))}
                    {!enquiries.length && <p className="px-4 py-6 text-sm text-gray-400 text-center">No enquiries yet</p>}
                  </div>
                </div>
                <div className="bg-white rounded-xl border overflow-hidden">
                  <div className="flex items-center justify-between px-4 py-3 border-b"><h3 className="font-semibold text-sm">Recent Teachers</h3><button onClick={() => setTab('teachers')} className="text-xs text-primary-600 hover:underline flex items-center gap-1">View all <ArrowUpRight size={12} /></button></div>
                  <div className="divide-y divide-gray-50">
                    {teachers.slice(0, 4).map(t => (<div key={t._id} className="px-4 py-2.5 flex items-center justify-between"><div><p className="text-sm font-medium text-gray-900">{t.name}</p><p className="text-xs text-gray-500">{t.subject}</p></div><p className="text-xs text-gray-400">{t.email}</p></div>))}
                    {!teachers.length && <p className="px-4 py-6 text-sm text-gray-400 text-center">No teachers yet</p>}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TEACHERS */}
          {tab === 'teachers' && (
            <div className="max-w-4xl space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold text-gray-900">Teachers</h2>
                <button onClick={() => { resetForms(); setTeacherForm({ name: '', email: '', phone: '', subject: '', password: '' }); setShowForm(true) }} className="bg-primary-600 text-white px-3 py-2 rounded-lg text-sm font-medium flex items-center gap-1.5 hover:bg-primary-700"><Plus size={16} /> Add Teacher</button>
              </div>
              {showForm && (
                <div className="bg-white border rounded-xl p-4 space-y-3">
                  <h3 className="font-semibold text-sm text-gray-700">{editId ? 'Edit Teacher' : 'New Teacher'}</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <input placeholder="Full Name" value={teacherForm.name} onChange={e => setTeacherForm({...teacherForm, name: e.target.value})} className="border rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-primary-500 outline-none" />
                    <input placeholder="Email" type="email" value={teacherForm.email} onChange={e => setTeacherForm({...teacherForm, email: e.target.value})} className="border rounded-lg px-3 py-2 text-sm outline-none" />
                    <input placeholder="Phone" value={teacherForm.phone} onChange={e => setTeacherForm({...teacherForm, phone: e.target.value})} className="border rounded-lg px-3 py-2 text-sm outline-none" />
                    <input placeholder="Subject" value={teacherForm.subject} onChange={e => setTeacherForm({...teacherForm, subject: e.target.value})} className="border rounded-lg px-3 py-2 text-sm outline-none" />
                    <input placeholder={editId ? "New Password (leave blank to keep)" : "Login Password"} type="password" value={teacherForm.password} onChange={e => setTeacherForm({...teacherForm, password: e.target.value})} className="border rounded-lg px-3 py-2 text-sm outline-none" />
                  </div>
                  <div className="flex gap-2">
                    <button onClick={saveTeacher} disabled={saving} className="bg-primary-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-primary-700 flex items-center gap-1.5"><Save size={14} />{saving ? 'Saving...' : editId ? 'Update' : 'Save'}</button>
                    <button onClick={resetForms} className="px-4 py-2 rounded-lg text-sm text-gray-600 border hover:bg-gray-50">Cancel</button>
                  </div>
                </div>
              )}
              <div className="bg-white rounded-xl border overflow-hidden">
                <table className="w-full text-sm">
                  <thead><tr className="border-b text-left">
                    <th className="px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Name</th>
                    <th className="px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Email</th>
                    <th className="px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Subject</th>
                    <th className="px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Phone</th>
                    <th className="px-4 py-3 text-xs font-semibold text-gray-500 uppercase w-20">Actions</th>
                  </tr></thead>
                  <tbody className="divide-y divide-gray-50">
                    {teachers.map(t => (
                      <tr key={t._id} className="hover:bg-gray-50">
                        <td className="px-4 py-3 font-medium text-gray-900">{t.name}</td>
                        <td className="px-4 py-3 text-gray-600">{t.email}</td>
                        <td className="px-4 py-3 text-gray-600">{t.subject}</td>
                        <td className="px-4 py-3 text-gray-500">{t.phone || '—'}</td>
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-1">
                            <button onClick={() => openEditTeacher(t)} className="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg" title="Edit"><Pencil size={14} /></button>
                            <button onClick={() => removeTeacher(t._id)} className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg" title="Delete"><Trash2 size={14} /></button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                {!teachers.length && <p className="px-4 py-10 text-sm text-gray-400 text-center">No teachers. Add one above!</p>}
              </div>
            </div>
          )}

          {/* CLASSES */}
          {tab === 'classes' && (
            <div className="max-w-4xl space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold text-gray-900">Classes</h2>
                <button onClick={() => { resetForms(); setClassForm({ class_name: '', section: '', class_teacher_id: '' }); setShowForm(true) }} className="bg-primary-600 text-white px-3 py-2 rounded-lg text-sm font-medium flex items-center gap-1.5 hover:bg-primary-700"><Plus size={16} /> Add Class</button>
              </div>
              {showForm && (
                <div className="bg-white border rounded-xl p-4 space-y-3">
                  <h3 className="font-semibold text-sm text-gray-700">{editId ? 'Edit Class' : 'New Class'}</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <input placeholder="Class Name (e.g. 5)" value={classForm.class_name} onChange={e => setClassForm({...classForm, class_name: e.target.value})} className="border rounded-lg px-3 py-2 text-sm outline-none" />
                    <input placeholder="Section (e.g. A)" value={classForm.section} onChange={e => setClassForm({...classForm, section: e.target.value})} className="border rounded-lg px-3 py-2 text-sm outline-none" />
                    <select value={classForm.class_teacher_id} onChange={e => setClassForm({...classForm, class_teacher_id: e.target.value})} className="border rounded-lg px-3 py-2 text-sm">
                      <option value="">Select Class Teacher</option>
                      {teachers.map(t => <option key={t._id} value={t._id}>{t.name} ({t.subject})</option>)}
                    </select>
                  </div>
                  <div className="flex gap-2">
                    <button onClick={saveClassItem} disabled={saving} className="bg-primary-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-primary-700 flex items-center gap-1.5"><Save size={14} />{saving ? 'Saving...' : editId ? 'Update' : 'Create'}</button>
                    <button onClick={resetForms} className="px-4 py-2 rounded-lg text-sm text-gray-600 border hover:bg-gray-50">Cancel</button>
                  </div>
                </div>
              )}
              <div className="bg-white rounded-xl border overflow-hidden">
                <table className="w-full text-sm">
                  <thead><tr className="border-b text-left">
                    <th className="px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Class</th>
                    <th className="px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Section</th>
                    <th className="px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Class Teacher</th>
                    <th className="px-4 py-3 text-xs font-semibold text-gray-500 uppercase w-20">Actions</th>
                  </tr></thead>
                  <tbody className="divide-y divide-gray-50">
                    {classes.map(c => (
                      <tr key={c._id} className="hover:bg-gray-50">
                        <td className="px-4 py-3 font-medium text-gray-900">{c.class_name}</td>
                        <td className="px-4 py-3 text-gray-600">{c.section}</td>
                        <td className="px-4 py-3 text-gray-600">{c.class_teacher_id?.name || '—'} <span className="text-gray-400 text-xs">({c.class_teacher_id?.subject || ''})</span></td>
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-1">
                            <button onClick={() => openEditClass(c)} className="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg" title="Edit"><Pencil size={14} /></button>
                            <button onClick={() => removeClass(c._id)} className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg" title="Delete"><Trash2 size={14} /></button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                {!classes.length && <p className="px-4 py-10 text-sm text-gray-400 text-center">No classes. Add one above!</p>}
              </div>
            </div>
          )}

          {/* STUDENTS */}
          {tab === 'students' && (
            <div className="max-w-4xl space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold text-gray-900">Students</h2>
                <button onClick={() => { resetForms(); setStudentForm({ name: '', roll_number: '', class_id: '', parent_name: '', parent_phone: '', email: '', password: '' }); setShowForm(true) }} className="bg-primary-600 text-white px-3 py-2 rounded-lg text-sm font-medium flex items-center gap-1.5 hover:bg-primary-700"><Plus size={16} /> Add Student</button>
              </div>
              {showForm && (
                <div className="bg-white border rounded-xl p-4 space-y-3">
                  <h3 className="font-semibold text-sm text-gray-700">{editId ? 'Edit Student' : 'New Student'}</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <input placeholder="Full Name" value={studentForm.name} onChange={e => setStudentForm({...studentForm, name: e.target.value})} className="border rounded-lg px-3 py-2 text-sm outline-none" />
                    <input placeholder="Roll Number" value={studentForm.roll_number} onChange={e => setStudentForm({...studentForm, roll_number: e.target.value})} className="border rounded-lg px-3 py-2 text-sm outline-none" />
                    <select value={studentForm.class_id} onChange={e => setStudentForm({...studentForm, class_id: e.target.value})} className="border rounded-lg px-3 py-2 text-sm">
                      <option value="">Select Class</option>
                      {classes.map(c => <option key={c._id} value={c._id}>Class {c.class_name} - {c.section}</option>)}
                    </select>
                    <input placeholder="Parent Name" value={studentForm.parent_name} onChange={e => setStudentForm({...studentForm, parent_name: e.target.value})} className="border rounded-lg px-3 py-2 text-sm outline-none" />
                    <input placeholder="Parent Phone" value={studentForm.parent_phone} onChange={e => setStudentForm({...studentForm, parent_phone: e.target.value})} className="border rounded-lg px-3 py-2 text-sm outline-none" />
                    <input placeholder="Student Email (for login)" type="email" value={studentForm.email} onChange={e => setStudentForm({...studentForm, email: e.target.value})} className="border rounded-lg px-3 py-2 text-sm outline-none" />
                    <input placeholder={editId ? "New Password (leave blank to keep)" : "Login Password"} type="password" value={studentForm.password} onChange={e => setStudentForm({...studentForm, password: e.target.value})} className="border rounded-lg px-3 py-2 text-sm outline-none" />
                  </div>
                  <div className="flex gap-2">
                    <button onClick={saveStudent} disabled={saving} className="bg-primary-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-primary-700 flex items-center gap-1.5"><Save size={14} />{saving ? 'Saving...' : editId ? 'Update' : 'Save'}</button>
                    <button onClick={resetForms} className="px-4 py-2 rounded-lg text-sm text-gray-600 border hover:bg-gray-50">Cancel</button>
                  </div>
                </div>
              )}
              <div className="bg-white rounded-xl border overflow-hidden">
                <table className="w-full text-sm">
                  <thead><tr className="border-b text-left">
                    <th className="px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Roll</th>
                    <th className="px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Name</th>
                    <th className="px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Class</th>
                    <th className="px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Parent</th>
                    <th className="px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Phone</th>
                    <th className="px-4 py-3 text-xs font-semibold text-gray-500 uppercase w-20">Actions</th>
                  </tr></thead>
                  <tbody className="divide-y divide-gray-50">
                    {students.map(s => (
                      <tr key={s._id} className="hover:bg-gray-50">
                        <td className="px-4 py-3 font-medium text-gray-900">{s.roll_number}</td>
                        <td className="px-4 py-3 text-gray-900">{s.name}</td>
                        <td className="px-4 py-3 text-gray-600">{s.class_id?.class_name || '?'}-{s.class_id?.section || '?'}</td>
                        <td className="px-4 py-3 text-gray-600">{s.parent_name || '—'}</td>
                        <td className="px-4 py-3 text-gray-500">{s.parent_phone || '—'}</td>
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-1">
                            <button onClick={() => openEditStudent(s)} className="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg" title="Edit"><Pencil size={14} /></button>
                            <button onClick={() => removeStudent(s._id)} className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg" title="Delete"><Trash2 size={14} /></button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                {!students.length && <p className="px-4 py-10 text-sm text-gray-400 text-center">No students. Add one above!</p>}
              </div>
            </div>
          )}

          {/* NOTICES */}
          {tab === 'notices' && (
            <div className="max-w-4xl space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold text-gray-900">Notices</h2>
                <button onClick={() => { resetForms(); setShowForm(true) }} className="bg-primary-600 text-white px-3 py-2 rounded-lg text-sm font-medium flex items-center gap-1.5 hover:bg-primary-700"><Plus size={16} /> New Notice</button>
              </div>
              {showForm && (
                <div className="bg-white border rounded-xl p-4 space-y-3">
                  <input placeholder="Notice title" value={noticeForm.title} onChange={e => setNoticeForm({...noticeForm, title: e.target.value})} className="w-full border rounded-lg px-3 py-2 text-sm outline-none" />
                  <textarea placeholder="Description" rows={2} value={noticeForm.description} onChange={e => setNoticeForm({...noticeForm, description: e.target.value})} className="w-full border rounded-lg px-3 py-2 text-sm outline-none" />
                  <div className="flex flex-wrap gap-2">
                    <select value={noticeForm.category} onChange={e => setNoticeForm({...noticeForm, category: e.target.value})} className="border rounded-lg px-3 py-2 text-sm">{['General','Examination','Meeting','Activity','Holiday','Admission'].map(c => <option key={c}>{c}</option>)}</select>
                    <select value={noticeForm.type} onChange={e => setNoticeForm({...noticeForm, type: e.target.value})} className="border rounded-lg px-3 py-2 text-sm">{['normal','important','urgent'].map(t => <option key={t}>{t}</option>)}</select>
                    <select value={noticeForm.status} onChange={e => setNoticeForm({...noticeForm, status: e.target.value})} className="border rounded-lg px-3 py-2 text-sm"><option value="published">Published</option><option value="draft">Draft</option></select>
                  </div>
                  <div className="flex gap-2">
                    <button onClick={saveNotice} disabled={saving} className="bg-primary-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-primary-700 flex items-center gap-1.5"><Save size={14} />{saving ? 'Saving...' : 'Save'}</button>
                    <button onClick={resetForms} className="px-4 py-2 rounded-lg text-sm text-gray-600 border hover:bg-gray-50">Cancel</button>
                  </div>
                </div>
              )}
              <div className="bg-white rounded-xl border divide-y divide-gray-100 overflow-hidden">
                {notices.map(n => (
                  <div key={n._id} className="px-4 py-3 flex items-center justify-between hover:bg-gray-50">
                    <div className="min-w-0 flex-1"><p className="text-sm font-medium text-gray-900 truncate">{n.title}</p><p className="text-xs text-gray-500 mt-0.5">{n.category} · {formatDate(n.date)}</p></div>
                    <div className="flex items-center gap-2 ml-3">
                      <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${statusColor[n.status]}`}>{n.status}</span>
                      <button onClick={async () => { if(confirm('Delete?')) { await deleteNotice(n._id); setNotices(notices.filter(x => x._id !== n._id)); flash('Deleted') } }} className="p-1.5 text-gray-400 hover:text-red-500 rounded-lg"><Trash2 size={14} /></button>
                    </div>
                  </div>
                ))}
                {!notices.length && <p className="px-4 py-10 text-sm text-gray-400 text-center">No notices yet.</p>}
              </div>
            </div>
          )}

          {/* EVENTS */}
          {tab === 'events' && (
            <div className="max-w-4xl space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold text-gray-900">Events & News</h2>
                <button onClick={() => { resetForms(); setShowForm(true) }} className="bg-primary-600 text-white px-3 py-2 rounded-lg text-sm font-medium flex items-center gap-1.5 hover:bg-primary-700"><Plus size={16} /> New Event</button>
              </div>
              {showForm && (
                <div className="bg-white border rounded-xl p-4 space-y-3">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <input placeholder="Title" value={eventForm.title} onChange={e => setEventForm({...eventForm, title: e.target.value})} className="border rounded-lg px-3 py-2 text-sm outline-none" />
                    <select value={eventForm.type} onChange={e => setEventForm({...eventForm, type: e.target.value})} className="border rounded-lg px-3 py-2 text-sm"><option value="event">Event</option><option value="news">News</option></select>
                    <input type="date" value={eventForm.date} onChange={e => setEventForm({...eventForm, date: e.target.value})} className="border rounded-lg px-3 py-2 text-sm outline-none" />
                    <input placeholder="Time" value={eventForm.time} onChange={e => setEventForm({...eventForm, time: e.target.value})} className="border rounded-lg px-3 py-2 text-sm outline-none" />
                    <input placeholder="Location" value={eventForm.location} onChange={e => setEventForm({...eventForm, location: e.target.value})} className="border rounded-lg px-3 py-2 text-sm outline-none" />
                    <input placeholder="Image URL" value={eventForm.image} onChange={e => setEventForm({...eventForm, image: e.target.value})} className="border rounded-lg px-3 py-2 text-sm outline-none" />
                  </div>
                  <textarea placeholder="Short description" rows={2} value={eventForm.excerpt} onChange={e => setEventForm({...eventForm, excerpt: e.target.value})} className="w-full border rounded-lg px-3 py-2 text-sm outline-none" />
                  <div className="flex gap-2">
                    <button onClick={saveEvent} disabled={saving} className="bg-primary-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-primary-700 flex items-center gap-1.5"><Save size={14} />{saving ? 'Saving...' : 'Save'}</button>
                    <button onClick={resetForms} className="px-4 py-2 rounded-lg text-sm text-gray-600 border hover:bg-gray-50">Cancel</button>
                  </div>
                </div>
              )}
              <div className="bg-white rounded-xl border divide-y divide-gray-100 overflow-hidden">
                {events.map(ev => (
                  <div key={ev._id} className="px-4 py-3 flex items-center justify-between hover:bg-gray-50">
                    <div className="min-w-0 flex-1"><p className="text-sm font-medium text-gray-900 truncate">{ev.title}</p><p className="text-xs text-gray-500 mt-0.5">{ev.category} · {formatDate(ev.date)}</p></div>
                    <div className="flex items-center gap-2 ml-3">
                      <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${ev.type === 'event' ? 'bg-primary-100 text-primary-700' : 'bg-violet-100 text-violet-700'}`}>{ev.type}</span>
                      <button onClick={async () => { if(confirm('Delete?')) { await deleteEvent(ev._id); setEvents(events.filter(x => x._id !== ev._id)); flash('Deleted') } }} className="p-1.5 text-gray-400 hover:text-red-500 rounded-lg"><Trash2 size={14} /></button>
                    </div>
                  </div>
                ))}
                {!events.length && <p className="px-4 py-10 text-sm text-gray-400 text-center">No events yet.</p>}
              </div>
            </div>
          )}

          {/* GALLERY */}
          {tab === 'gallery' && (
            <div className="max-w-4xl space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold text-gray-900">Gallery</h2>
                <button onClick={() => { resetForms(); setShowForm(true) }} className="bg-primary-600 text-white px-3 py-2 rounded-lg text-sm font-medium flex items-center gap-1.5 hover:bg-primary-700"><Plus size={16} /> Add Image</button>
              </div>
              {showForm && (
                <div className="bg-white border rounded-xl p-4 space-y-3">
                  <input placeholder="Image URL" value={galleryForm.src} onChange={e => setGalleryForm({...galleryForm, src: e.target.value})} className="w-full border rounded-lg px-3 py-2 text-sm outline-none" />
                  <div className="flex gap-3">
                    <input placeholder="Title" value={galleryForm.title} onChange={e => setGalleryForm({...galleryForm, title: e.target.value})} className="flex-1 border rounded-lg px-3 py-2 text-sm outline-none" />
                    <select value={galleryForm.category} onChange={e => setGalleryForm({...galleryForm, category: e.target.value})} className="border rounded-lg px-3 py-2 text-sm">{['Academics','Sports','Cultural','Infrastructure','Activities','Events'].map(c => <option key={c}>{c}</option>)}</select>
                  </div>
                  <div className="flex gap-2">
                    <button onClick={saveGallery} disabled={saving} className="bg-primary-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-primary-700 flex items-center gap-1.5"><Save size={14} />{saving ? 'Saving...' : 'Add'}</button>
                    <button onClick={resetForms} className="px-4 py-2 rounded-lg text-sm text-gray-600 border hover:bg-gray-50">Cancel</button>
                  </div>
                </div>
              )}
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
                {gallery.map(img => (
                  <div key={img._id} className="relative group rounded-xl overflow-hidden border bg-white">
                    <img src={img.src} alt={img.title} className="w-full h-28 object-cover" />
                    <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <button onClick={async () => { if(confirm('Delete?')) { await deleteGalleryImage(img._id); setGallery(gallery.filter(x => x._id !== img._id)); flash('Deleted') } }} className="p-2 bg-white rounded-full text-red-500 shadow-lg"><Trash2 size={14} /></button>
                    </div>
                    <p className="text-xs text-gray-600 px-2 py-1.5 truncate">{img.title || 'Untitled'}</p>
                  </div>
                ))}
                {!gallery.length && <div className="col-span-full text-center py-10 text-sm text-gray-400">No images yet.</div>}
              </div>
            </div>
          )}

          {/* ENQUIRIES */}
          {tab === 'enquiries' && (
            <div className="max-w-5xl space-y-4">
              <h2 className="text-xl font-bold text-gray-900">Enquiries</h2>
              <div className="bg-white rounded-xl border overflow-x-auto">
                <table className="w-full text-sm">
                  <thead><tr className="border-b text-left">
                    <th className="px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Name</th>
                    <th className="px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Contact</th>
                    <th className="px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Grade</th>
                    <th className="px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Date</th>
                    <th className="px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Status</th>
                    <th className="px-4 py-3 w-10"></th>
                  </tr></thead>
                  <tbody className="divide-y divide-gray-50">
                    {enquiries.map(e => (
                      <tr key={e._id} className="hover:bg-gray-50">
                        <td className="px-4 py-3 font-medium text-gray-900">{e.name}</td>
                        <td className="px-4 py-3"><p className="text-gray-600">{e.email}</p><p className="text-xs text-gray-400">{e.phone || '—'}</p></td>
                        <td className="px-4 py-3 text-gray-600">{e.grade || '—'}</td>
                        <td className="px-4 py-3 text-gray-500 text-xs">{formatDate(e.createdAt)}</td>
                        <td className="px-4 py-3">
                          <select value={e.status} onChange={async ev => { await updateEnquiry(e._id, { status: ev.target.value }); setEnquiries(enquiries.map(x => x._id === e._id ? {...x, status: ev.target.value} : x)) }}
                            className={`text-xs px-2 py-1 rounded-full font-medium border-0 cursor-pointer ${statusColor[e.status]}`}>
                            {['new','contacted','pending','closed'].map(s => <option key={s} value={s}>{s}</option>)}
                          </select>
                        </td>
                        <td className="px-4 py-3"><button onClick={async () => { if(confirm('Delete?')) { await deleteEnquiry(e._id); setEnquiries(enquiries.filter(x => x._id !== e._id)); flash('Deleted') } }} className="p-1 text-gray-400 hover:text-red-500 rounded"><Trash2 size={14} /></button></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                {!enquiries.length && <p className="px-4 py-10 text-sm text-gray-400 text-center">No enquiries yet.</p>}
              </div>
            </div>
          )}

        </main>
      </div>
    </div>
  )
}
