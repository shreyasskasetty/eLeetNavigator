import axios from 'axios';

const instance = axios.create({
});

const api = {
    getCurrentUser: ()=> instance.get('http://localhost:3000/auth/@me'),
};

export default api;