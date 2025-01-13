import { useState } from "react";

interface LoginData {
	username: string;
	password: string;
}

export default function useLogin() {
	const [isSubmitting, setIsSubmitting] = useState(false);
	const [error, setError] = useState<string | null>(null);

	const login = async (data: LoginData) => {
		setIsSubmitting(true);
		setError(null);

		try {
			console.log("API URL:", process.env.NEXT_PUBLIC_API_URL);

			const response = await fetch(
				`${process.env.NEXT_PUBLIC_API_URL}/auth/login`,
				{
					method: "POST",
					headers: { "Content-Type": "application/json" },
					body: JSON.stringify(data),
				}
			);

			if (!response.ok) {
				const errorText = await response.text();
				throw new Error(errorText || "Login failed");
			}

			const result = await response.json();
			localStorage.setItem("token", result.token); // Save the JWT token
			return result;
		} catch (err: any) {
			setError(err.message || "An unexpected error occurred");
			throw err;
		} finally {
			setIsSubmitting(false);
		}
	};

	return { login, isSubmitting, error };
}
