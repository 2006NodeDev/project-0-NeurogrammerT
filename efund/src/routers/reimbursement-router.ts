import express, { Request, Response, NextFunction } from 'express'
import { getAllReimbursements, submitReimbursement, updateReimbursement, deleteReimbursement} from '../daos/reimbursement-dao';
import { reimbursementStatusRouter, getReimbursementByStatus } from './reimbursementStatus-router';
import { reimbursementAuthorRouter, getReimbursementByUser } from './reimbursementAuthor-router';
import { InvalidEntryError } from '../errors/InvalidEntryError';
import { Reimbursement } from '../models/Reimbursement';

export const reimbursementRouter = express.Router() 

// Route to reimbursement by status lookup
reimbursementRouter.use('/status', reimbursementStatusRouter);

// Route to reimbursement by author lookup
reimbursementRouter.use('/author/userId', reimbursementAuthorRouter);

// Get all reimbursements
reimbursementRouter.get('/', async (req:Request,res:Response,next:NextFunction)=>{
    try {
        
        let allReimbursements = await getAllReimbursements() 
        res.json(allReimbursements)
    } catch (e) {
        next(e)
    }
})

// //get reimbursement by status
reimbursementStatusRouter.get('/:statusId', async (req:Request, res:Response,next:NextFunction)=>{
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
reimbursementAuthorRouter.get('/:userId', async (req:Request, res:Response,next:NextFunction)=>{
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
reimbursementRouter.post('/', async (req:Request, res:Response, next:NextFunction)=>{
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
    if (!author || !amount || !dateSubmitted || !dateResolved || !status || !resolver || !description || !type) {
        next(new InvalidEntryError) 
    } else{
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
        
        try {
            let savedUser = await submitReimbursement(newReimbursement)
            res.json(savedUser)
        } catch (e) {
            next(e)
        }
    }
})

// Update Reimbursement
reimbursementRouter.patch('/:id', async (req:Request, res:Response, next:NextFunction)=>{
    let { id } = req.params
    if (isNaN(+id)) {
        res.status(400).send('Id needs to be a number')
    } else {
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

        if (!reimbursementId) {
            next(new InvalidEntryError)
        } 

        if (reimbursementId != id) {
            next(new InvalidEntryError)
        } 
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
            updatedReimbursement.dateResolved - dateResolved || undefined
            updatedReimbursement.resolver = resolver || undefined
            updatedReimbursement.status = status || undefined
            updatedReimbursement.author = author || undefined
            updatedReimbursement.amount - amount || undefined
            updatedReimbursement.type = type || undefined
            updatedReimbursement.description = description || undefined
            updatedReimbursement.reimbursementId = reimbursementId || undefined
        
            try {
                await updateReimbursement(updatedReimbursement)
                
                res.send('You have succesfully updated this reimbursement')
            } catch (e) {
                next(e)
            }
    }
})

// Delete Reimbursement
reimbursementRouter.delete('/', async (req:Request, res:Response, next:NextFunction)=>{
    
    let {reimbursementId} = req.body

    if (!reimbursementId) {
        next(new InvalidEntryError)
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