import { z } from "zod";

const ChangeEmailFields = z.object({
	password: z.string().min(3).max(40),
	email: z.string().email(),
});

export { ChangeEmailFields };
