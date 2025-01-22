import { GroupInput } from "./group-input.ts";
import { RoleInput } from "./role-input.ts";

export interface UserInput {
    firstName: string;
    lastName: string;
    password: string;
    rank: string;
    roles: Array<RoleInput>;
    group: GroupInput;
    serviceType: string;
    [key: string]: any;
}