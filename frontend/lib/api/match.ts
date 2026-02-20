import { API } from "./endpoints";
import publicAxios from "./publicAxios";

export const getPublicMatches = async (
    page: number, limit: number, status?: string, format?: string
) => {
    try {
        const response = await publicAxios.get(API.MATCHES.GET_ALL, {
            params: {
                page,
                limit,
                ...(status && { status }),
                ...(format && { format }),
            }
        });
        return response.data;
    } catch (error: any) {
        throw new Error(error.response?.data?.message || error.message || 'Get matches failed');
    }
}

export const getPublicMatchById = async (id: string) => {
    try {
        const response = await publicAxios.get(API.MATCHES.GET_ONE(id));
        return response.data;
    } catch (error: any) {
        throw new Error(error.response?.data?.message || error.message || 'Get match failed');
    }
}
