"use server";
import { initScorecard, upsertInnings, updateLiveScore, clearLiveScore, deleteScorecard } from "@/lib/api/admin/scorecard";
import { revalidatePath } from "next/cache";

export const handleInitScorecard = async (matchId: string) => {
  try {
    const r = await initScorecard(matchId);
    if (r.success) { revalidatePath(`/admin/matches/${matchId}/scorecard`); return { success: true, data: r.data }; }
    return { success: false, message: r.message || 'Failed' };
  } catch (e: any) { return { success: false, message: e.message }; }
}

export const handleUpsertInnings = async (matchId: string, data: any) => {
  try {
    const r = await upsertInnings(matchId, data);
    if (r.success) { revalidatePath(`/admin/matches/${matchId}/scorecard`); return { success: true, data: r.data }; }
    return { success: false, message: r.message || 'Failed' };
  } catch (e: any) { return { success: false, message: e.message }; }
}

export const handleUpdateLiveScore = async (matchId: string, data: any) => {
  try {
    const r = await updateLiveScore(matchId, data);
    if (r.success) { revalidatePath(`/admin/matches/${matchId}/scorecard`); return { success: true, data: r.data }; }
    return { success: false, message: r.message || 'Failed' };
  } catch (e: any) { return { success: false, message: e.message }; }
}

export const handleClearLiveScore = async (matchId: string) => {
  try {
    const r = await clearLiveScore(matchId);
    if (r.success) { revalidatePath(`/admin/matches/${matchId}/scorecard`); return { success: true }; }
    return { success: false, message: r.message || 'Failed' };
  } catch (e: any) { return { success: false, message: e.message }; }
}

export const handleDeleteScorecard = async (matchId: string) => {
  try {
    const r = await deleteScorecard(matchId);
    if (r.success) { revalidatePath(`/admin/matches/${matchId}/scorecard`); return { success: true }; }
    return { success: false, message: r.message || 'Failed' };
  } catch (e: any) { return { success: false, message: e.message }; }
}
