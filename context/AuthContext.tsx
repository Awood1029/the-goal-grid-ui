"use client";

import React, { createContext, useState, useContext, useEffect } from "react";

interface AuthContextType {
	user: { username: string } | null;
	token: string | null;
	login: (token: string, user: { username: string }) => void;
	logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
	const [user, setUser] = useState<{ username: string } | null>(null);
	const [token, setToken] = useState<string | null>(null);

	useEffect(() => {
		const storedToken = localStorage.getItem("token");
		const storedUser = localStorage.getItem("user");
		if (storedToken && storedUser) {
			setToken(storedToken);
			setUser(JSON.parse(storedUser));
		}
	}, []);

	const login = (token: string, user: { username: string }) => {
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
