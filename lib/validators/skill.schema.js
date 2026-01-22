import Joi from 'joi';
import requiredMsg from '@/lib/validators/utils/required_message';

// allowed fields ONLY
const skillFields = {
    skill: Joi.string().min(1).max(30).trim().messages({
        'string.base': 'Skill must be a string',
        'string.min': 'Skill cannot be empty',
        'string.max': 'Skill cannot exceed 30 characters',
    }),

    level: Joi.string()
        .valid('BEGINNER', 'INTERMEDIATE', 'ADVANCED')
        .messages({
        'any.only': "Level must be one of: BEGINNER, INTERMEDIATE, ADVANCED",
    }),
};
 
// forbidden fields (ALWAYS forbidden)
const forbiddenFields = {
    skill_id: Joi.forbidden().messages({
        'any.forbidden': 'Changing skill id is not allowed',
    }),
    user_id: Joi.forbidden().messages({
        'any.forbidden': 'Changing user id is not allowed',
    }),
    user: Joi.forbidden().messages({
            'any.forbidden': 'You are not allowed to modify user relation',
    }),
};

// POST schema (required + forbidden)
export const createSkillSchema = Joi.object({
    skill: skillFields.skill.required().messages(requiredMsg("Skill")),
    level: skillFields.level.required().messages(requiredMsg("Level")),
    ...forbiddenFields,
});

// PUT / PATCH schema (partial + forbidden)
export const updateSkillSchema = Joi.object({
    ...skillFields,
    ...forbiddenFields,
}).min(1);


    

   