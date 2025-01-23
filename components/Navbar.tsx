"use client";

import { useState } from "react";
import Link from "next/link";
import { useAuth } from "@/hooks/useAuth";
import { useRouter } from "next/navigation";

export default function Navbar() {
	const { user, logout } = useAuth();
	const [isOpen, setIsOpen] = useState(false);
	const router = useRouter();

	const handleNavigation = async (path: string) => {
		try {
			await router.replace(path);
		} catch (err) {
			console.error("Navigation error:", err);
		}
	};

	const handleLogout = () => {
		logout();
		// Close mobile menu after logout
		setIsOpen(false);
		// Redirect to login page
		handleNavigation("/login");
	};

	return (
		<nav className="bg-white border-b shadow-sm sticky top-0 z-50">
			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
				<div className="flex justify-between items-center h-16">
					{/* Logo */}
					<div className="flex-shrink-0">
						<Link
							href="/"
							className="text-xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 text-transparent bg-clip-text"
						>
							GoalGrid
						</Link>
					</div>

					{/* Mobile menu button */}
					<div className="md:hidden">
						<button
							onClick={() => setIsOpen(!isOpen)}
							className="inline-flex items-center justify-center p-2 rounded-md text-gray-600 hover:text-purple-600 focus:outline-none"
							aria-expanded="false"
						>
							<span className="sr-only">Open main menu</span>
							{/* Hamburger icon */}
							<svg
								className={`${isOpen ? "hidden" : "block"} h-6 w-6`}
								xmlns="http://www.w3.org/2000/svg"
								fill="none"
								viewBox="0 0 24 24"
								stroke="currentColor"
							>
								<path
									strokeLinecap="round"
									strokeLinejoin="round"
									strokeWidth={2}
									d="M4 6h16M4 12h16M4 18h16"
								/>
							</svg>
							{/* Close icon */}
							<svg
								className={`${isOpen ? "block" : "hidden"} h-6 w-6`}
								xmlns="http://www.w3.org/2000/svg"
								fill="none"
								viewBox="0 0 24 24"
								stroke="currentColor"
							>
								<path
									strokeLinecap="round"
									strokeLinejoin="round"
									strokeWidth={2}
									d="M6 18L18 6M6 6l12 12"
								/>
							</svg>
						</button>
					</div>

					{/* Desktop menu */}
					<div className="hidden md:flex items-center space-x-6">
						{user ? (
							<>
								<Link
									href="/dashboard"
									className="text-gray-600 hover:text-purple-600 transition-colors"
								>
									Dashboard
								</Link>
								<Link
									href="/feed"
									className="text-gray-600 hover:text-purple-600 transition-colors"
								>
									Feed
								</Link>
								<Link
									href="/groups"
									className="text-gray-600 hover:text-purple-600 transition-colors"
								>
									Groups
								</Link>
								<button
									onClick={handleLogout}
									className="text-gray-600 hover:text-purple-600 transition-colors focus:outline-none"
								>
									Logout
								</button>
							</>
						) : (
							<Link
								href="/login"
								className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-4 py-2 rounded-md hover:opacity-90 transition-opacity"
							>
								Login
							</Link>
						)}
					</div>
				</div>

				{/* Mobile menu */}
				<div className={`${isOpen ? "block" : "hidden"} md:hidden`}>
					<div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
						{user ? (
							<>
								<Link
									href="/dashboard"
									className="block px-3 py-2 rounded-md text-gray-600 hover:text-purple-600 transition-colors"
									onClick={() => setIsOpen(false)}
								>
									Dashboard
								</Link>
								<Link
									href="/feed"
									className="block px-3 py-2 rounded-md text-gray-600 hover:text-purple-600 transition-colors"
									onClick={() => setIsOpen(false)}
								>
									Feed
								</Link>
								<Link
									href="/groups"
									className="block px-3 py-2 rounded-md text-gray-600 hover:text-purple-600 transition-colors"
									onClick={() => setIsOpen(false)}
								>
									Groups
								</Link>
								<button
									onClick={handleLogout}
									className="block w-full text-left px-3 py-2 rounded-md text-gray-600 hover:text-purple-600 transition-colors focus:outline-none"
								>
									Logout
								</button>
							</>
						) : (
							<Link
								href="/login"
								className="block px-3 py-2 rounded-md bg-gradient-to-r from-purple-600 to-pink-600 text-white hover:opacity-90 transition-opacity"
								onClick={() => setIsOpen(false)}
							>
								Login
							</Link>
						)}
					</div>
				</div>
			</div>
		</nav>
	);
}
