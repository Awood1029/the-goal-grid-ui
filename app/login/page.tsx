"use client";

import React, { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import useLogin from "@/hooks/useLogin";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";

export default function LoginPage() {
	const [formData, setFormData] = useState({ username: "", password: "" });
	const { login: updateAuthContext, user } = useAuth();
	const router = useRouter();
	const { login, isSubmitting, error } = useLogin();
	const [localError, setLocalError] = useState<string | null>(null);

	// Redirect if already logged in
	useEffect(() => {
		if (user) {
			router.push("/dashboard");
		}
	}, [user, router]);

	const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		setFormData({ ...formData, [e.target.name]: e.target.value });
		setLocalError(null); // Clear error when user types
	};

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setLocalError(null);

		if (!formData.username || !formData.password) {
			setLocalError("Please enter both username and password");
			return;
		}

		try {
			const result = await login(formData);
			if (result && result.token) {
				updateAuthContext(result.token, {
					userId: result.userId,
					username: result.username,
					firstName: result.firstName,
					lastName: result.lastName,
				});
				router.push("/dashboard");
			} else {
				setLocalError("Invalid login response");
			}
		} catch (err) {
			console.error("Login failed:", err);
			setLocalError(error || "Failed to login. Please try again.");
		}
	};

	return (
		<div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-purple-50 p-4">
			<Card className="w-full max-w-sm bg-white/50 backdrop-blur-sm">
				<CardContent className="p-6">
					<div className="text-center mb-6">
						<h1 className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 text-transparent bg-clip-text">
							Welcome Back
						</h1>
						<p className="text-gray-600 mt-2">
							Sign in to continue your journey
						</p>
					</div>

					<form onSubmit={handleSubmit} className="space-y-4">
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
								className="w-full px-3 py-2 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all bg-white/50"
								placeholder="Enter your username"
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
								className="w-full px-3 py-2 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all bg-white/50"
								placeholder="Enter your password"
								required
							/>
						</div>

						{(localError || error) && (
							<p className="text-red-500 text-sm text-center">
								{localError || error}
							</p>
						)}

						<button
							type="submit"
							disabled={isSubmitting}
							className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white py-2 rounded-md hover:opacity-90 transition-opacity disabled:opacity-50"
						>
							{isSubmitting ? "Signing in..." : "Sign In"}
						</button>

						<p className="text-center text-sm text-gray-600 mt-4">
							Don&apos;t have an account?{" "}
							<Link
								href="/register"
								className="text-purple-600 hover:text-purple-700 font-medium"
							>
								Register here
							</Link>
						</p>
					</form>
				</CardContent>
			</Card>
		</div>
	);
}
