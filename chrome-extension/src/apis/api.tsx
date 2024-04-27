import axios from 'axios';

const END_POINT = "http://localhost:3000/"

const instance = axios.create({
    baseURL: END_POINT,
    withCredentials: true
});

const api = {
    getCurrentUser: ()=> instance.get('auth/@me'),
    getRecommendation: (queryParams: any)=> instance.get('user/recommendations', {params: queryParams})
};

export default api;