"use client";

import React, { createContext, useState, useContext, useEffect } from "react";
import type { AuthResponseDTO } from "@/types";
import Cookies from "js-cookie";
import { useRouter } from "next/navigation";

interface AuthContextType {
	user: Omit<AuthResponseDTO, "token"> | null;
	token: string | null;
	login: (token: string, user: Omit<AuthResponseDTO, "token">) => void;
	logout: () => void;
	isInitialized: boolean;
}

export const AuthContext = createContext<AuthContextType | undefined>(
	undefined
);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
	const [user, setUser] = useState<Omit<AuthResponseDTO, "token"> | null>(null);
	const [token, setToken] = useState<string | null>(null);
	const [isInitialized, setIsInitialized] = useState(false);
	const router = useRouter();

	useEffect(() => {
		const storedToken = Cookies.get("token") || localStorage.getItem("token");
		const storedUser = localStorage.getItem("user");
		if (storedToken && storedUser) {
			setToken(storedToken);
			setUser(JSON.parse(storedUser));

			if (!Cookies.get("token")) {
				Cookies.set("token", storedToken, {
					expires: 7,
					sameSite: "Lax",
					secure: process.env.NODE_ENV === "production",
					path: "/",
				});
			}
		}
		setIsInitialized(true);
	}, []);

	const login = async (token: string, user: Omit<AuthResponseDTO, "token">) => {
		try {
			// First set the auth state
			setToken(token);
			setUser(user);

			// Then store in persistent storage
			localStorage.setItem("token", token);
			localStorage.setItem("user", JSON.stringify(user));

			// Set cookie with proper configuration
			Cookies.set("token", token, {
				expires: 7,
				sameSite: "Lax",
				secure: process.env.NODE_ENV === "production",
				path: "/",
			});

			// Force a hard navigation to dashboard
			window.location.href = "/dashboard";
		} catch (err) {
			console.error("Login error:", err);
			// If there's an error, clear everything
			localStorage.removeItem("token");
			localStorage.removeItem("user");
			Cookies.remove("token");
			setToken(null);
			setUser(null);
		}
	};

	const logout = () => {
		localStorage.removeItem("token");
		localStorage.removeItem("user");
		Cookies.remove("token");
		setToken(null);
		setUser(null);
		router.push("/login");
	};

	return (
		<AuthContext.Provider value={{ user, token, login, logout, isInitialized }}>
			{children}
		</AuthContext.Provider>
	);
};

export const useAuth = () => {
	const context = useContext(AuthContext);
	if (context === undefined) {
		throw new Error("useAuth must be used within an AuthProvider");
	}
	return context;
};
