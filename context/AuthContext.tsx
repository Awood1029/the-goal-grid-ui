"use client";

import React, { createContext, useState, useContext, useEffect } from "react";
import Cookies from "js-cookie";
import { useRouter } from "next/navigation";

interface AuthUser {
	userId: number;
	username: string;
	firstName?: string;
	lastName?: string;
}

interface AuthContextType {
	user: AuthUser | null;
	token: string | null;
	refreshToken: string | null;
	login: (token: string, refreshToken: string, user: AuthUser) => void;
	logout: () => void;
	isInitialized: boolean;
}

export const AuthContext = createContext<AuthContextType | undefined>(
	undefined
);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
	const [user, setUser] = useState<AuthUser | null>(null);
	const [token, setToken] = useState<string | null>(null);
	const [refreshToken, setRefreshToken] = useState<string | null>(null);
	const [isInitialized, setIsInitialized] = useState(false);
	const router = useRouter();

	useEffect(() => {
		const storedToken = Cookies.get("token") || localStorage.getItem("token");
		const storedRefreshToken = localStorage.getItem("refreshToken");
		const storedUser = localStorage.getItem("user");

		if (storedToken && storedRefreshToken && storedUser) {
			setToken(storedToken);
			setRefreshToken(storedRefreshToken);
			setUser(JSON.parse(storedUser));

			if (!Cookies.get("token")) {
				Cookies.set("token", storedToken, {
					expires: 1, // 24 hours
					sameSite: "Lax",
					secure: process.env.NODE_ENV === "production",
					path: "/",
				});
			}
		}
		setIsInitialized(true);
	}, []);

	const login = async (token: string, refreshToken: string, user: AuthUser) => {
		try {
			// Set the auth state
			setToken(token);
			setRefreshToken(refreshToken);
			setUser(user);

			// Store in persistent storage
			localStorage.setItem("token", token);
			localStorage.setItem("refreshToken", refreshToken);
			localStorage.setItem("user", JSON.stringify(user));

			// Set cookie with proper configuration
			Cookies.set("token", token, {
				expires: 1, // 24 hours
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
			localStorage.removeItem("refreshToken");
			localStorage.removeItem("user");
			Cookies.remove("token");
			setToken(null);
			setRefreshToken(null);
			setUser(null);
		}
	};

	const logout = () => {
		localStorage.removeItem("token");
		localStorage.removeItem("refreshToken");
		localStorage.removeItem("user");
		Cookies.remove("token");
		setToken(null);
		setRefreshToken(null);
		setUser(null);
		router.push("/login");
	};

	return (
		<AuthContext.Provider
			value={{ user, token, refreshToken, login, logout, isInitialized }}
		>
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
