import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

const api = axios.create({ baseURL: API_URL });

// Attach JWT token to every request automatically
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('ga_token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export default api;

// Auth
export const loginUser = (data) => api.post('/auth/login', data);
// backward compat
export const loginAdmin = (data) => api.post('/auth/login', { ...data, role: 'admin' });

// Notices
export const getNotices = () => api.get('/notices');
export const getAllNotices = () => api.get('/notices/all');
export const createNotice = (data) => api.post('/notices', data);
export const updateNotice = (id, data) => api.put(`/notices/${id}`, data);
export const deleteNotice = (id) => api.delete(`/notices/${id}`);

// Events
export const getEvents = () => api.get('/events');
export const createEvent = (data) => api.post('/events', data);
export const updateEvent = (id, data) => api.put(`/events/${id}`, data);
export const deleteEvent = (id) => api.delete(`/events/${id}`);

// Enquiries
export const getEnquiries = () => api.get('/enquiries');
export const createEnquiry = (data) => api.post('/enquiries', data);
export const updateEnquiry = (id, data) => api.put(`/enquiries/${id}`, data);
export const deleteEnquiry = (id) => api.delete(`/enquiries/${id}`);

// Gallery
export const getGallery = () => api.get('/gallery');
export const createGalleryImage = (data) => api.post('/gallery', data);
export const deleteGalleryImage = (id) => api.delete(`/gallery/${id}`);

// === ERP APIs ===

// Teachers
export const getTeachers = () => api.get('/teachers');
export const getTeacher = (id) => api.get(`/teachers/${id}`);
export const createTeacher = (data) => api.post('/teachers', data);

// Classes
export const getClasses = () => api.get('/classes');
export const getClass = (id) => api.get(`/classes/${id}`);
export const createClass = (data) => api.post('/classes', data);

// Students
export const getStudents = (params) => api.get('/students', { params });
export const getStudent = (id) => api.get(`/students/${id}`);
export const createStudent = (data) => api.post('/students', data);

// Attendance
export const markAttendance = (data) => api.post('/attendance', data);
export const getAttendance = (params) => api.get('/attendance', { params });

// Progress
export const addProgress = (data) => api.post('/progress', data);
export const getProgress = (params) => api.get('/progress', { params });

// Homework
export const addHomework = (data) => api.post('/homework', data);
export const getHomework = (params) => api.get('/homework', { params });
