import axios from 'axios';

const api = axios.create({
  baseURL: 'http://192.168.0.122:8080', // Substitua pelo IP da sua máquina
  timeout: 5000, // Tempo limite opcional
});

export default api;