// If user tries to access something they are not allowed to

import { HttpError } from "./httpError";

export class AuthorizationError extends HttpError{
    constructor(){
        super(403, 'You Do Not Have Permission to Access this Data')
    }
}