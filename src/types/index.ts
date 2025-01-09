import { users } from "@prisma/client";

export type NewUser = Pick<users, "id" | "email" | "role"> & { token: string };
