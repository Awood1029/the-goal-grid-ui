import { UserDTO } from "./user";
import { Board } from "./board";

export interface GroupDTO {
	id: number;
	name: string;
	uniqueUrl: string;
	inviteCode: string;
	users: UserDTO[];
	leaderboard: Record<string, number>;
}

export interface Group extends Omit<GroupDTO, "leaderboard"> {
	ownerId: number;
	createdAt: string;
	boards: Board[];
}
