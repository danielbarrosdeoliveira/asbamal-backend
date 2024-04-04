//@ts-ignore
import phoneParser from "telefone/parse";
import { isCPF } from "validation-br";
import { z } from "zod";

const atLeastOneDefined = (obj: Record<string | number | symbol, unknown>) => {
	return Object.values(obj).some((v) => v !== undefined);
};

const FamilyParamFields = z.object({
	id: z.string().min(3).max(40),
});

const FamilyFields = z.object({
	address: z.string().min(3).max(40),
	address_number: z
		.string()
		.min(1)
		.max(8)
		.refine((addressNumber) => addressNumber.match(/^[0-9]+$/))
		.optional(),
	address_complement: z.string().min(1).max(40).optional(),
	city: z.string().min(3).max(40),
	state: z
		.string()
		.toUpperCase()
		.length(2)
		.regex(/^[A-Z]{2}$/),
	zipcode: z
		.string()
		.length(8)
		.regex(/^[0-9]{8}$/),
	phones: z
		.string()
		.refine((phone) => !!phoneParser(phone, { apenasCelular: true }))
		.array()
		.max(3)
		.default([]),
	tags: z.string().array().default([]),
});

const FamilyPatchFields = FamilyFields.extend({
	responsible: z.string().refine(isCPF, { message: "CPF inválido" }),
})
	.partial()
	.refine(atLeastOneDefined);

export { FamilyPatchFields, FamilyFields, FamilyParamFields };
