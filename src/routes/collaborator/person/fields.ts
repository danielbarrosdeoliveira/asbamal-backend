import { isCPF, isPIS } from "validation-br";
import { z } from "zod";
import { FamilyFields } from "../family/fields";

const atLeastOneDefined = (
	obj: Record<string | number | symbol, unknown> | undefined
) => {
	return obj && Object.values(obj).some((v) => v !== undefined);
};

const PersonParamFields = z.object({
	id: z.string().min(3).max(40),
});

const PersonFields = z.object({
	cpf: z.string().refine(isCPF, { message: "CPF inválido" }),
	name: z.string().min(3).max(40),
	mother_name: z.string().min(3).max(40).optional(),
	father_name: z.string().min(3).max(40).optional(),
	birthdate: z
		.string()
		.length(10)
		.regex(/^(?:19|20)[0-9]{2}-(?:0[1-9]|1[0-2])-(?:0[1-9]|[1-2][0-9]|3[0-1])$/)
		.transform((v) => new Date(v + "T00:00")),
	nis: z.string().refine(isPIS, { message: "NIS inválido" }).optional(),
	family: z.union([z.string().min(3).max(40), FamilyFields]).optional(),
});

const PersonPatchFields = PersonFields.partial().refine(atLeastOneDefined);
const PersonPutFields = PersonFields;

export { PersonPatchFields, PersonPutFields, PersonParamFields };
