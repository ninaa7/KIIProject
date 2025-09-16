import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

const api = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// API функции
export const getItems = () => api.get('/items');
export const getItem = (id) => api.get(`/items/${id}`);
export const createItem = (item) => api.post('/items', item);
export const updateItem = (id, item) => api.put(`/items/${id}`, item);
export const deleteItem = (id) => api.delete(`/items/${id}`);

export default api;