import Joi from 'joi';
import requiredMsg from '@/lib/validators/utils/required_message';

// allowed fields ONLY
const jobPostFields = {
    title: Joi.string().min(1).max(50).trim().messages({
        'string.base': 'title must be a string',
        'string.min': 'title cannot be empty',
        'string.max': 'title cannot exceed 50 characters',
    }),
   
    requirements: Joi.array()
        .items(Joi.string().trim().min(3).max(200)) // Each item must be a string
        .min(1) // At least one requirement is needed
        .required()
        .messages({
            'array.min': 'Please provide at least one requirement',
            'string.empty': 'Requirements cannot contain empty text'
    }),


    responsibilities: Joi.array()
        .items(Joi.string().trim().min(3).max(500)) // Longer strings allowed for responsibilities
        .min(1)
        .required()
        .messages({
            'array.min': 'Please provide at least one responsibility'
    }),

    employment_type: Joi.string()
            .valid('full time', 'Part Time')
            .messages({
            'any.only': "Employement type must be one of: 'full time', 'Part Time' ",
    }),

    experience: Joi.string()
        .valid('0-2', '3-5' ,'5+')
        .messages({
        'any.only': "Years must be one of: 0-1, 2-5, 5+",
    }),

    removed: Joi.boolean()
      .messages({
        'boolean.base': 'Removed status must be true or false.',
    }),

    salary_start: Joi.number().integer().min(1)
        .messages({
            'number.base': 'Starting salary must be a number.',
            'number.min': 'Starting salary cannot be negative.',
    }),

    salary_end: Joi.number().integer().greater(Joi.ref('salary_start'))
        .messages({
            'number.base': 'Ending salary must be a number.',
            'number.greater': 'Ending salary must be greater than the starting salary',
    }),

    location: Joi.string()
        .valid('onsite', 'remote')
        .messages({
        'any.only': "Years must be one of: 'onsite', 'remote'",
    }),

    benefit: Joi.array()
        .items(Joi.string().trim().min(3).max(200)) // Each item must be a string
        .min(1) // At least one requirement is needed
        .required()
        .messages({
            'array.min': 'Please provide at least one benefit',
            'string.empty': 'Benefit cannot contain empty text'
    }),
    
};



// forbidden fields (ALWAYS forbidden)
const forbiddenFields = {
    job_post_id: Joi.forbidden().messages({
        'any.forbidden': 'Changing company member id is not allowed',
    }),
    company_id: Joi.forbidden().messages({
        'any.forbidden': 'Changing company id is not allowed',
    }),

    created_at: Joi.forbidden().messages({
        'any.forbidden': 'You are not allowed to modify created at',
    }),

    job_applicants: Joi.forbidden().messages({
        'any.forbidden': 'You are not allowed to modify job applicant',
    }),

    company: Joi.forbidden().messages({
        'any.forbidden': 'You are not allowed to modify company relation',
    }),
};


// POST schema (required + forbidden)
export const createJobPostSchema = Joi.object({
    title: jobPostFields.title.required().messages(requiredMsg("Title")),
    requirements: jobPostFields.requirements.required().messages(requiredMsg("Requirements")),
    responsibilities: jobPostFields.responsibilities.required().messages(requiredMsg("Responsibilities")),
    employment_type: jobPostFields.employment_type.required().messages(requiredMsg("Employment type")),
    experience: jobPostFields.experience.required().messages(requiredMsg("Expereince")),
    salary_start: jobPostFields.salary_start.required().messages(requiredMsg("Salary start")),
    salary_end: jobPostFields.salary_end.required().messages(requiredMsg("Salary end")),
    location: jobPostFields.location.required().messages(requiredMsg("Location")),
    benefit: jobPostFields.benefit.required().messages(requiredMsg("Benefit")),
    removed: jobPostFields.removed.forbidden().messages({
        'any.forbidden': 'You are not allowed to handle the removed status here',
    }),
    ...forbiddenFields,
});

// PUT / PATCH schema (partial + forbidden)
export const updateJobPostSchema = Joi.object({
    ...jobPostFields,
    ...forbiddenFields,
}).min(1);
