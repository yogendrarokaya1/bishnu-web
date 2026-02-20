// This axios instance never attaches an auth token.
// Use it for all public endpoints like /api/matches
import axios from 'axios';

const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:5050';

const publicAxios = axios.create({
    baseURL: BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

export default publicAxios;
