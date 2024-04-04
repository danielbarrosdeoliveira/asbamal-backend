import { z } from "zod";

const ChangePasswordFields = z.object({
	old_password: z.string().min(3).max(40),
	password: z.string().min(3).max(40),
	confirm_password: z.string().min(3).max(40),
});

export { ChangePasswordFields };
