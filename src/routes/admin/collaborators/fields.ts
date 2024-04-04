import { z } from "zod";

const CollaboratorsQueryFields = z.object({
	limit: z
		.string()
		.regex(/^\d+$/, { message: "Limite inválido" })
		.optional()
		.transform(Number)
		.default("10"),
	page: z
		.string()
		.regex(/^\d+$/, { message: "Página inválida" })
		.optional()
		.transform(Number)
		.default("0"),
});

export { CollaboratorsQueryFields };
