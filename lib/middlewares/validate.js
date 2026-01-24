export function validateBody(schema) {
  return async (req) => {
    const body = await req.json();

    const { error, value } = schema.validate(body, {
        abortEarly: false,
        stripUnknown: true,
    });

    if (error) {
        return {
            error: Response.json(
            {
                message: "Validation failed",
                errors: error.details.map(d => ({
                //field: d.path.join('.'),
                message: d.message,
                })),
            },
            { status: 400 }
            ),
        };
    }

    return { value };
  };
}
