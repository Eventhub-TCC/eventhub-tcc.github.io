import axios from 'axios';

const api = axios.create({
    baseURL: 'http://localhost:3000'
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
        if (erro.response.status === 401 && erro.response.data.mensagem.toLowerCase().includes('token')) {
            localStorage.removeItem('token');
            window.location.href = '/login';
        }
        return Promise.reject(erro);
    }
);

export default api;