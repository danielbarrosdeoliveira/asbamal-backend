import { z } from "zod";

const RegisterFields = z.object({
	username: z.string().min(3).max(40),
	password: z.string().min(3).max(40),
	confirm_password: z.string().min(3).max(40),
	email: z.string().email(),
});

export { RegisterFields };
