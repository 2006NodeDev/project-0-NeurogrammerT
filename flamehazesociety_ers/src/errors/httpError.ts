// Base error to extend to other errors

export abstract class HttpError extends Error {
    statusCode:number
    constructor(statusCode:number, message?:string){
        super(message)
        this.statusCode = statusCode
    }
}