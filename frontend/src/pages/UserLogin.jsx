import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Eye, EyeOff, Lock, Mail, AlertCircle, BookOpen, GraduationCap } from 'lucide-react'
import { loginUser } from '../api'

const roles = [
  { id: 'teacher', label: 'Teacher', icon: BookOpen, color: 'from-blue-500 to-blue-600', desc: 'Manage classes & students' },
  { id: 'student', label: 'Student', icon: GraduationCap, color: 'from-green-500 to-green-600', desc: 'View your progress' },
]

export default function UserLogin() {
  const [role, setRole] = useState('teacher')
  const [form, setForm] = useState({ email: '', password: '' })
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    try {
      const res = await loginUser({ ...form, role })
      localStorage.setItem('ga_token', res.data.token)
      localStorage.setItem('ga_role', res.data.role)
      localStorage.setItem('ga_email', res.data.email)
      if (res.data.name) localStorage.setItem('ga_name', res.data.name)

      if (res.data.role === 'teacher') navigate('/teacher/dashboard')
      else if (res.data.role === 'student') navigate('/student/dashboard')
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const selectedRole = roles.find(r => r.id === role)

  return (
    <div className="min-h-screen flex items-center justify-center py-12 px-4" style={{ background: 'linear-gradient(135deg, #e6f2f7 0%, #cce5ef 100%)' }}>
      <div className="max-w-md w-full space-y-6">
        <div className="text-center">
          <div className={`mx-auto h-16 w-16 bg-gradient-to-br ${selectedRole.color} rounded-2xl flex items-center justify-center mb-4 shadow-lg`}>
            <selectedRole.icon size={32} className="text-white" />
          </div>
          <h2 className="text-3xl font-bold text-gray-900">Welcome Back</h2>
          <p className="mt-1 text-sm text-gray-600">Sign in to GA School Portal</p>
        </div>

        {/* Role Selector */}
        <div className="flex gap-2 bg-white rounded-xl p-1.5 shadow-sm border border-gray-200">
          {roles.map(r => (
            <button key={r.id} onClick={() => { setRole(r.id); setError('') }}
              className={`flex-1 flex flex-col items-center py-3 px-2 rounded-lg text-xs font-medium transition-all ${role === r.id ? `bg-gradient-to-br ${r.color} text-white shadow-md` : 'text-gray-500 hover:bg-gray-50'}`}>
              <r.icon size={18} className="mb-1" />
              {r.label}
            </button>
          ))}
        </div>

        <div className="bg-white rounded-xl shadow-xl p-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-3 flex items-center gap-2">
                <AlertCircle size={16} className="text-red-600 flex-shrink-0" />
                <span className="text-red-800 text-sm">{error}</span>
              </div>
            )}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Email Address</label>
              <div className="relative">
                <Mail size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input type="email" value={form.email} onChange={e => setForm({...form, email: e.target.value})} required
                  className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none"
                  placeholder="Enter your email address" />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Password</label>
              <div className="relative">
                <Lock size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input type={showPassword ? 'text' : 'password'} value={form.password} onChange={e => setForm({...form, password: e.target.value})} required
                  className="w-full pl-10 pr-10 py-2.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none"
                  placeholder="Enter your password" />
                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>
            <button type="submit" disabled={loading}
              className={`w-full py-2.5 rounded-lg text-white font-medium text-sm bg-gradient-to-r ${selectedRole.color} hover:opacity-90 transition-opacity disabled:opacity-50`}>
              {loading ? 'Signing in...' : `Sign In as ${selectedRole.label}`}
            </button>
          </form>
        </div>

        <div className="text-center">
          <Link to="/" className="text-primary-600 hover:text-primary-500 font-medium text-sm">← Back to Website</Link>
        </div>
      </div>
    </div>
  )
}
