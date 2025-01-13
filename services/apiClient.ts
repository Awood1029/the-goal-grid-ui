import axios from "axios";

const apiClient = axios.create({
	baseURL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080",
	withCredentials: true, // Include cookies if backend requires
});

apiClient.interceptors.request.use((config) => {
	const token = localStorage.getItem("token"); // Retrieve token from local storage
	if (token) {
		config.headers.Authorization = `Bearer ${token}`;
	}
	return config;
});

export default apiClient;
