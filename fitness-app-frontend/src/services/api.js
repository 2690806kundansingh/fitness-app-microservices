import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8085/api';

const api = axios.create({
    baseURL: API_URL
});

// Helper to decode JWT payload safely
export const decodeJwt = (token) => {
    try {
        const base64Url = token.split('.')[1];
        if (!base64Url) return null;
        const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
        const jsonPayload = decodeURIComponent(
            atob(base64)
                .split('')
                .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
                .join('')
        );
        return JSON.parse(jsonPayload);
    } catch {
        return null;
    }
};

// Proactive Token Expiration & Refresh Mechanism
let tokenRefreshPromise = null;

export const ensureValidToken = async () => {
    let token = localStorage.getItem('token');
    if (!token) {
        token = sessionStorage.getItem('ROCP_token') || sessionStorage.getItem('token');
    }
    if (!token) return null;

    const payload = decodeJwt(token);
    const now = Math.floor(Date.now() / 1000);

    // If token is valid for more than 40 seconds, reuse it
    if (payload?.exp && (payload.exp - now) > 40) {
        return token;
    }

    // If token is expired or close to expiry, refresh it
    if (!tokenRefreshPromise) {
        tokenRefreshPromise = (async () => {
            const refreshToken = localStorage.getItem('refreshToken');
            try {
                // Strategy 1: Use refresh_token
                if (refreshToken) {
                    const data = await refreshKeycloakToken(refreshToken);
                    if (data?.access_token) {
                        localStorage.setItem('token', data.access_token);
                        if (data.refresh_token) {
                            localStorage.setItem('refreshToken', data.refresh_token);
                        }
                        return data.access_token;
                    }
                }
            } catch (err) {
                console.warn('Refresh token expired or failed, attempting direct re-auth:', err.message);
            }

            try {
                // Strategy 2: Silent re-auth with pre-seeded testuser credentials if Keycloak is up
                const data = await loginWithKeycloakDirect('testuser', 'password123');
                if (data?.access_token) {
                    localStorage.setItem('token', data.access_token);
                    if (data.refresh_token) {
                        localStorage.setItem('refreshToken', data.refresh_token);
                    }
                    return data.access_token;
                }
            } catch (e) {
                console.warn('Automatic direct re-authentication failed:', e.message);
            }

            return token;
        })().finally(() => {
            tokenRefreshPromise = null;
        });
    }
    return tokenRefreshPromise;
};

// Request Interceptor: Attach fresh token and X-User-ID
api.interceptors.request.use(async (config) => {
    let token = await ensureValidToken();
    let userId = localStorage.getItem('userId');

    if (!token) {
        token = localStorage.getItem('token') || sessionStorage.getItem('ROCP_token') || sessionStorage.getItem('token');
    }

    if (token) {
        config.headers['Authorization'] = `Bearer ${token}`;
        if (!userId) {
            const payload = decodeJwt(token);
            if (payload?.sub) {
                userId = payload.sub;
                localStorage.setItem('userId', userId);
            }
        }
    }

    if (userId) {
        config.headers['X-User-ID'] = userId;
    }
    return config;
}, (error) => {
    return Promise.reject(error);
});

// Response Interceptor: Auto-retry on 401 or 403 Unauthorized
api.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;
        if ((error.response?.status === 401 || error.response?.status === 403) && !originalRequest?._retry) {
            originalRequest._retry = true;
            try {
                // Force a fresh login or refresh
                const data = await loginWithKeycloakDirect('testuser', 'password123');
                if (data?.access_token) {
                    localStorage.setItem('token', data.access_token);
                    if (data.refresh_token) {
                        localStorage.setItem('refreshToken', data.refresh_token);
                    }
                    originalRequest.headers['Authorization'] = `Bearer ${data.access_token}`;
                    return api(originalRequest);
                }
            } catch (retryErr) {
                console.error('Session auto-recovery retry failed:', retryErr);
            }
        }
        return Promise.reject(error);
    }
);

// Workout Activities
export const getActivities = () => api.get('/activities');
export const getActivityById = (id) => api.get(`/activities/${id}`);
export const getActivityRecommendation = (id) => api.get(`/recommendations/activity/${id}`);
export const regenerateActivityRecommendation = (id) => api.post(`/recommendations/activity/${id}/generate`);
export const getActivityDetail = (id) => api.get(`/activities/${id}`);
export const addActivity = (activity) => api.post('/activities', activity);

// AI Coach & Generator
export const askAICoach = (data) => api.post('/recommendations/coach', data);
export const generateWorkoutPlan = (data) => api.post('/recommendations/plan', data);

// User Profile & Onboarding
export const getUserProfile = (userId) => {
    const id = userId || localStorage.getItem('userId');
    if (id) {
        return api.get(`/users/profile/${id}`);
    }
    return api.get('/users/profile');
};

export const updateUserProfile = (userId, data) => {
    const id = userId || localStorage.getItem('userId');
    const payload = { ...data, userId: id };
    if (id) {
        return api.put(`/users/profile/${id}`, payload);
    }
    return api.put('/users/profile', payload);
};

// Daily Progress & Streaks
export const getDailyProgress = (userId, date) => {
    const id = userId || localStorage.getItem('userId');
    const url = date ? `/users/${id}/daily-progress?date=${date}` : `/users/${id}/daily-progress`;
    return api.get(url);
};
export const saveDailyCheckin = (userId, data) => {
    const id = userId || localStorage.getItem('userId');
    return api.post(`/users/${id}/daily-progress`, data);
};
export const getUserStreak = (userId) => {
    const id = userId || localStorage.getItem('userId');
    return api.get(`/users/${id}/streak`);
};
export const getDailyProgressHistory = (userId, days = 7) => {
    const id = userId || localStorage.getItem('userId');
    return api.get(`/users/${id}/daily-progress/history?days=${days}`);
};

// FitBot Conversational Messaging Service
export const sendBotMessage = (data) => api.post('/recommendations/bot/chat', data);
export const getBotChatHistory = (userId) => api.get(`/recommendations/bot/history/${userId}`);
export const clearBotChat = (userId) => api.delete(`/recommendations/bot/history/${userId}`);
export const getBotDailyGreeting = (userId) => api.post(`/recommendations/bot/greeting/${userId}`);

// In-App Notifications
export const getNotifications = (userId) => api.get(`/recommendations/notifications/user/${userId}`);
export const getUnreadNotificationCount = (userId) => api.get(`/recommendations/notifications/user/${userId}/unread-count`);
export const markNotificationRead = (id) => api.put(`/recommendations/notifications/${id}/read`);
export const markAllNotificationsRead = (userId) => api.put(`/recommendations/notifications/user/${userId}/read-all`);
export const deleteNotification = (id) => api.delete(`/recommendations/notifications/${id}`);

// Keycloak Direct Auth & Health Service
export const KEYCLOAK_URL = import.meta.env.VITE_KEYCLOAK_URL || 'https://keycloak-production-abf4.up.railway.app/realms/fitness-oauth2';

export const checkKeycloakHealth = async () => {
    try {
        const response = await axios.get(`${KEYCLOAK_URL}/.well-known/openid-configuration`, { timeout: 3000 });
        return { online: response.status === 200, data: response.data };
    } catch (err) {
        return { online: false, error: err.message };
    }
};

export const refreshKeycloakToken = async (refreshToken) => {
    const params = new URLSearchParams();
    params.append('client_id', 'oauth2-pkce-client');
    params.append('grant_type', 'refresh_token');
    params.append('refresh_token', refreshToken);

    const response = await axios.post(
        `${KEYCLOAK_URL}/protocol/openid-connect/token`,
        params,
        {
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            timeout: 8000
        }
    );
    return response.data;
};

export const loginWithKeycloakDirect = async (username, password) => {
    const params = new URLSearchParams();
    params.append('client_id', 'oauth2-pkce-client');
    params.append('grant_type', 'password');
    params.append('username', username);
    params.append('password', password);

    const response = await axios.post(
        `${KEYCLOAK_URL}/protocol/openid-connect/token`,
        params,
        {
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            timeout: 8000
        }
    );
    return response.data;
};

export const createDemoUserSession = (username = 'testuser', email = 'testuser@fitness.com') => {
    const header = btoa(JSON.stringify({ alg: 'none', typ: 'JWT' }));
    const payload = btoa(JSON.stringify({
        sub: 'd8b1ab4e-f241-4bcf-8352-0d2fcbda134c',
        preferred_username: username,
        email: email,
        name: 'Test Athlete (Beginner)',
        given_name: 'Test',
        family_name: 'Athlete',
        roles: ['USER'],
        exp: Math.floor(Date.now() / 1000) + 86400
    }));
    const demoToken = `${header}.${payload}.demo_signature`;
    const user = {
        sub: 'd8b1ab4e-f241-4bcf-8352-0d2fcbda134c',
        preferred_username: username,
        email: email,
        name: 'Test Athlete (Beginner)'
    };
    return { token: demoToken, user };
};