// src/services/api.js
import axios from 'axios';

/**
 * 后端基址优先读 REACT_APP_API_BASE，其次 REACT_APP_API_URL。
 * 两者都没配置则为空字符串（相对路径），方便本地配 proxy。
 * 另外把尾部多余的 "/" 去掉，避免出现 "//api/xxx"。
 */
const RAW_BASE =
  process.env.REACT_APP_API_BASE ||
  process.env.REACT_APP_API_URL ||
  '';
const API_BASE_URL = RAW_BASE.replace(/\/+$/, ''); // e.g. https://xxx.azurewebsites.net

const api = axios.create({
  baseURL: API_BASE_URL,           // 最终请求会是 `${API_BASE_URL}${path}`
  withCredentials: true,           // 如需跨域 Cookie/会话请保留；否则改为 false
  headers: { 'Content-Type': 'application/json' },
  timeout: 15000,
});

// ========== 拦截器 ==========
api.interceptors.request.use(
  (config) => {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    if (user.token) {
      config.headers.Authorization = `Bearer ${user.token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('user');
      // 注意：若你的路由基于 BrowserRouter，这里跳转到 /login
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// ========== 可选：健康检查 ==========
export const healthAPI = {
  ping: () => api.get('/healthz'),
};

// ========== Auth ==========
export const authAPI = {
  login: (credentials) => api.post('/auth/login', credentials),
  register: (userData) => api.post('/auth/register', userData),
  logout: () => api.post('/auth/logout'),
  getProfile: () => api.get('/auth/me'),
};

// ========== Attractions ==========
export const attractionsAPI = {
  getAll: () => api.get('/api/attractions'),
  getById: (id) => api.get(`/api/attractions/${id}`),
  create: (data) => api.post('/api/attractions', data),
  update: (id, data) => api.put(`/api/attractions/${id}`, data),
  delete: (id) => api.delete(`/api/attractions/${id}`),
};

// ========== Restaurants ==========
export const restaurantsAPI = {
  getAll: () => api.get('/api/restaurants'),
  getById: (id) => api.get(`/api/restaurants/${id}`),
  create: (data) => api.post('/api/restaurants', data),
  update: (id, data) => api.put(`/api/restaurants/${id}`, data),
  delete: (id) => api.delete(`/api/restaurants/${id}`),
};

// ========== Checklist ==========
export const checklistAPI = {
  get: (userId) => api.get(`/api/checklists/${userId}`),
  add: (userId, item) => api.post(`/api/checklists/${userId}/add`, item),
  // DELETE 携带 body（axios 需要通过 config.data 传递）
  remove: (userId, itemId, itemType) =>
    api.delete(`/api/checklists/${userId}/remove`, {
      data: { itemId, itemType },
      headers: { 'Content-Type': 'application/json' },
    }),
};

// ========== Community ==========
export const communityAPI = {
  getPosts: () => api.get('/api/posts'),
  getPost: (id) => api.get(`/api/posts/${id}`),
  createPost: (data) => api.post('/api/posts', data),
  updatePost: (id, data) => api.put(`/api/posts/${id}`, data),
  deletePost: (id) => api.delete(`/api/posts/${id}`),
  // likePost / getMyPosts 可按后端支持再补
};

// ========== Admin ==========
export const adminAPI = {
  // Attractions
  createAttraction: (data) => api.post('/admin/attractions', data),
  updateAttraction: (id, data) => api.put(`/admin/attractions/${id}`, data),
  deleteAttraction: (id) => api.delete(`/admin/attractions/${id}`),

  // Restaurants
  createRestaurant: (data) => api.post('/admin/restaurants', data),
  updateRestaurant: (id, data) => api.put(`/admin/restaurants/${id}`, data),
  deleteRestaurant: (id) => api.delete(`/admin/restaurants/${id}`),

  // Posts
  getAllPosts: () => api.get('/admin/posts'),
  deletePost: (id) => api.delete(`/admin/posts/${id}`),

  // Users
  getAllUsers: () => api.get('/admin/users'),
  updateUser: (id, data) => api.put(`/admin/users/${id}`, data),
  deleteUser: (id) => api.delete(`/admin/users/${id}`),
};

export default api;
