import { z } from "zod";

const LoginFields = z.object({
	username: z.string().min(3).max(40),
	password: z.string().min(3).max(40),
});

export { LoginFields };
