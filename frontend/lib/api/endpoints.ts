export const API = {
    AUTH: {
        LOGIN: '/api/auth/login',
        REGISTER: '/api/auth/register',
        WHOAMI: '/api/auth/whoami',
        UPDATEPROFILE: '/api/auth/update-profile',
        REQUEST_PASSWORD_RESET: '/api/auth/request-password-reset',
        RESET_PASSWORD: (token: string) => `/api/auth/reset-password/${token}`,
    },

    ADMIN: {
        USER: {
            CREATE: '/api/admin/users/',
            GET_ALL: '/api/admin/users/',
            GET_ONE: (userId: string) => `/api/admin/users/${userId}`,
            UPDATE: (userId: string) => `/api/admin/users/${userId}`,
            DELETE: (userId: string) => `/api/admin/users/${userId}`,
        },
        MATCH: {
            CREATE: '/api/admin/matches',
            GET_ALL: '/api/admin/matches',
            GET_ONE: (matchId: string) => `/api/admin/matches/${matchId}`,
            UPDATE: (matchId: string) => `/api/admin/matches/${matchId}`,
            DELETE: (matchId: string) => `/api/admin/matches/${matchId}`,
            MARK_LIVE: (matchId: string) => `/api/admin/matches/${matchId}/live`,
            MARK_COMPLETED: (matchId: string) => `/api/admin/matches/${matchId}/complete`,
            UPDATE_TOSS: (matchId: string) => `/api/admin/matches/${matchId}/toss`,
        },
        SCORECARD: {
            INIT: '/api/admin/scorecards/init',
            UPSERT_INNINGS: (matchId: string) => `/api/admin/scorecards/${matchId}/innings`,
            UPDATE_LIVE: (matchId: string) => `/api/admin/scorecards/${matchId}/live`,
            CLEAR_LIVE: (matchId: string) => `/api/admin/scorecards/${matchId}/live`,
            DELETE: (matchId: string) => `/api/admin/scorecards/${matchId}`,
        },


    },

    MATCHES: {
        GET_ALL: '/api/matches',
        HOME: '/api/matches/home',
        LIVE: '/api/matches/live',
        UPCOMING: '/api/matches/upcoming',
        RECENT: '/api/matches/recent',
        GET_ONE: (matchId: string) => `/api/matches/${matchId}`,
    },

    SCORECARDS: {
        GET_BY_MATCH: (matchId: string) => `/api/scorecards/${matchId}`,
    },
    
}

// Add these to your existing endpoints.ts file

export const NEWS = {
    ALL: '/api/news',
    FEATURED: '/api/news/featured',
    BREAKING: '/api/news/breaking',
    LATEST: '/api/news/latest',
    BY_SLUG: (slug: string) => `/api/news/${slug}`,
};

export const ADMIN_NEWS = {
    ALL: '/api/admin/news',
    ONE: (id: string) => `/api/admin/news/${id}`,
    CREATE: '/api/admin/news',
    UPDATE: (id: string) => `/api/admin/news/${id}`,
    DELETE: (id: string) => `/api/admin/news/${id}`,
};
