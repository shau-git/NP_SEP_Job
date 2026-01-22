import Joi from 'joi';
import requiredMsg from '@/lib/validators/utils/required_message';

// allowed fields ONLY
const educationFields = {
    institution: Joi.string().min(1).max(30).trim().messages({
        'string.base': 'Institution must be a string',
        'string.min': 'Institution cannot be empty',
        'string.max': 'Institution cannot exceed 30 characters',
    }),

    fieldOfStudy: Joi.string().min(1).max(30).trim().messages({
        'string.base': 'Field of study must be a string',
        'string.min': 'Field of study cannot be empty',
        'string.max': 'Field of study cannot exceed 30 characters',
    }),

    qualification: Joi.string()
        .valid('Primary School', 'Secondary School', 'ITE / Nitec', 'A Level', 'Diploma', 'Degree', 'Master', 'PhD')
        .messages({
        'any.only': "Qualification must be one of: 'Primary School', 'Secondary School', 'ITE / Nitec', 'A Level', 'Diploma', 'Degree', 'Master', 'PhD'",
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

    study_type: Joi.string()
        .valid('part time', 'full time')
        .messages({
        'any.only': "Study type field must be one of: 'part time', 'full time'",
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
        'any.forbidden': 'Changing education id is not allowed',
    }),
    user_id: Joi.forbidden().messages({
        'any.forbidden': 'Changing user id is not allowed',
    }),
    user: Joi.forbidden().messages({
        'any.forbidden': 'You are not allowed to modify user relation',
  }),
};

// POST schema (required + forbidden)
export const createEducationSchema = Joi.object({
    institution: educationFields.institution.required().messages(requiredMsg("Institution")),
    fieldOfStudy: educationFields.fieldOfStudy.required().messages(requiredMsg("Field of study")),
    qualification: educationFields.qualification.required().messages(requiredMsg("Qualification")),
    start_date: educationFields.start_date.required().messages(requiredMsg("Start date")),
    end_date: educationFields.end_date.required().messages(requiredMsg("End date")),
    study_type: educationFields.study_type.required().messages(requiredMsg("Study type")),
    description: educationFields.description.required().messages(requiredMsg("Description")),
    ...forbiddenFields,
});

// PUT / PATCH schema (partial + forbidden)
export const updateEducationSchema = Joi.object({
    ...educationFields,
    ...forbiddenFields,
}).min(1);


    

   