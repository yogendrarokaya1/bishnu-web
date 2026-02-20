"use server";
import {
    createMatch, getAllMatches, getMatchById,
    updateMatch, deleteMatch, markMatchLive,
    markMatchCompleted, updateMatchToss
} from "@/lib/api/admin/match";
import { revalidatePath } from "next/cache";

export const handleCreateMatch = async (data: any) => {
    try {
        const response = await createMatch(data);
        if (response.success) {
            revalidatePath('/admin/matches');
            return { success: true, message: 'Match created successfully', data: response.data };
        }
        return { success: false, message: response.message || 'Create match failed' };
    } catch (error: any) {
        return { success: false, message: error.message || 'Create match action failed' };
    }
}

export const handleGetAllMatches = async (
    page: string, limit: string, status?: string, format?: string
) => {
    try {
        const response = await getAllMatches(parseInt(page) || 1, parseInt(limit) || 10, status, format);
        if (response.success) {
            return {
                success: true,
                data: response.data.matches,
                pagination: response.data.pagination
            };
        }
        return { success: false, message: response.message || 'Get matches failed' };
    } catch (error: any) {
        return { success: false, message: error.message || 'Get matches action failed' };
    }
}

export const handleGetOneMatch = async (id: string) => {
    try {
        const response = await getMatchById(id);
        if (response.success) {
            return { success: true, data: response.data };
        }
        return { success: false, message: response.message || 'Get match failed' };
    } catch (error: any) {
        return { success: false, message: error.message || 'Get match action failed' };
    }
}

export const handleUpdateMatch = async (id: string, data: any) => {
    try {
        const response = await updateMatch(id, data);
        if (response.success) {
            revalidatePath('/admin/matches');
            return { success: true, message: 'Match updated successfully', data: response.data };
        }
        return { success: false, message: response.message || 'Update match failed' };
    } catch (error: any) {
        return { success: false, message: error.message || 'Update match action failed' };
    }
}

export const handleDeleteMatch = async (id: string) => {
    try {
        const response = await deleteMatch(id);
        if (response.success) {
            revalidatePath('/admin/matches');
            return { success: true, message: 'Match deleted successfully' };
        }
        return { success: false, message: response.message || 'Delete match failed' };
    } catch (error: any) {
        return { success: false, message: error.message || 'Delete match action failed' };
    }
}

export const handleMarkLive = async (id: string) => {
    try {
        const response = await markMatchLive(id);
        if (response.success) {
            revalidatePath('/admin/matches');
            return { success: true, message: 'Match is now live', data: response.data };
        }
        return { success: false, message: response.message || 'Mark live failed' };
    } catch (error: any) {
        return { success: false, message: error.message || 'Mark live action failed' };
    }
}

export const handleMarkCompleted = async (id: string, result: string) => {
    try {
        const response = await markMatchCompleted(id, result);
        if (response.success) {
            revalidatePath('/admin/matches');
            return { success: true, message: 'Match marked as completed', data: response.data };
        }
        return { success: false, message: response.message || 'Mark completed failed' };
    } catch (error: any) {
        return { success: false, message: error.message || 'Mark completed action failed' };
    }
}

export const handleUpdateToss = async (id: string, winner: string, decision: 'bat' | 'bowl') => {
    try {
        const response = await updateMatchToss(id, winner, decision);
        if (response.success) {
            revalidatePath('/admin/matches');
            return { success: true, message: 'Toss updated', data: response.data };
        }
        return { success: false, message: response.message || 'Update toss failed' };
    } catch (error: any) {
        return { success: false, message: error.message || 'Update toss action failed' };
    }
}
