export interface UserDTO {
	id: number;
	username: string;
	firstName: string;
	lastName: string;
}

export interface User extends UserDTO {
	createdAt: string;
}
