
import axios from 'axios';
import { urlConfig } from '../config';

const instance = axios.create({
    baseURL: urlConfig.baseUrl,
    withCredentials: true
});

const api = {
    login: (headers: any) => instance.get('auth/login',{headers}),
     getCurrentUser: ()=> instance.get('/auth/@me'),
};

export default api;