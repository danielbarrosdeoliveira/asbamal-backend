import { z } from "zod";

const atLeastOneDefined = (
	obj: Record<string | number | symbol, unknown> | undefined
) => {
	return obj && Object.values(obj).some((v) => v !== undefined);
};

const CollaboratorParamFields = z.object({
	id: z.string().min(3).max(40),
});

const CollaboratorFields = z
	.object({
		email: z.string().email(),
		password: z.string().min(3).max(40),
		type: z.union([
			z.literal("admin"),
			z.literal("collaborator"),
			z.literal("user"),
			z.literal("pending"),
			z.literal("inactive"),
		]),
	})
	.partial()
	.refine(atLeastOneDefined)
	.and(z.object({}).passthrough());

export { CollaboratorParamFields, CollaboratorFields };
