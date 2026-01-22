import CustomAPIError from "@/errors/custom-error"
import BadRequestError from "@/errors/bad-request"
import NotFoundError from "@/errors/not-found"
import UnauthenticatedError from "@/errors/unauthenticated"
import ForbiddenError from "@/errors/forbidden"

export {
    CustomAPIError, 
    BadRequestError, 
    NotFoundError,
    UnauthenticatedError,
    ForbiddenError
}


/*
these all are self custom error classes, all inherit the error class
*/