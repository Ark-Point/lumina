import Config from '@/config';
import { BaseApiResponse } from '@/types/services';
import axios, { AxiosError } from 'axios';
// import { getSession } from "next-auth/react";

export const apiClient = axios.create({
  baseURL: Config.API_HOST,
  headers: {
    'Content-Type': 'application/json',
  },
});

apiClient.interceptors.request.use(
  async (config) => {
    // const session = await getSession();
    // const token = session?.user?.access_token;

    // if (token) {
    //   config.headers.Authorization = `Bearer ${token}`;
    // }

    return config;
  },
  (error) => Promise.reject(error),
);

apiClient.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    if (error.response?.data) {
      const errorResponse = error.response.data as BaseApiResponse;
      throw new Error(errorResponse.message || 'API 호출에 실패했습니다.');
    }
    Promise.reject(error);
  },
);
