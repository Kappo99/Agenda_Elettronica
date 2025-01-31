import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: '/api', // Set this to your API base URL if different
});

axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('CasaGialla_authToken'); // Retrieve the token from localStorage
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response && error.response.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const response = await axios.post('/api/auth/refresh-token', {}, { withCredentials: true });
        const newAccessToken = response.data.accessToken;
        localStorage.setItem('CasaGialla_authToken', newAccessToken);

        // Aggiorna l'header Authorization e ritenta la richiesta originale
        axios.defaults.headers.common['Authorization'] = `Bearer ${newAccessToken}`;
        return axiosInstance(originalRequest);
      } catch (refreshError) {
        console.error('Errore durante il refresh del token:', refreshError);
        window.location.href = '/login';
      }
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;
