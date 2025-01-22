import { Role } from "./role.ts";

export interface User {
    id: string;
    name : string;
    password: string
    roles: Array<Role>;
}