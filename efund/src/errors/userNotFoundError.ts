// User doesn't exist.

import { HttpError } from "./httpError";

export class UserNotFoundError extends HttpError{
    constructor(){
        super(404, 'User Does Not Exist')
    }
}