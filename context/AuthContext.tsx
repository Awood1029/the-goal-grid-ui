"use client";

import React, { createContext, useState, useContext, useEffect } from "react";
import type { AuthResponseDTO } from "@/types";

interface AuthContextType {
	user: Omit<AuthResponseDTO, "token"> | null;
	token: string | null;
	login: (token: string, user: Omit<AuthResponseDTO, "token">) => void;
	logout: () => void;
}

export const AuthContext = createContext<AuthContextType | undefined>(
	undefined
);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
	const [user, setUser] = useState<Omit<AuthResponseDTO, "token"> | null>(null);
	const [token, setToken] = useState<string | null>(null);

	useEffect(() => {
		const storedToken = localStorage.getItem("token");
		const storedUser = localStorage.getItem("user");
		if (storedToken && storedUser) {
			setToken(storedToken);
			setUser(JSON.parse(storedUser));
		}
	}, []);

	const login = (token: string, user: Omit<AuthResponseDTO, "token">) => {
		localStorage.setItem("token", token);
		localStorage.setItem("user", JSON.stringify(user));
		setToken(token);
		setUser(user);
	};

	const logout = () => {
		localStorage.removeItem("token");
		localStorage.removeItem("user");
		setToken(null);
		setUser(null);
	};

	return (
		<AuthContext.Provider value={{ user, token, login, logout }}>
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
