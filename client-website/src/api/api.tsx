
import axios from 'axios';
import { urlConfig } from '../config';

const instance = axios.create({
    baseURL: urlConfig.baseUrl,
    withCredentials: true
});

const api = {
    login: (headers: any) => instance.get('auth/login',{headers}),
    getCurrentUser: ()=> instance.get('/auth/@me'),
    addUserName: (body: any) =>instance.post('/auth/addUserName', {body}),
    logout: ()=> instance.get('/auth/logout')
};

export default api;