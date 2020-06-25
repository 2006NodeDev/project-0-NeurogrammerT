import express, { Request, Response, NextFunction } from 'express';
import { reimbursements } from './reimbursement-router';

export const reimbursementAuthorRouter = express.Router();

reimbursementAuthorRouter.get('/:userId', (req:Request, res:Response, next:NextFunction)=>{
    let {userId} = req.params;

    if(isNaN(+userId)){
        res.status(400).send("userId must be a number")
    }else {
        let found = false;
        let found_reimbursements = [];
        for (const reimbursement of reimbursements){
            if (reimbursement.author === +userId){
                found_reimbursements.push(reimbursement);
                found = true;
            }
        }
            if(found){
                res.json(found_reimbursements);
            } else {
                res.status(404).send("Reimbursement not found")

            }
    }
})