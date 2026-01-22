import Joi from 'joi';
import requiredMsg from '@/lib/validators/utils/required_message';

const userBase = {
    
    name: Joi.string().min(1).max(50).trim().messages({
        "string.base": "First Name must be a string",
        "string.empty": "First Name cannot be empty",
        "string.min": "First Name must be at least 1 character long",
        "string.max": "First Name cannot exceed 20 characters",
    }),
    image: Joi.string().min(1).trim().messages({
            'string.base': 'image must be a string',
            'string.min': 'image cannot be empty',
        }),
    email: Joi.string().email({ tlds: { allow: false } }).min(10).max(65).trim()
        .messages({
            'string.email': 'Please enter a valid email address',
            'string.min': 'Email must be at least 10 characters long',
            'string.max': 'Email cannot exceed 80 characters',
        }),
    password: Joi.string().min(5).trim()
        .messages({
            'string.min': 'Password must be at least 5 characters long',
            'string.base': 'Password must be a string',
            'string.empty': 'Password cannot be empty',  
    }),
    summary: Joi.string().min(0).max(500).trim().messages({
        "string.base": "First Name must be a string",
        "string.max": "First Name cannot exceed 500 characters",
    }),
    
};



// forbidden fields (ALWAYS forbidden)
const forbiddenFields = {
    user_id: Joi.any().forbidden().messages({'any.unknown': 'Changing id is not allowed'}),
    skills: Joi.forbidden().messages({'any.unknown': "You cannot change skills record in this route"}),
    experiences: Joi.forbidden().messages({'any.unknown': "You cannot change experiences record in this route"}),
    educations: Joi.forbidden().messages({'any.unknown': "You cannot change educations record in this route"}),
    company_members: Joi.forbidden().messages({'any.unknown': "You cannot change company_members record in this route"}),
    job_applicants: Joi.forbidden().messages({'any.unknown': "You cannot change job applicants record record"}),
    notification: Joi.forbidden().messages({'any.unknown': "You cannot modify the notifications data"}),
};
 

// POST schema (required + forbidden)
export const createUserSchema = Joi.object({
    name: userBase.name.required().messages(requiredMsg("Name")),
    email: userBase.email.required().messages(requiredMsg("Email")),
    password: userBase.password.required().messages(requiredMsg("Password")),
    ...forbiddenFields,
});


// PUT / PATCH schema (partial + forbidden)
export const updateUserSchema = Joi.object({
    ...userBase,
    ...forbiddenFields,
}).min(1);
    

   