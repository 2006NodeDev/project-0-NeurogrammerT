import express, { Request, Response, NextFunction } from 'express'
import { Reimbursement, ReimbursementStatus, ReimbursementType } from "../models/Reimbursement";

export const reimbursementRouter = express.Router()

// Get all reimbursements
reimbursementRouter.get('/', (req: Request, res: Response, next: NextFunction) => {
    res.json(reimbursements)
})

//get reimbursement by status
reimbursementRouter.get('/:statusId', (req:Request, res:Response)=>{
    let {statusId} = req.params
    if(isNaN(+statusId)){
        
        res.status(400).send('statusId needs to be a number')
    }else {
        let found = false
        let found_reimbursements = []

        reimbursements.forEach(reimbursement => {
            if (reimbursement.status === +statusId) {
                found_reimbursements.push(reimbursement)
                res.json(reimbursement)
                found = true 
            }
        })
        
        if(!found){
            res.status(404).send('Reimbursement Not Found')
        }
    }
})

// Get reimbursements by type

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