import { API } from "../endpoints";
import axios from "../axios";

export const createMatch = async (data: any) => {
    try {
        const response = await axios.post(API.ADMIN.MATCH.CREATE, data);
        return response.data;
    } catch (error: any) {
        throw new Error(error.response?.data?.message || error.message || 'Create match failed');
    }
}

export const getAllMatches = async (page: number, limit: number, status?: string, format?: string) => {
    try {
        const response = await axios.get(API.ADMIN.MATCH.GET_ALL, {
            params: { page, limit, status, format }
        });
        return response.data;
    } catch (error: any) {
        throw new Error(error.response?.data?.message || error.message || 'Get all matches failed');
    }
}

export const getMatchById = async (id: string) => {
    try {
        const response = await axios.get(API.ADMIN.MATCH.GET_ONE(id));
        return response.data;
    } catch (error: any) {
        throw new Error(error.response?.data?.message || error.message || 'Get match failed');
    }
}

export const updateMatch = async (id: string, data: any) => {
    try {
        const response = await axios.patch(API.ADMIN.MATCH.UPDATE(id), data);
        return response.data;
    } catch (error: any) {
        throw new Error(error.response?.data?.message || error.message || 'Update match failed');
    }
}

export const deleteMatch = async (id: string) => {
    try {
        const response = await axios.delete(API.ADMIN.MATCH.DELETE(id));
        return response.data;
    } catch (error: any) {
        throw new Error(error.response?.data?.message || error.message || 'Delete match failed');
    }
}

export const markMatchLive = async (id: string) => {
    try {
        const response = await axios.patch(API.ADMIN.MATCH.MARK_LIVE(id));
        return response.data;
    } catch (error: any) {
        throw new Error(error.response?.data?.message || error.message || 'Mark live failed');
    }
}

export const markMatchCompleted = async (id: string, result: string) => {
    try {
        const response = await axios.patch(API.ADMIN.MATCH.MARK_COMPLETED(id), { result });
        return response.data;
    } catch (error: any) {
        throw new Error(error.response?.data?.message || error.message || 'Mark completed failed');
    }
}

export const updateMatchToss = async (id: string, winner: string, decision: 'bat' | 'bowl') => {
    try {
        const response = await axios.patch(API.ADMIN.MATCH.UPDATE_TOSS(id), { winner, decision });
        return response.data;
    } catch (error: any) {
        throw new Error(error.response?.data?.message || error.message || 'Update toss failed');
    }
}
