// app/layout.tsx
import Navbar from "@/components/Navbar";
import "./globals.css"; // Add global styles if necessary
import { ReactNode } from "react";
import { AuthProvider } from "@/context/AuthContext";
import { Toaster } from "@/components/ui/toaster";

export const metadata = {
	title: "Next.js App",
	description: "App description",
};

export default function RootLayout({ children }: { children: ReactNode }) {
	return (
		<html lang="en">
			<body>
				<AuthProvider>
					<Navbar />
					<main>{children}</main>
					<Toaster />
				</AuthProvider>
			</body>
		</html>
	);
}
