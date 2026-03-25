import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

const api = axios.create({ baseURL: API_URL });

// Attach JWT token to every request automatically
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('ga_admin_token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export default api;

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

// Auth
export const loginAdmin = (data) => api.post('/auth/login', data);
