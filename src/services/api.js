import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL;

if (!API_URL) {
  throw new Error('VITE_API_URL is required. Set it to the backend API URL.');
}

const api = axios.create({
  baseURL: API_URL,
});

// Request interceptor to attach JWT token
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});

export const authAPI = {
  login: async (email, password) => {
    const params = new URLSearchParams();
    params.append('username', email);
    params.append('password', password);
    const res = await api.post('/auth/token', params, {
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
    });
    return res.data;
  },
  register: async (email, password, role = 'student') => {
    const res = await api.post('/auth/register', { email, password, role });
    return res.data;
  },
  getMe: async () => {
    const res = await api.get('/auth/me');
    return res.data;
  }
};

export const studentAPI = {
  getProfile: async () => {
    const res = await api.get('/student/profile');
    return res.data;
  },
  updateProfile: async (profileData) => {
    const res = await api.put('/student/profile', profileData);
    return res.data;
  },
  getDashboardWidgets: async () => {
    const res = await api.get('/student/dashboard-widgets');
    return res.data;
  }
};

export const careerAPI = {
  getCareers: async (params = {}) => {
    const res = await api.get('/careers', { params });
    return res.data;
  },
  getCareer: async (id) => {
    const res = await api.get(`/careers/${id}`);
    return res.data;
  },
  toggleSaveCareer: async (careerId) => {
    const res = await api.post('/careers/save', { career_id: careerId });
    return res.data;
  },
  getSavedCareers: async () => {
    const res = await api.get('/careers/saved/list');
    return res.data;
  }
};

export const directoryAPI = {
  getColleges: async (params = {}) => {
    const res = await api.get('/colleges', { params });
    return res.data;
  },
  getCollege: async (id) => {
    const res = await api.get(`/colleges/${id}`);
    return res.data;
  },
  getExams: async (params = {}) => {
    const res = await api.get('/exams', { params });
    return res.data;
  },
  getExam: async (id) => {
    const res = await api.get(`/exams/${id}`);
    return res.data;
  },
  getScholarships: async (params = {}) => {
    const res = await api.get('/scholarships', { params });
    return res.data;
  },
  getScholarship: async (id) => {
    const res = await api.get(`/scholarships/${id}`);
    return res.data;
  }
};

export const assessmentAPI = {
  getQuestions: async () => {
    const res = await api.get('/assessment/questions');
    return res.data;
  },
  submitResponses: async (responses) => {
    const res = await api.post('/assessment/submit', { responses });
    return res.data;
  },
  getResults: async () => {
    const res = await api.get('/assessment/results');
    return res.data;
  }
};

export const chatAPI = {
  sendMessage: async (message, history = []) => {
    const res = await api.post('/chat/', { message, history });
    return res.data;
  }
};

export const adminAPI = {
  getAnalytics: async () => {
    const res = await api.get('/admin/analytics');
    return res.data;
  },
  // Careers CRUD
  createCareer: async (data) => {
    const res = await api.post('/admin/careers', data);
    return res.data;
  },
  updateCareer: async (id, data) => {
    const res = await api.put(`/admin/careers/${id}`, data);
    return res.data;
  },
  deleteCareer: async (id) => {
    const res = await api.delete(`/admin/careers/${id}`);
    return res.data;
  },
  // Colleges CRUD
  createCollege: async (data) => {
    const res = await api.post('/admin/colleges', data);
    return res.data;
  },
  updateCollege: async (id, data) => {
    const res = await api.put(`/admin/colleges/${id}`, data);
    return res.data;
  },
  deleteCollege: async (id) => {
    const res = await api.delete(`/admin/colleges/${id}`);
    return res.data;
  },
  // Exams CRUD
  createExam: async (data) => {
    const res = await api.post('/admin/exams', data);
    return res.data;
  },
  updateExam: async (id, data) => {
    const res = await api.put(`/admin/exams/${id}`, data);
    return res.data;
  },
  deleteExam: async (id) => {
    const res = await api.delete(`/admin/exams/${id}`);
    return res.data;
  },
  // Scholarships CRUD
  createScholarship: async (data) => {
    const res = await api.post('/admin/scholarships', data);
    return res.data;
  },
  updateScholarship: async (id, data) => {
    const res = await api.put(`/admin/scholarships/${id}`, data);
    return res.data;
  },
  deleteScholarship: async (id) => {
    const res = await api.delete(`/admin/scholarships/${id}`);
    return res.data;
  }
};

export default api;
