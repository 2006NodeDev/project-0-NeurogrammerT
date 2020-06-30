//Bad request or invalid entry

import { HttpError } from "./httpError";

export class InvalidEntryError extends HttpError{
    constructor(){
        super(400, 'You Have Made an Invalid Entry')
    }
}