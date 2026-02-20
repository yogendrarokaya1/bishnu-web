"use server";
import { getPublicMatches, getPublicMatchById } from "@/lib/api/match";

export const handleGetPublicMatches = async (
    page: string,
    limit: string,
    status?: string,
    format?: string
) => {
    try {
        const response = await getPublicMatches(
            parseInt(page) || 1,
            parseInt(limit) || 10,
            status,
            format
        );

        if (response.success) {
            return {
                success: true,
                data: response.data.matches,
                pagination: response.data.pagination,
            };
        }
        return { success: false, message: response.message || 'Failed to load matches', data: [], pagination: null };
    } catch (error: any) {
        return { success: false, message: error.message || 'Failed to load matches', data: [], pagination: null };
    }
}

export const handleGetPublicMatchById = async (id: string) => {
    try {
        const response = await getPublicMatchById(id);
        if (response.success) {
            return { success: true, data: response.data };
        }
        return { success: false, message: response.message || 'Match not found', data: null };
    } catch (error: any) {
        return { success: false, message: error.message || 'Match not found', data: null };
    }
}
