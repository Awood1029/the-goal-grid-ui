import { useState } from "react";
import Cookies from "js-cookie";

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
			const response = await fetch(
				`${process.env.NEXT_PUBLIC_API_URL}/auth/login`,
				{
					method: "POST",
					headers: { "Content-Type": "application/json" },
					body: JSON.stringify(data),
					credentials: "include", // This is important for cookies
				}
			);

			if (!response.ok) {
				const errorData = await response.json().catch(() => null);
				throw new Error(errorData?.message || "Invalid username or password");
			}

			const result = await response.json();

			// Store token in both localStorage and cookies
			localStorage.setItem("token", result.token);
			Cookies.set("token", result.token, {
				expires: 7, // 7 days
				sameSite: "Lax",
				secure: process.env.NODE_ENV === "production",
			});

			return result;
		} catch (err: unknown) {
			console.error("Login error:", err);
			const errorMessage =
				err instanceof Error ? err.message : "An unexpected error occurred";
			setError(errorMessage);
			throw err;
		} finally {
			setIsSubmitting(false);
		}
	};

	return { login, isSubmitting, error };
}
