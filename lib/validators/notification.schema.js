import Joi from 'joi';
import requiredMsg from '@/lib/validators/utils/required_message';

// allowed fields ONLY
const notificationFields = {
    is_read: Joi.boolean()
        .messages({
            'boolean.base': 'read status must be true or false.',
    }),

    message: Joi.string().min(1).max(100).trim().messages({
            'string.base': 'message must be a string',
            'string.min': 'message cannot be empty',
            'string.max': 'message cannot exceed 100 characters',
    }),

    type:  Joi.string()
        .valid('ACCEPTED', 'REJECTED' ,'WITHDRAWN', 'INTERVIEW', 'SUBMITTED')
        .messages({
            'any.only': "Type must be one of: 'ACCEPTED', 'REJECTED' ,'WITHDRAWN', 'INTERVIEW', 'SUBMITTED'",
    }),
};


// forbidden fields (ALWAYS forbidden)
const forbiddenFields = {
    notification_id: Joi.forbidden().messages({
        'any.forbidden': 'Changing notification id is not allowed',
    }),

    user_id: Joi.forbidden().messages({
        'any.forbidden': 'Changing user id is not allowed',
    }),


    created_at: Joi.forbidden().messages({
        'any.forbidden': 'Changing created at is not allowed',
    }),

    user: Joi.forbidden().messages({
        'any.forbidden': 'You are not allowed to modify user relation',
    }),
};


// POST schema (required + forbidden)
export const createNotificationSchema = Joi.object({
    message: notificationFields.message.required().messages(requiredMsg("Message")),
    type: notificationFields.type.required().messages(requiredMsg("type")),
    is_read: notificationFields.is_read.forbidden().messages({
        'any.forbidden': 'You are not allowed to handle is read status here',
    }),
    ...forbiddenFields,
});

// PUT / PATCH schema (partial + forbidden)
export const updateNotificationSchema = Joi.object({
    ...notificationFields,
    ...forbiddenFields,
}).min(1);