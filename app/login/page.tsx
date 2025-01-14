"use client";

import React, { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import useLogin from "@/hooks/useLogin"; // Import the custom useLogin hook

export default function LoginPage() {
	const [formData, setFormData] = useState({ username: "", password: "" });
	const { login: updateAuthContext } = useAuth(); // Get login function from AuthContext
	const router = useRouter();
	const { login, isSubmitting, error } = useLogin(); // Use the useLogin hook

	const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		setFormData({ ...formData, [e.target.name]: e.target.value });
	};

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();

		try {
			const result = await login(formData);
			updateAuthContext(result.token, {
				userId: result.userId,
				username: result.username,
				firstName: result.firstName,
				lastName: result.lastName,
			});
			router.push("/dashboard");
		} catch (err) {
			console.error("Login failed:", err);
		}
	};

	return (
		<div className="min-h-screen flex items-center justify-center bg-gray-100">
			<form
				onSubmit={handleSubmit}
				className="bg-white p-6 rounded shadow-md space-y-4 w-full max-w-sm"
			>
				<h1 className="text-2xl font-bold mb-4">Login</h1>

				<div className="space-y-2">
					<label
						htmlFor="username"
						className="block text-sm font-medium text-gray-700"
					>
						Username
					</label>
					<input
						type="text"
						name="username"
						id="username"
						value={formData.username}
						onChange={handleChange}
						className="w-full px-3 py-2 border rounded-md"
						placeholder="Username"
						required
					/>
				</div>

				<div className="space-y-2">
					<label
						htmlFor="password"
						className="block text-sm font-medium text-gray-700"
					>
						Password
					</label>
					<input
						type="password"
						name="password"
						id="password"
						value={formData.password}
						onChange={handleChange}
						className="w-full px-3 py-2 border rounded-md"
						placeholder="Password"
						required
					/>
				</div>

				{error && <p className="text-red-500 text-sm">{error}</p>}

				<button
					type="submit"
					disabled={isSubmitting}
					className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition"
				>
					{isSubmitting ? "Logging in..." : "Login"}
				</button>
			</form>
		</div>
	);
}
