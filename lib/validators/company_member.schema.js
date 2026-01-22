import Joi from 'joi';

// allowed fields ONLY
const companyMemberFields = {
    // role: Joi.string().min(1).max(50).trim().messages({
    //     'string.base': 'name must be a string',
    //     'string.min': 'name cannot be empty',
    //     'string.max': 'name cannot exceed 50 characters',
    // }),
    removed: Joi.boolean().messages({
        'boolean.base': 'removed status must be true or false.'
    })
    
};

// forbidden fields (ALWAYS forbidden)
const forbiddenFields = {
    company_member_id: Joi.forbidden().messages({
        'any.forbidden': 'Changing company_member_id is not allowed',
    }),
    company_id: Joi.forbidden().messages({
        'any.forbidden': 'Changing company_id is not allowed',
    }),
    user_id: Joi.forbidden().messages({
        'any.forbidden': 'Changing user_id is not allowed',
    }),

    user: Joi.forbidden().messages({
        'any.forbidden': 'You are not allowed to modify user relation',
    }),

    company: Joi.forbidden().messages({
        'any.forbidden': 'You are not allowed to modify company relation',
    }),
};


// POST schema (required + forbidden)
export const createCompanyMemberSchema = Joi.object({
    //role: companyMemberFields.role.required(),
    removed: companyMemberFields.removed.forbidden().messages({
        'any.forbidden': 'You are not allowed to handle removed status here',
    }),
    ...forbiddenFields,
});

// PUT / PATCH schema (partial + forbidden)
export const updateCompanyMemberSchema = Joi.object({
    ...companyMemberFields,
    ...forbiddenFields,
}).min(1);
