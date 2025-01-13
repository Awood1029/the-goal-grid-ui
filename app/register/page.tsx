"use client";

import React, { useState } from "react";
import useRegister from "@/hooks/useRegister";
import { useAuth } from "@/context/AuthContext"; // Import useAuth
import {
	Card,
	CardHeader,
	CardTitle,
	CardDescription,
	CardContent,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Label } from "@/components/ui/label";
import { useRouter } from "next/navigation";

export default function RegisterPage() {
	const [formData, setFormData] = useState({
		username: "",
		password: "",
		firstName: "",
		lastName: "",
	});

	const { register, isSubmitting, error } = useRegister();
	const { login } = useAuth(); // Get login function from AuthContext
	const router = useRouter();

	const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		setFormData({ ...formData, [e.target.name]: e.target.value });
	};

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();

		try {
			const result = await register(formData);
			console.log("User registered and logged in:", result);

			// Update AuthContext with token and user info
			login(result.token, { username: result.username });

			router.push("/dashboard"); // Redirect to dashboard after auto-login
		} catch (err) {
			console.error(err);
		}
	};

	return (
		<div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 to-blue-50 p-4">
			<div className="w-full max-w-md">
				<Card>
					<CardHeader>
						<CardTitle>Register</CardTitle>
						<CardDescription>
							Enter your details to create an account.
						</CardDescription>
					</CardHeader>
					<CardContent>
						<form onSubmit={handleSubmit} className="space-y-4">
							<div className="space-y-2">
								<Label htmlFor="username">Username</Label>
								<Input
									id="username"
									name="username"
									value={formData.username}
									onChange={handleChange}
									required
								/>
							</div>
							<div className="space-y-2">
								<Label htmlFor="password">Password</Label>
								<Input
									id="password"
									name="password"
									type="password"
									value={formData.password}
									onChange={handleChange}
									required
								/>
							</div>
							<div className="space-y-2">
								<Label htmlFor="firstName">First Name</Label>
								<Input
									id="firstName"
									name="firstName"
									value={formData.firstName}
									onChange={handleChange}
									required
								/>
							</div>
							<div className="space-y-2">
								<Label htmlFor="lastName">Last Name</Label>
								<Input
									id="lastName"
									name="lastName"
									value={formData.lastName}
									onChange={handleChange}
									required
								/>
							</div>
							{error && (
								<Alert variant="destructive">
									<AlertDescription>{error}</AlertDescription>
								</Alert>
							)}
							<Button type="submit" disabled={isSubmitting}>
								{isSubmitting ? "Registering..." : "Register"}
							</Button>
						</form>
					</CardContent>
				</Card>
			</div>
		</div>
	);
}
