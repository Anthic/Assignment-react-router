import type { AnalyticsData, IDoctorsResponse, MLResult, PredictInput, PredictionAPIResponse, PredictionHistoryResponse, PredictionRecord, RiskLevel } from "../types/auth.prediction";
import axiosClient from "./axiosClient";

// POST /api/v1/predictions
export const runPredictionApi = async (
  input: PredictInput
): Promise<{ prediction: PredictionRecord; mlResponse: MLResult }> => {
  const res = await axiosClient.post<PredictionAPIResponse>("/prediction", input);
  return res.data.data;
};

// GET /api/v1/prediction/doctors?region=0&risk_level=Low Risk&limit=5
export const getDoctorsApi = async (
  region: number,
  risk_level: RiskLevel,
  limit = 5
): Promise<IDoctorsResponse> => {
  const res = await axiosClient.get<IDoctorsResponse>("/prediction/doctors", {
    params: { region, risk_level, limit },
  });
  return res.data;
};

// GET /api/v1/predictions/history?page=1&limit=10
export const getMyHistoryApi = async (
  page = 1,
  limit = 10
): Promise<PredictionHistoryResponse> => {
  const res = await axiosClient.get<{ success: boolean; data: PredictionHistoryResponse }>(
    "/prediction/history",
    { params: { page, limit } }
  );
  return res.data.data;
};

// GET /api/v1/prediction/analytics
export const getMyAnalyticsApi = async (): Promise<AnalyticsData> => {
  const res = await axiosClient.get<{ success: boolean; data: AnalyticsData }>(
    "/prediction/analytics"
  );
  return res.data.data;
};

// GET /api/v1/prediction/regions
export const getRegionsApi = async (): Promise<Record<string, string>> => {
  const res = await axiosClient.get<{
    success: boolean;
    data: { regions: Record<string, string> };
  }>("/prediction/regions");
  return res.data.data.regions;
};