"use client";

import { useAuth } from "@/context/AuthContext";
import Link from "next/link";

export default function Navbar() {
	const { user, logout } = useAuth();

	return (
		<nav className="bg-white border-b shadow-md">
			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
				<div className="flex justify-between items-center h-16">
					{/* Logo */}
					<div className="flex-shrink-0">
						<Link href="/" className="text-xl font-bold text-blue-600">
							MyApp
						</Link>
					</div>

					{/* Links */}
					<div className="hidden md:flex space-x-8">
						<Link
							href="/dashboard"
							className="text-gray-700 hover:text-blue-600"
						>
							Dashboard
						</Link>
						<Link href="/groups" className="text-gray-700 hover:text-blue-600">
							Groups
						</Link>
						{!user ? (
							<Link href="/login" className="text-gray-700 hover:text-blue-600">
								Login
							</Link>
						) : (
							<button
								onClick={logout}
								className="text-gray-700 hover:text-blue-600 focus:outline-none"
							>
								Logout
							</button>
						)}
					</div>
				</div>
			</div>
		</nav>
	);
}
