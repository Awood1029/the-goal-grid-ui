import { useState } from "react";

interface RegisterData {
	username: string;
	password: string;
	firstName: string;
	lastName: string;
}

export default function useRegister() {
	const [isSubmitting, setIsSubmitting] = useState(false);
	const [error, setError] = useState<string | null>(null);

	const register = async (data: RegisterData) => {
		setIsSubmitting(true);
		setError(null);

		try {
			const response = await fetch(
				`${process.env.NEXT_PUBLIC_API_URL}/auth/register`,
				{
					method: "POST",
					headers: { "Content-Type": "application/json" },
					body: JSON.stringify(data),
				}
			);

			if (!response.ok) {
				const errorText = await response.text();
				throw new Error(errorText || "Registration failed");
			}

			const result = await response.json(); // AuthResponseDTO
			localStorage.setItem("token", result.token); // Store token for auto-login
			return result; // Return user data for further handling
		} catch (err: any) {
			setError(err.message || "An unexpected error occurred");
			throw err;
		} finally {
			setIsSubmitting(false);
		}
	};

	return { register, isSubmitting, error };
}
