import axios from 'axios';

const apiUrl = import.meta.env.VITE_API_URL;

const api = axios.create({
    baseURL: apiUrl
});

api.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

api.interceptors.response.use(
    (resposta) => resposta,
    (erro) => {
        if (erro.response && erro.response.status === 401 && erro.response.data.mensagem.toLowerCase().includes('token')) {
            localStorage.removeItem('token');
            window.location.href = '/login';
        }
        return Promise.reject(erro);
    }
);

export default api;