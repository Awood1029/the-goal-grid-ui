// app/layout.tsx
import Navbar from "@/components/Navbar";
import "./globals.css"; // Add global styles if necessary
import { ReactNode } from "react";
import { AuthProvider } from "@/context/AuthContext";
import { SITE_DESCRIPTION, SITE_TITLE } from "@/lib/constants";
import { ThemeProvider } from "next-themes";

export const metadata = {
	title: SITE_TITLE,
	description: SITE_DESCRIPTION,
};

export default function RootLayout({ children }: { children: ReactNode }) {
	return (
		<html lang="en" suppressHydrationWarning>
			<body>
				<AuthProvider>
					<ThemeProvider
						attribute="class"
						defaultTheme="light"
						disableTransitionOnChange
					>
						<Navbar />
						<main>{children}</main>
					</ThemeProvider>
				</AuthProvider>
			</body>
		</html>
	);
}
