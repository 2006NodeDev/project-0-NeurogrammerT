import express, { Request, Response, NextFunction } from 'express'
import { getAllReimbursements, submitReimbursement, updateReimbursement, deleteReimbursement} from '../daos/reimbursement-dao';
import { reimbursementStatusRouter, getReimbursementByStatus } from './reimbursementStatus-router';
import { reimbursementAuthorRouter, getReimbursementByUser } from './reimbursementAuthor-router';
import { Reimbursement } from '../models/Reimbursement';
import { authenticationMiddleware } from '../middleware/authentication-middleware';
import { authorizationMiddleware } from '../middleware/authorization-middleware';

export const reimbursementRouter = express.Router() 

reimbursementRouter.use(authenticationMiddleware)

// Route to reimbursement by status lookup
reimbursementRouter.use('/status', reimbursementStatusRouter);

// Route to reimbursement by author lookup
reimbursementRouter.use('/author/userId', reimbursementAuthorRouter);

// Get All Reimbursements
reimbursementRouter.get('/', authorizationMiddleware(['Finance Manager']), async (req:Request,res:Response,next:NextFunction)=>{
    try {
        let allReimbursements = await getAllReimbursements() 
        res.json(allReimbursements)
    } catch (e) {
        next(e)
    }
})

//Get Reimbursements by Status
reimbursementStatusRouter.get('/:statusId', authorizationMiddleware(['Finance Manager']), async (req:Request, res:Response,next:NextFunction)=>{
    let {statusId} = req.params
    if(isNaN(+statusId)){
        res.status(400).send('statusId needs to be a number')
    }else {
        try {
            let allReimbursementsByStatus = await getReimbursementByStatus(+statusId) 
            res.json(allReimbursementsByStatus)
        } catch (e) {
            next(e)
        }
    }
})

//Get reimbursements by User
reimbursementAuthorRouter.get('/:userId', authorizationMiddleware(['Finance Manager'], true), async (req:Request, res:Response,next:NextFunction)=>{
    let {userId} = req.params
    if(isNaN(+userId)){
        res.status(400).send('userId needs to be a number')
    }else {
        try {
            let allReimbursementsByUser = await getReimbursementByUser(+userId) 
            res.json(allReimbursementsByUser)
        } catch (e) {
            next(e)
        }
    }
})

// Submit a Reimbursement
reimbursementRouter.post('/', async (req: Request, res: Response, next:NextFunction) => {
    
    let {
        author,
        amount,
        dateSubmitted,
        dateResolved,
        description,
        resolver,
        status,
        type
    } = req.body
    
    if ((author = Number && author) && (amount = Number && amount) && (dateSubmitted = Date && dateSubmitted) && (description = String && description) && (type = Number && type)) {

        let defaultSubmitDate: Date = new Date()
        let defaultResolveDate: String = "2020-12-31"
        
        let newReimbursement: Reimbursement = {
                reimbursementId: 0,
                author,
                amount,
                dateSubmitted,
                dateResolved,
                description,
                resolver,
                status,
                type
        }
            
            newReimbursement.dateSubmitted = dateSubmitted || defaultSubmitDate
            newReimbursement.dateResolved = dateResolved || defaultResolveDate
            newReimbursement.resolver = resolver || null
            newReimbursement.status = status || 2
            
        try {
            await submitReimbursement(newReimbursement)
            res.sendStatus(201)
        } catch (e) {
            next(e)
            }
        }else if ((!author)) {
                res.status(400).send("You must include a valid author id. This is the same as your user id. Contact your Admin if you are unsure of this number...at your own risk.")
            }
            else if((!amount)){
                res.status(400).send("You must include an reimbursement amount to the nearest whole dollar. If it is over the budget, you'll be getting an earful from your Finance Manager...if he's still alive by the end of the day that is.")
            }
            else if((!dateSubmitted)){
                res.status(400).send("You must use a valid date in format YYYY-MM-DD hh:mm:ss to set a date. Reimbursements submitted later than a month after purchase are at the mercy of the Admin. Please get them in on time, or I'll be at her mercy too.")
            }
            else if((!description)){
                res.status(400).send("You must include a description of your requested reimbursement. Careful not to be too descriptive if you value your job or your life. Shana still hasn't forgotten Margery.")
            }
            else if((!type)){
                res.status(400).send("You must include a valid reimbursement type. Valid types are Lodging(1), Food(2), Travel(3), Other(4) Odds are if you classify it as other, you'll be paying for it on your own dime, but exceptions can be made.")
            }
            else if((!dateResolved)){
                res.status(400).send("Employees, you may disregard the date resolved and leave it at 0, as your request is not yet resolved. The value will be updated by your Finance Manager upon review. Due to a rise in demon activity and an influx of work, it may be a while before review.")
            }
            else if((!status)){
                res.status(400).send("If you're an employee, leave status at 0. Your Finance Manager will update it upon review. For you reference, the valid status codes are: Approved(1), Pending(2), Denied(3). While your Finance Manager may approve a request at his discretion, all approvals are subject to the will of the Admin. Catch her on a good day.")
            }
            else if((!resolver)){
                res.status(400).send("You should keep the resolver field at 0, as your Finance Manager will update it upon making his decision. As the Admin has total authority, in some cases she may resolve your requests instead. Good luck.")
            }
})

// Update a Reimbursement
reimbursementRouter.patch('/', authorizationMiddleware(['Finance Manager']), async (req:Request, res:Response, next:NextFunction)=>{
        let {
            reimbursementId,
            author,
            amount,
            dateSubmitted,
            dateResolved,
            description,
            resolver,
            status,
            type
        } = req.body

    if ((reimbursementId = Number && reimbursementId)) {
            
        let defaultResolveDate: String = "2020-12-31"
           
        let updatedReimbursement: Reimbursement = {
            reimbursementId,
            author,
            amount,
            dateSubmitted,
            dateResolved,
            description,
            resolver,
            status,
            type
        }
        
        updatedReimbursement.dateSubmitted = dateSubmitted || undefined
        updatedReimbursement.dateResolved = dateResolved || defaultResolveDate
        updatedReimbursement.resolver = resolver || undefined
        updatedReimbursement.status = status || undefined
        updatedReimbursement.author = author || undefined
        updatedReimbursement.amount - amount || undefined
        updatedReimbursement.type = type || undefined
        updatedReimbursement.description = description || undefined
        
        try {
            await updateReimbursement(updatedReimbursement)
            res.send('You have succesfully updated this reimbursement')
        } catch (e) {
            next(e)
        }
    }
       else if ((!reimbursementId)) {
            res.status(400).send("You must include a reimbursementId number for the reimbursement you wish to update.")
        }
})

// Delete a Reimbursement
reimbursementRouter.delete('/', authorizationMiddleware(['Finance Manager']), async (req:Request, res:Response, next:NextFunction)=>{
    
    let {reimbursementId} = req.body

    if ((reimbursementId = Number && reimbursementId)) {
            
        let deletedReimbursement: Reimbursement = {

            reimbursementId,
            author: 0,
            amount: 0,
            dateSubmitted: 0,
            dateResolved: 0,
            description: '',
            resolver:0,
            status:0,
            type:0
        }
        
        try {
            await deleteReimbursement(deletedReimbursement)  
            res.send('You have succesfully deleted this reimbursement')
        } catch (e) {
            next(e)
        }
    }else if ((!reimbursementId)) {
        res.status(400).send("You must include a reimbursementId number for the reimbursement you wish to delete.")
    }
})