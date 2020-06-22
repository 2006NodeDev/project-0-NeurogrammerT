// Resource doesn't exist.

import { HttpError } from "./httpError";

export class ResourceNotFoundError extends HttpError{
    constructor(){
        super(404, 'Resource Does Not Exist')
    }
}