import express from 'express'
import { ReimbursementDTOtoReimbursementConverter } from '../utils/ReimbursementDTO-to-Reimbursement-converter'
import { ResourceNotFoundError } from '../errors/resourceNotFoundError'
import { connectionPool } from '../daos'
import { PoolClient } from 'pg'
import { Reimbursement } from '../models/Reimbursement'
import { authenticationMiddleware } from '../middleware/authentication-middleware'

export const reimbursementStatusRouter = express.Router()

reimbursementStatusRouter.use(authenticationMiddleware)

//get reimbursement by status
export async function getReimbursementByStatus(id: number):Promise<Reimbursement[]> {
    let client: PoolClient
    
    try {
      
        client = await connectionPool.connect()
      
        let results = await client.query(`select rb."reimbursement_id", u."username" as "author", rb."amount", rb."dateSubmitted", rb."dateResolved", rb."description", u2."first_name" as "resolver", rs."status_name" as "status", rt."type_name" as "type"
        from flamehazesociety.reimbursements rb left join flamehazesociety.users u on rb."author" = u."user_id" left join flamehazesociety.users u2 on rb."resolver" = u2."user_id" left join flamehazesociety.reimbursement_status rs on rb."status" = rs."status_id" left join flamehazesociety.reimbursement_type rt on rb."type" = rt."type_id" where rs."status_id" = $1 order by rb."dateSubmitted" desc;`, [id])
        
        if(results.rowCount === 0){
            throw new Error('User Not Found')
        }
        return results.rows.map((ReimbursementDTOtoReimbursementConverter))
    } catch (e) {
        if(e.message === 'User Not Found'){
            throw new ResourceNotFoundError()
        }
        
        console.log(e)
        throw new Error('Unhandled Error Occured')
    } finally {
        
        client && client.release()
    }
}