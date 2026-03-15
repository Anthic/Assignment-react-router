import type { ILoginInput, IRegisterInput, IUser } from "../types/auth.types";
import axiosClient from "./axiosClient";
import type { IAuthResponse } from "../types/auth.types";

export const loginApi = async (data: ILoginInput): Promise<IAuthResponse> => {
    const res = await axiosClient.post<IAuthResponse>("/auth/login", data);
    return res.data;
};

// POST /auth/register
export const registerApi = async (data: IRegisterInput): Promise<IAuthResponse> => {
    const res = await axiosClient.post<IAuthResponse>("/auth/register", data);
    return res.data;
};

// POST /auth/logout 
export const logoutApi = async (): Promise<void> => {
    const res = await axiosClient.post("/auth/logout");
    return res.data;
};

// GET /auth/me — current user
export const getMeApi = async (): Promise<IUser> => {
    const res = await axiosClient.get<{ success: boolean; data: IUser }>("/auth/me");
    return res.data.data;
};