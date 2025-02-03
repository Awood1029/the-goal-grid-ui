import type { UserDTO } from "./user";
import type { BoardDTO } from "./board";

export interface GroupMemberDTO extends UserDTO {
	board: BoardDTO;
	joinedAt: string;
}

export interface GroupDTO {
	id: number;
	name: string;
	description: string;
	uniqueUrl: string;
	inviteCode: string;
	createdAt: string;
	updatedAt: string;
	members: GroupMemberDTO[];
	admins: GroupMemberDTO[];
	users: UserDTO[];
}
