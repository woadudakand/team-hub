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
        const isFormData =
            typeof FormData !== 'undefined' && data instanceof FormData;
        return client({
            method: 'POST',
            url: path,
            data,
            headers: isFormData
                ? { ...authHeader(), ...optionalHeader }
                : {
                      ...authHeader(),
                      'Content-Type': 'application/json',
                      ...optionalHeader,
                  },
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

// Announcements API helpers
export const fetchAnnouncements = async ({ page = 1, limit = 10, search = '' } = {}) => {
    const params = [];
    if (page) params.push(`page=${page}`);
    if (limit) params.push(`limit=${limit}`);
    if (search) params.push(`search=${encodeURIComponent(search)}`);
    const query = params.length ? `?${params.join('&')}` : '';
    const res = await DataService.get(`/announcements${query}`);
    return res.data;
};

export const searchAnnouncements = async (search) => {
    const res = await DataService.get(
        `/announcements?search=${encodeURIComponent(search)}`
    );
    return res.data.data || res.data;
};

export const createAnnouncement = async (data) => {
    const res = await DataService.post('/announcements', data);
    return res.data;
};

export const updateAnnouncement = async (id, data) => {
    const res = await DataService.put(`/announcements/${id}`, data);
    return res.data;
};

export const deleteAnnouncement = async (id) => {
    const res = await DataService.delete(`/announcements/${id}`);
    return res.data;
};

export { DataService };

// --- JWT AUTH FIX FOR FASTIFY ---
// In your backend/app.js, add this after registering plugins:
// fastify.register(require('@fastify/jwt'), { secret: process.env.JWT_SECRET });
// fastify.decorate('authenticate', async function (request, reply) {
//   try {
//     await request.jwtVerify();
//   } catch (err) {
//     reply.code(401).send({ error: 'Unauthorized' });
//   }
// });
//
// In your routes, use { preHandler: [fastify.authenticate] } for protected routes.
//
// If you want to keep your custom isAuthenticated, update it as follows:
//
// In plugins/support.js:
// const fp = require('fastify-plugin');
// module.exports = fp(async function (fastify, opts) {
//   fastify.decorate('isAuthenticated', function (req, reply, done) {
//     const auth = req.headers.authorization;
//     if (!auth) return reply.code(401).send({ error: 'Unauthorized' });
//     const token = auth.split(' ')[1];
//     try {
//       req.user = fastify.jwt.verify(token);
//       done();
//     } catch (e) {
//       reply.code(401).send({ error: 'Invalid token' });
//     }
//   });
// });
//
// Then in your routes, use { preHandler: [fastify.isAuthenticated] }
//
// This ensures req.user is set and your protected routes work as expected.
