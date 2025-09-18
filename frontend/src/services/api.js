import axios from "axios";

let baseURL = "";

const hostname = window.location.hostname;

if (hostname === "localhost") {
    baseURL = "http://localhost:5000";
} else if (hostname === "kiiproject.local") {
    baseURL = "/api";
} else {
    baseURL = "https://kiiproject.onrender.com";
}
const api = axios.create({
    baseURL,
    headers: {
        "Content-Type": "application/json",
    },
});


// API функции
export const getItems = () => api.get('/items');
export const getItem = (id) => api.get(`/items/${id}`);
export const createItem = (item) => api.post('/items', item);
export const updateItem = (id, item) => api.put(`/items/${id}`, item);
export const deleteItem = (id) => api.delete(`/items/${id}`);

export default api;