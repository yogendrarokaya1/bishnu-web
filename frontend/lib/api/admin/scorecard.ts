import axiosInstance from "../axios";

export const initScorecard = async (matchId: string) => {
  try {
    const r = await axiosInstance.post('/api/admin/scorecards/init', { matchId });
    return r.data;
  } catch (e: any) { throw new Error(e.response?.data?.message || e.message); }
}
export const upsertInnings = async (matchId: string, data: any) => {
  try {
    const r = await axiosInstance.put(`/api/admin/scorecards/${matchId}/innings`, data);
    return r.data;
  } catch (e: any) { throw new Error(e.response?.data?.message || e.message); }
}
export const updateLiveScore = async (matchId: string, data: any) => {
  try {
    const r = await axiosInstance.put(`/api/admin/scorecards/${matchId}/live`, data);
    return r.data;
  } catch (e: any) { throw new Error(e.response?.data?.message || e.message); }
}
export const clearLiveScore = async (matchId: string) => {
  try {
    const r = await axiosInstance.delete(`/api/admin/scorecards/${matchId}/live`);
    return r.data;
  } catch (e: any) { throw new Error(e.response?.data?.message || e.message); }
}
export const deleteScorecard = async (matchId: string) => {
  try {
    const r = await axiosInstance.delete(`/api/admin/scorecards/${matchId}`);
    return r.data;
  } catch (e: any) { throw new Error(e.response?.data?.message || e.message); }
}
