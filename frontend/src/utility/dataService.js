import axios from 'axios';
import { getItem } from './localStorageControl';

const API_ENDPOINT = `${import.meta.env.VITE_API_URL}`;

const authHeader = () => ({
    Authorization: `Bearer ${getItem('token')}`,
});

const client = axios.create({
    baseURL: API_ENDPOINT,
    // Remove default Content-Type so browser can set it for FormData
    headers: {
        Authorization: `Bearer ${getItem('token')}`,
    },
});

class DataService {
    static get(path = '') {
        return client({
            method: 'GET',
            url: path,
            headers: { ...authHeader() },
        });
    }

    static post(path = '', data = {}, optionalHeader = {}) {
        // If data is FormData, do not set Content-Type header
        const isFormData = typeof FormData !== 'undefined' && data instanceof FormData;
        return client({
            method: 'POST',
            url: path,
            data,
            headers: isFormData ? { ...authHeader(), ...optionalHeader } : { ...authHeader(), 'Content-Type': 'application/json', ...optionalHeader },
        });
    }

    static patch(path = '', data = {}) {
        return client({
            method: 'PATCH',
            url: path,
            data: JSON.stringify(data),
            headers: { ...authHeader(), 'Content-Type': 'application/json' },
        });
    }

    static put(path = '', data = {}) {
        return client({
            method: 'PUT',
            url: path,
            data: JSON.stringify(data),
            headers: { ...authHeader(), 'Content-Type': 'application/json' },
        });
    }

    static delete(path = '', data = {}) {
        return client({
            method: 'DELETE',
            url: path,
            data,
            headers: { ...authHeader(), 'Content-Type': 'application/json' },
        });
    }
}

/**
 * axios interceptors runs before and after a request, letting the developer modify req,req more
 * For more details on axios interceptor see https://github.com/axios/axios#interceptors
 */
client.interceptors.request.use((config) => {
    // do something before executing the request
    // For example tag along the bearer access token to request header or set a cookie
    const requestConfig = config;
    const { headers } = config;
    requestConfig.headers = {
        ...headers,
        Authorization: `Bearer ${getItem('token')}`,
    };

    return requestConfig;
});

client.interceptors.response.use(
    (response) => response,
    (error) => {
        /**
         * Do something in case the response returns an error code [3**, 4**, 5**] etc
         * For example, on token expiration retrieve a new access token, retry a failed request etc
         */
        const { response } = error;
        const originalRequest = error.config;
        if (response) {
            if (response.status === 500) {
                // do something here
            } else {
                return originalRequest;
            }
        }
        return Promise.reject(error);
    }
);
export { DataService };
