import CustomAPIError from "@/errors/custom-error"

class UnauthenticatedError extends CustomAPIError {
    constructor(message) {
        super(message)
        this.statusCode =  401
    }
}

export default UnauthenticatedError