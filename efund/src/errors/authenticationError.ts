// Login Credentials are incorrect

import { HttpError } from "./httpError";

export class AuthenticationError extends HttpError {
    constructor(){
        super(401, 'Incorrect Username or Password')
    }
}