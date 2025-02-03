"use client";

import React, { useState } from "react";
import useRegister from "@/hooks/useRegister";
import { useAuth } from "@/context/AuthContext";
import { Card, CardContent } from "@/components/ui/card";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function RegisterPage() {
	const [formData, setFormData] = useState({
		username: "",
		password: "",
		firstName: "",
		lastName: "",
	});

	const { register, isSubmitting, error } = useRegister();
	const { login } = useAuth();
	const router = useRouter();

	const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		setFormData({ ...formData, [e.target.name]: e.target.value });
	};

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();

		try {
			const result = await register(formData);
			login(result.token, result.refreshToken, {
				userId: result.userId,
				username: result.username,
				firstName: result.firstName,
				lastName: result.lastName,
			});
			router.push("/dashboard");
		} catch (err) {
			console.error(err);
		}
	};

	return (
		<div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-purple-50 p-4">
			<Card className="w-full max-w-md bg-white/50 backdrop-blur-sm">
				<CardContent className="p-6">
					<div className="text-center mb-6">
						<h1 className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 text-transparent bg-clip-text">
							Create Account
						</h1>
						<p className="text-gray-600 mt-2">
							Join us on your journey to success
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
								placeholder="Choose a username"
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
								placeholder="Create a password"
								required
							/>
						</div>

						<div className="grid grid-cols-2 gap-4">
							<div className="space-y-2">
								<label
									htmlFor="firstName"
									className="block text-sm font-medium text-gray-700"
								>
									First Name
								</label>
								<input
									type="text"
									name="firstName"
									id="firstName"
									value={formData.firstName}
									onChange={handleChange}
									className="w-full px-3 py-2 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all bg-white/50"
									placeholder="First name"
									required
								/>
							</div>

							<div className="space-y-2">
								<label
									htmlFor="lastName"
									className="block text-sm font-medium text-gray-700"
								>
									Last Name
								</label>
								<input
									type="text"
									name="lastName"
									id="lastName"
									value={formData.lastName}
									onChange={handleChange}
									className="w-full px-3 py-2 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all bg-white/50"
									placeholder="Last name"
									required
								/>
							</div>
						</div>

						{error && (
							<p className="text-red-500 text-sm text-center">{error}</p>
						)}

						<button
							type="submit"
							disabled={isSubmitting}
							className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white py-2 rounded-md hover:opacity-90 transition-opacity disabled:opacity-50"
						>
							{isSubmitting ? "Creating Account..." : "Create Account"}
						</button>

						<p className="text-center text-sm text-gray-600 mt-4">
							Already have an account?{" "}
							<Link
								href="/login"
								className="text-purple-600 hover:text-purple-700 font-medium"
							>
								Sign in here
							</Link>
						</p>
					</form>
				</CardContent>
			</Card>
		</div>
	);
}
