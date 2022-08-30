import { SetMetadata } from "@nestjs/common";
import { RoleType } from "./role-type";

export const Roles = (...roles: string[]): any => SetMetadata("roles", roles);
