import axios from 'axios';
import dayjs from 'dayjs';
import { jwtDecode } from 'jwt-decode';

const request = axios.create({
    // baseURL: `${import.meta.env.VITE_BASE_URL}`,
    baseURL: ``,
    // headers: { 'Content-Type': 'application/json' },
    // withCredentials: true,
});

export const get = async (url, params = {}) => {
    const response = await request.get(url, params);
    return response;
};

export const post = async (url, params = {}) => {
    const response = await request.post(url, params);

    return response;
};

export const put = async (url, params = {}) => {
    const response = await request.put(url, params);

    return response;
};

export const remove = async (url, params = {}) => {
    const response = await request.delete(url, params);

    return response;
};


const refreshAccessToken = async () => {
    try {

        let user = localStorage.getItem('user');
        let refreshToken = null;
        if (user) {
            let userObj = JSON.parse(user);
            refreshToken = userObj.refreshToken;
        }

        const response = await axios.post(`${import.meta.env.VITE_BASE_URL}/api/v1/public/refresh-token`, {}, {
            headers: { 'RefreshToken': refreshToken }
        });

        localStorage.setItem('accessToken', response.data.token);
        return response.data.token;
    } catch (error) {
        console.error('Error refreshing token:', error);
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        window.location.href = '/';
        return null;
    }
};

request.interceptors.request.use(async function (config) {
    const publicUrls = [
        '/api/v1/public/login',
        '/api/v1/public/refresh-token',
        '/api/v1/public/register',
        '/api/v1/public/register/verification',
        '/api/v1/reviews/top-trending'
    ];

    if (publicUrls.some(url => config.url.includes(url))) {
        return config;
    }

    let user = localStorage.getItem('user');

    let token = null;

    if (user) {
        let userObj = JSON.parse(user);

        token = userObj.accessToken;
    }

    if (token) {
        const user = jwtDecode(token);
        
        const isExpired = dayjs.unix(user.exp).diff(dayjs()) < 1;

        console.log("token het han r", isExpired);

        if (isExpired) {
            token = await refreshAccessToken();
        }
        
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
    }

    return config;
}, function (error) {
    return Promise.reject(error);
});


// request.interceptors.response.use(response => {
//     return response.data;
// }, error => {
//     return Promise.reject(error);
// });

request.interceptors.response.use(
    response => {
        return response;
    },
    async error => {
        const originalRequest = error.config;

        if (error.response && error.response.status === 401) {
            // Token có thể đã hết hạn mà chưa kịp refresh
            try {
                const newToken = await refreshAccessToken();

                if (newToken && !originalRequest._retry) {
                    originalRequest._retry = true; // tránh lặp vô hạn

                    // Gắn lại token mới
                    originalRequest.headers.Authorization = `Bearer ${newToken}`;

                    return request(originalRequest); // gửi lại request
                } else {
                    // Nếu không lấy được token mới → redirect
                    localStorage.removeItem('user');
                    window.location.href = '/login';
                }
            } catch (e) {
                console.error('Token refresh failed:', e);
                localStorage.removeItem('user');
                window.location.href = '/login';
            }
        }

        return Promise.reject(error);
    }
);
