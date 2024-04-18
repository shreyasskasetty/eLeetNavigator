import axios from 'axios';

const instance = axios.create({
});

const api = {
    getCurrentUser: (headers: any)=> instance.get('http://localhost:3000/auth/@me', headers),
};

export default api;