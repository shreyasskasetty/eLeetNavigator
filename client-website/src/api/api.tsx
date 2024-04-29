
import axios from 'axios';
import { urlConfig } from '../config';

const instance = axios.create({
    baseURL: urlConfig.baseUrl,
    withCredentials: true
});

const RECOMMENDATION_URL = 'user/decorRecommendation'
const STATS_URL = 'user/userStats'

const api = {
    login: (headers: any) => instance.get('auth/login',{headers}),
    getCurrentUser: ()=> instance.get('/auth/@me'),
    addUserName: (body: any) =>instance.post('/auth/addUserName', {body}),
    logout: ()=> instance.get('/auth/logout'),
    getRecommendation: (queryParams : any) => instance.get(RECOMMENDATION_URL, {
        params: {...queryParams}
    }),
    getUserStats: (queryParams: any)=> instance.get(STATS_URL ,{
        params : {
            ...queryParams
        }
    })
};

export default api;