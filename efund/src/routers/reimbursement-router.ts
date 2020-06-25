import express, { Request, Response, NextFunction } from 'express'
import { Reimbursement, ReimbursementStatus, ReimbursementType } from "../models/Reimbursement";
import { reimbursementStatusRouter } from './reimbursementStatus-router';
import { InvalidEntryError } from '../errors/InvalidEntryError';
import { reimbursementAuthorRouter } from './reimbursementAuthor-router';

export const reimbursementRouter = express.Router()

// Route to reimbursement by status lookup
reimbursementRouter.use('/status', reimbursementStatusRouter);

// Route to reimbursement by author lookup
reimbursementRouter.use('/author', reimbursementAuthorRouter);

// Get all reimbursements
reimbursementRouter.get('/', (req:Request,res:Response,next:NextFunction)=>{
    res.json(reimbursements)
})

// Submit a reimbursement
reimbursementRouter.post('/', (req:Request, res:Response, next:NextFunction)=>{
    let {
        reimbursementId = 0,
        author,
        amount,
        dateSubmitted,
        dateResolved,
        description,
        resolver,
        status,
        type
    } = req.body
    if(reimbursementId && author && amount && dateSubmitted && dateResolved && description && resolver && status && type){
        reimbursements.push({reimbursementId, author, amount, dateSubmitted, dateResolved, description, resolver, status, type})
        res.status(201).send(reimbursements[reimbursements.length-1]);
    } else{
        console.log(`reimbursement id: ${reimbursementId}`)
        throw new InvalidEntryError
    }
})

// Update Reimbursement
reimbursementRouter.patch('/', (req:Request, res:Response, next:NextFunction)=>{
    let id = req.body.reimbursementId;
    if(!id){
        throw InvalidEntryError
    }else if(isNaN(+id)){
        res.status(400).send("Reimbursement Id must be a number");
    }else{
        let found = false;
        for(const reimbursement of reimbursements){
            if(reimbursement.reimbursementId === +id){
                let author = req.body.author;
                let amount = req.body.amount;
                let dateSubmitted = req.body.dateSubmitted;
                let dateResolved = req.body.dateResolved;
                let description = req.body.description;
                let resolver = req.body.resolver;
                let status = req.body.status;
                let type = req.body.type;

                if(author){
                    reimbursement.author = author;
                }
                if(amount){
                    reimbursement.amount = amount;
                }
                if(dateSubmitted){
                    reimbursement.dateSubmitted = dateSubmitted;
                }
                if(dateResolved){
                    reimbursement.dateResolved = dateResolved;
                }
                if(description){
                    reimbursement.description = description;
                }
                if (resolver){
                    reimbursement.resolver = resolver;
                }
                if (status){
                    reimbursement.status = status;
                }
                if (type){
                    reimbursement.type = type;
                }

                res.json(reimbursement);
                found = true;
            }
        }
        if(!found){
            res.status(404).send('Reimbursment not found')
        }
    }
})

export let reimbursements: Reimbursement[] = [
    {
        reimbursementId: 1,
        author: 1,
        amount: 1000,
        dateSubmitted: 1,
        dateResolved: 1,
        description: 'Company Lunch',
        resolver: 2,
        status: 2,
        type: 3
    },
    {
        reimbursementId: 2,
        author: 2,
        amount: 5000,
        dateSubmitted: 1,
        dateResolved: 1,
        description: 'Holiday Bonus',
        resolver: 1,
        status: 2,
        type: 4
    },
    {
        reimbursementId: 3,
        author: 3,
        amount: 300,
        dateSubmitted: 1,
        dateResolved: 1,
        description: 'Trip',
        resolver: 2,
        status: 1,
        type: 2
    },
    {
        reimbursementId: 4,
        author: 4,
        amount: 100,
        dateSubmitted: 1,
        dateResolved: 1,
        description: 'Hotel',
        resolver: 2,
        status: 3,
        type: 1
    }
]

export let reimbursementStatus: ReimbursementStatus[] = [
    {
        statusId: 1,
        status: 'Pending'
    },
    {
        statusId: 2,
        status: 'Approved'
    },
    {
        statusId: 3,
        status: 'Denied'
    }
]


export let reimbursementType: ReimbursementType[] = [
    {
        typeId: 1,
        type: 'Lodging'
    },
    {
        typeId: 2,
        type: 'Food'
    },
    {
        typeId: 3,
        type: 'Travel'
    },
    {
        typeId: 4,
        type: 'Other'
    }
]