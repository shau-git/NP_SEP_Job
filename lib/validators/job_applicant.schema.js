import Joi from 'joi';
import requiredMsg from '@/lib/validators/utils/required_message';

// allowed fields ONLY
const jobApplicantFields = {
    status: Joi.string()
        .valid('ACCEPTED', 'REJECTED' ,'WITHDRAWN', 'INTERVIEW', 'PENDING')
        .messages({
            'any.only': "Status must be one of: 'ACCEPTED', 'REJECTED' ,'WITHDRAWN', 'INTERVIEW', 'PENDING'",
    }),

    expected_salary: Joi.number().integer().min(1)
        .messages({
            'number.base': 'Expected salary must be a number.',
            'number.min': 'Expected salary cannot be negative.',
    }),

    interview_date: Joi.date()
        .iso()
        .allow(null)
        .optional()
        .messages({
            'date.format': 'Interview date must be a valid YYYY-MM-DD date'
    }),

    interview_time: Joi.string()
        .allow(null)
        // Regex for 09:00AM format
        .pattern(/^(0[1-9]|1[0-2]):[0-5][0-9](AM|PM)$/) 
        .when('interview_date', {
            is: Joi.exist().not(null),
            then: Joi.required(),
            otherwise: Joi.optional()
        })
        .messages({
            'string.pattern.base': 'Time must be in HH:MM(AM|PM) (ex: 09:00AM) format',
            'any.required': 'Interview time is required if a date is set'
    })
};


// forbidden fields (ALWAYS forbidden)
const forbiddenFields = {
    applicant_id: Joi.forbidden().messages({
        'any.forbidden': 'Changing applicant id is not allowed',
    }),
    user_id: Joi.forbidden().messages({
        'any.forbidden': 'Changing user id is not allowed',
    }),
    job_post_id: Joi.forbidden().messages({
        'any.forbidden': 'Changing job post id is not allowed',
    }),

    applied_date: Joi.forbidden().messages({
        'any.forbidden': 'Changing applied date is not allowed',
    }),

    user: Joi.forbidden().messages({
        'any.forbidden': 'You are not allowed to modify user relation',
    }),
    job_post: Joi.forbidden().messages({
        'any.forbidden': 'You are not allowed to modify job post relation',
    }),
};


// POST schema (required + forbidden)
export const createJobApplicantsSchema = Joi.object({
    expected_salary: jobApplicantFields.expected_salary.required().messages(requiredMsg("Expected_salary")),
    status: jobApplicantFields.status.forbidden().messages({
        'any.forbidden': 'You are not allowed to create status',
    }),
    interview_date: jobApplicantFields.interview_date.forbidden().messages({
        'any.forbidden': 'You are not allowed to create interview date',
    }),
    interview_time: jobApplicantFields.interview_time.forbidden().messages({
        'any.forbidden': 'You are not allowed to create interview time',
    }),
    ...forbiddenFields,
});

// PUT / PATCH schema (partial + forbidden)
export const updateJobApplicantSchema = Joi.object({
    ...jobApplicantFields,
    ...forbiddenFields,
}).min(1);