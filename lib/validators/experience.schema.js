import Joi from 'joi';
import requiredMsg from '@/lib/validators/utils/required_message';

// allowed fields ONLY
const experienceFields = {
    company: Joi.string().min(1).max(30).trim().messages({
        'string.base': 'Company field must be a string',
        'string.min': 'Company field cannot be empty',
        'string.max': 'Company field cannot exceed 30 characters',
    }),
    
    role: Joi.string().min(1).max(30).trim().messages({
        'string.base': 'role field must be a string',
        'string.min': 'role field cannot be empty',
        'string.max': 'role field cannot exceed 30 characters',
    }),

    years: Joi.string()
        .valid('0-2', '3-5' ,'5+')
        .messages({
        'any.only': "Years must be one of: 0-2, 3-5, 5+",
    }),
    
    start_date : Joi.date().iso().messages({
            'date.base': 'Start date must be a valid date',
            'date.format': 'Start date must be in YYYY-MM-DD format',
    }),

    end_date : Joi.alternatives().try(Joi.date().iso().greater(Joi.ref('start_date')), Joi.string().valid('present') ).messages({
        'alternatives.types': 'End date must be a valid date or "present"',
        'any.only': 'End date must be a valid date or "present"',
        'date.greater': 'End date must be later than the start date',
    }),

    employment_type: Joi.string()
        .valid('full time', 'Part Time')
        .messages({
        'any.only': "Employement type must be one of: 'full time', 'Part Time' ",
    }),

    description: Joi.string().min(1).max(500).trim().messages({
        'string.base': 'description must be a string',
        'string.min': 'description cannot be empty',
        'string.max': 'description cannot exceed 500 characters',
    })
};
 
// forbidden fields (ALWAYS forbidden)
const forbiddenFields = {
    experience_id: Joi.forbidden().messages({
        'any.forbidden': 'Changing experience id is not allowed',
    }),
    user_id: Joi.forbidden().messages({
        'any.forbidden': 'Changing user id is not allowed',
    }),
    user: Joi.forbidden().messages({
        'any.forbidden': 'You are not allowed to modify user relation',
  }),
};

// POST schema (required + forbidden)
export const createExperienceSchema = Joi.object({
    company: experienceFields.company.required().messages(requiredMsg("Company")),
    role: experienceFields.role.required().messages(requiredMsg("Role")),
    years: experienceFields.years.required().messages(requiredMsg("Years")),
    start_date: experienceFields.start_date.required().messages(requiredMsg("Start date")),
    end_date: experienceFields.end_date.required().messages(requiredMsg("End date")),
    employment_type: experienceFields.employment_type.required().messages(requiredMsg("Employment type")),
    description: experienceFields.description.required().messages(requiredMsg("Description")),
    ...forbiddenFields,
});

// PUT / PATCH schema (partial + forbidden)
export const updateExperienceSchema = Joi.object({
    ...experienceFields,
    ...forbiddenFields,
}).min(1);


    

   