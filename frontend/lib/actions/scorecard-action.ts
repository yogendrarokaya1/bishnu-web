"use server";
import { getScorecardByMatchId } from "@/lib/api/scorecard";

export const handleGetScorecard = async (matchId: string) => {
  try {
    const response = await getScorecardByMatchId(matchId);
    if (response.success) return { success: true, data: response.data };
    return { success: false, message: response.message || 'Scorecard not found', data: null };
  } catch (error: any) {
    return { success: false, message: error.message || 'Failed to load scorecard', data: null };
  }
}
