import axios, { AxiosError, AxiosRequestConfig } from "axios";
import { authService } from "./authService";
import { AuthResponseDTO } from "@/types";

interface ErrorResponse {
	message?: string;
	[key: string]: any;
}

const apiClient = axios.create({
	baseURL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080",
	withCredentials: true, // Include cookies if backend requires
});

// Flag to prevent multiple refresh token requests
let isRefreshing = false;
let failedQueue: Array<{
	resolve: (token: string) => void;
	reject: (error: unknown) => void;
}> = [];

const clearAuthState = () => {
	localStorage.removeItem("token");
	localStorage.removeItem("refreshToken");
	localStorage.removeItem("user");
	document.cookie = "token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";
	window.location.href = "/login";
};

const processQueue = (error: unknown | null, token: string | null = null) => {
	failedQueue.forEach((prom) => {
		if (error) {
			prom.reject(error);
		} else {
			prom.resolve(token!);
		}
	});

	failedQueue = [];
};

apiClient.interceptors.request.use((config) => {
	const token = localStorage.getItem("token"); // Retrieve token from local storage
	if (token) {
		config.headers.Authorization = `Bearer ${token}`;
	}
	return config;
});

interface RetryConfig extends AxiosRequestConfig {
	_retry?: boolean;
}

apiClient.interceptors.response.use(
	(response) => response,
	async (error: AxiosError<ErrorResponse>) => {
		const originalRequest = error.config as RetryConfig;

		// Handle network errors or backend unreachable
		if (!error.response) {
			clearAuthState();
			return Promise.reject(error);
		}

		// If error is not 401 or request already retried, reject
		if (error.response.status !== 401 || originalRequest._retry) {
			// If it's a 403 (Forbidden) or backend indicates token is invalid/expired
			if (
				error.response.status === 403 ||
				error.response.data?.message?.toLowerCase().includes("invalid token") ||
				error.response.data?.message?.toLowerCase().includes("expired token")
			) {
				clearAuthState();
			}
			return Promise.reject(error);
		}

		if (isRefreshing) {
			// If token refresh is in progress, queue this request
			try {
				const token = await new Promise<string>((resolve, reject) => {
					failedQueue.push({ resolve, reject });
				});
				originalRequest.headers = {
					...originalRequest.headers,
					Authorization: `Bearer ${token}`,
				};
				return apiClient(originalRequest);
			} catch (err) {
				clearAuthState();
				return Promise.reject(err);
			}
		}

		originalRequest._retry = true;
		isRefreshing = true;

		try {
			const refreshToken = localStorage.getItem("refreshToken");
			if (!refreshToken) {
				throw new Error("No refresh token available");
			}

			const response = await authService.refreshToken(refreshToken);
			const { token: newToken, refreshToken: newRefreshToken } = response;

			// Update tokens in localStorage and cookie
			localStorage.setItem("token", newToken);
			localStorage.setItem("refreshToken", newRefreshToken);

			// Update cookie through document.cookie
			document.cookie = `token=${newToken}; path=/; max-age=86400; SameSite=Lax${
				process.env.NODE_ENV === "production" ? "; Secure" : ""
			}`;

			// Update Authorization header
			apiClient.defaults.headers.common.Authorization = `Bearer ${newToken}`;
			if (originalRequest.headers) {
				originalRequest.headers.Authorization = `Bearer ${newToken}`;
			}

			// Process queued requests
			processQueue(null, newToken);

			return apiClient(originalRequest);
		} catch (refreshError) {
			processQueue(refreshError, null);
			clearAuthState();
			return Promise.reject(refreshError);
		} finally {
			isRefreshing = false;
		}
	}
);

export default apiClient;
