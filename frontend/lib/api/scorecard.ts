import publicAxios from "./publicAxios";

export const getScorecardByMatchId = async (matchId: string) => {
  try {
    const response = await publicAxios.get(`/api/scorecards/${matchId}`);
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || error.message || 'Get scorecard failed');
  }
}
