import z from "zod";

const coercedInt = z.transform((val: string, ctx) => {
  try {
    const parsed = Number.parseInt(String(val));
    if (Number.isNaN(parsed)) {
      throw new Error("not a number");
    }

    return parsed;
  } catch (e) {
    ctx.issues.push({
      code: "invalid_value",
      message: "Not a number",
      input: val,
      values: [Number.parseInt(String(val))],
    });

    return z.NEVER;
  }
});

export const idParamSchema = z.object({
  id: z
    .string()
    .pipe(coercedInt)
    .openapi({
      param: {
        name: "id",
        in: "path",
      },
      example: "1",
    }),
});
