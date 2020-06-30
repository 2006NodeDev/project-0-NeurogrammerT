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

// Get all reimbursements
reimbursementRouter.get('/', authorizationMiddleware(['Finance Manager']), async (req:Request,res:Response,next:NextFunction)=>{
    try {
        
        let allReimbursements = await getAllReimbursements() 
        res.json(allReimbursements)
    } catch (e) {
        next(e)
    }
})

// //get reimbursement by status
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

//get reimbursement by user
reimbursementAuthorRouter.get('/:userId', authorizationMiddleware(['Finance Manager'], true), async (req:Request, res:Response,next:NextFunction)=>{
    let {userId} = req.params
    if(isNaN(+userId)){
        res.status(400).send('statusId needs to be a number')
    }else {
        try {
        
            let allReimbursementsByUser = await getReimbursementByUser(+userId) 
            res.json(allReimbursementsByUser)
        } catch (e) {
            next(e)
        }
    }
})

// Submit a reimbursement
reimbursementRouter.post('/', async (req: Request, res: Response, next:NextFunction) => {
    
    let {
        author,
        amount,
        dateSubmitted,
        dateResolved,
        description,
        type
    } = req.body
    
    if (!author || author === String || author < 1)
     {
        res.status(400).send('You must enter a valid author, which is your user Id number') 
    }

    if (!description || description === Number) {
        res.status(400).send('You must enter a valid text description') 
    }

    if (!amount || amount === String || amount < 1) {
        res.status(400).send('You must enter a valid amount as a whole number.') 
    }

    if (!type || type === String || type < 1 || type > 4) {
        res.status(400).send('You must enter a valid type number. The valid types are Lodging(1), Food(2), Travel(3), Other(4)') 
    }
    else {
        
        let defaultSubmitDate:Date = new Date()
        let defaultResolveDate:Date = new Date()

        let newReimbursement: Reimbursement = {
                reimbursementId: 0,
                author,
                amount,
                dateSubmitted,
                dateResolved,
                description,
                resolver: null,
                status: 2,
                type
        }
        
            newReimbursement.dateSubmitted = dateSubmitted || defaultSubmitDate
            newReimbursement.dateResolved = dateResolved || defaultResolveDate
        try {
            let savedUser = await submitReimbursement(newReimbursement)
            res.json(savedUser)
        } catch (e) {
            next(e)
        }
    }
})

// Update Reimbursement
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

        if (!reimbursementId || reimbursementId === String || reimbursementId < 1) {
            res.sendStatus(400).send('You must put in a valid reimbursement Id number')
        }
        if (author === String || author < 1)
        {
           res.status(400).send('You must enter a valid author, which is your user Id number') 
       }
   
       if (description === Number) {
           res.status(400).send('You must enter a valid text description') 
       }
   
       if (amount === String || amount < 1) {
           res.status(400).send('You must enter a valid amount as a whole number.') 
       }
   
       if (type === String || type < 1 || type > 4) {
           res.status(400).send('You must enter a valid type number. The valid types are Lodging(1), Food(2), Travel(3), Other(4)') 
       }
    
       if (status === String || status < 1 || status > 3)
       {
          res.status(400).send('You must enter a valid status number. Valid status codes are: Approved(1), Pending(2), Denied(3)') 
       }
    
       if (resolver === String || resolver < 1)
       {
          res.status(400).send('You must enter a valid resolver, which is your user Id number') 
      }
        else {
            
            let defaultSubmitDate:Date = new Date()
            let defaultResolveDate: Date = new Date()
           
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
        
            updatedReimbursement.dateSubmitted = dateSubmitted || defaultSubmitDate
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
})

// Delete Reimbursement
reimbursementRouter.delete('/', authorizationMiddleware(['Finance Manager']), async (req:Request, res:Response, next:NextFunction)=>{
    
    let {reimbursementId} = req.body

    if (!reimbursementId || reimbursementId === String || reimbursementId < 1) {
        res.sendStatus(400).send('You must put in a valid reimbursement Id number')
    } else {
            
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
    }
})