import Link from "next/link";
import type { UserDTO } from "@/types";

interface UserLinkProps {
	user: UserDTO;
	className?: string;
}

export const UserLink: React.FC<UserLinkProps> = ({ user, className = "" }) => {
	const displayName =
		user.firstName && user.lastName
			? `${user.firstName} ${user.lastName}`
			: user.username || "Unknown User";

	return (
		<Link
			href={`/profile/${user.id}`}
			className={`hover:text-purple-600 hover:underline ${className}`}
		>
			{displayName}
		</Link>
	);
};
