import Joi from 'joi';
import requiredMsg from '@/lib/validators/utils/required_message';

// allowed fields ONLY
const educationFields = {
    institution: Joi.string().min(1).max(30).trim().messages({
        'string.base': 'institution must be a string',
        'string.min': 'institution cannot be empty',
        'string.max': 'institution cannot exceed 30 characters',
    }),

    fieldOfStudy: Joi.string().min(1).max(30).trim().messages({
        'string.base': 'fieldOfStudy must be a string',
        'string.min': 'fieldOfStudy cannot be empty',
        'string.max': 'fieldOfStudy cannot exceed 30 characters',
    }),

    qualification: Joi.string().trim()
        .valid('Primary School', 'Secondary School', 'ITE / Nitec', 'A Level', 'Diploma', 'Degree', 'Master', 'PhD')
        .messages({
        'any.only': "qualification must be one of: 'Primary School', 'Secondary School', 'ITE / Nitec', 'A Level', 'Diploma', 'Degree', 'Master', 'PhD'",
    }),

    start_date : Joi.date().iso().messages({
        'date.base': 'start_datemust be a valid date',
        'date.format': 'start_date must be in YYYY-MM-DD format',
    }),

    end_date : Joi.alternatives().try(Joi.date().iso().greater(Joi.ref('start_date')), Joi.string().valid('present') ).messages({
        'alternatives.types': 'end_date must be a valid date or "present"',
        'any.only': 'end_date must be a valid date or "present"',
        'date.greater': 'end_date must be later than the start date',
    }),

    study_type: Joi.string().trim().lowercase()
        .valid('part time', 'full time')
        .messages({
        'any.only': "study_type field must be one of: 'part time', 'full time'",
    }),

    description: Joi.string().min(1).max(500).trim().messages({
        'string.base': 'description must be a string',
        'string.min': 'description cannot be empty',
        'string.max': 'description cannot exceed 500 characters',
    })
};
 
// forbidden fields (ALWAYS forbidden)
const forbiddenFields = {
    education_id: Joi.forbidden().messages({
        'any.forbidden': 'Changing education_id is not allowed',
    }),
    user_id: Joi.forbidden().messages({
        'any.forbidden': 'Changing user_id is not allowed',
    }),
    user: Joi.forbidden().messages({
        'any.forbidden': 'You are not allowed to modify user relation',
  }),
};

// POST schema (required + forbidden)
export const createEducationSchema = Joi.object({
    institution: educationFields.institution.required().messages(requiredMsg("institution")),
    fieldOfStudy: educationFields.fieldOfStudy.required().messages(requiredMsg("fieldOfStudy")),
    qualification: educationFields.qualification.required().messages(requiredMsg("qualification")),
    start_date: educationFields.start_date.required().messages(requiredMsg("start_date")),
    end_date: educationFields.end_date.required().messages(requiredMsg("end_date")),
    study_type: educationFields.study_type.required().messages(requiredMsg("study_type")),
    description: educationFields.description.required().messages(requiredMsg("description")),
    ...forbiddenFields,
});

// PUT / PATCH schema (partial + forbidden)
export const updateEducationSchema = Joi.object({
    ...educationFields,
    ...forbiddenFields,
}).min(1);


    

   