import { useMutation, useQuery } from "@tanstack/react-query";
import { getDoctorsApi, getMyAnalyticsApi, getMyHistoryApi, runPredictionApi } from "../api/prediction.api";
import { useToast } from "../components/ui/Toast";

export const usePrediction = () => {
    const { showToast } = useToast();
    return useMutation({
        mutationFn: runPredictionApi,
        onSuccess: () => {
            showToast("Risk assessment calculated successfully!", "success");
        },
        onError: (error: any) => {
            const message = error.response?.data?.message || "Prediction failed. Please try again.";
            showToast(message, "error");
        }
    });
};

export const useDoctors = (
    region: number,
    risk_level: string,
    enabled: boolean
) =>
    useQuery({
        queryKey: ["doctors", region, risk_level],
        queryFn: () => getDoctorsApi(region, risk_level, 5),
        enabled: enabled && !!risk_level,
        staleTime: 5 * 60 * 1000,
    });

export const useMyHistory = (page = 1) =>
    useQuery({
        queryKey: ["history", page],
        queryFn: () => getMyHistoryApi(page),
        placeholderData: (previousData) => previousData,
    });

export const useMyAnalytics = () =>
    useQuery({
        queryKey: ["analytics"],
        queryFn: getMyAnalyticsApi,
    });