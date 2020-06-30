import { PoolClient } from "pg"
import { connectionPool } from "."
import { ReimbursementDTOtoReimbursementConverter } from "../utils/ReimbursementDTO-to-Reimbursement-converter"
import { Reimbursement } from "../models/Reimbursement"
import { ResourceNotFoundError } from "../errors/resourceNotFoundError"
import { InvalidEntryError } from "../errors/InvalidEntryError"
import { UserNotFoundError } from "../errors/userNotFoundError"

// Get all Reimbursements
export async function getAllReimbursements():Promise<Reimbursement[]> {
    
    let client: PoolClient

    try {
      
        client = await connectionPool.connect() 
     
        let results = await client.query(`select rb."reimbursement_id", u."username" as "author", rb."amount", rb."dateSubmitted", rb."dateResolved", rb."description", u2."first_name" as "resolver", rs."status_name" as "status", rt."type_name" as "type"
        from flamehazesociety.reimbursements rb left join flamehazesociety.users u on rb."author" = u."user_id" left join flamehazesociety.users u2 on rb."resolver" = u2."user_id" left join flamehazesociety.reimbursement_status rs on rb."status" = rs."status_id" left join flamehazesociety.reimbursement_type rt on rb."type" = rt."type_id" order by rb."dateSubmitted" desc;`)
        return results.rows.map(ReimbursementDTOtoReimbursementConverter)
    } catch (e) {
        console.log(e)
        throw new Error('Unhandled Error Occured')

    } finally {
        client && client.release()
    }
}

// Submit a New Reimbursement
export async function submitReimbursement(newReimbursement: Reimbursement): Promise<Reimbursement>{
    
    let client: PoolClient
    
    try{
        client = await connectionPool.connect()
        
        await client.query('BEGIN;')

        let results = await client.query(`insert into flamehazesociety.reimbursements ("author", "amount", "dateSubmitted", "dateResolved", "description", "resolver", "status", "type")
            values($1,$2,$3,$4,$5,$6,$7,$8) returning "reimbursement_id" `, [newReimbursement.author, newReimbursement.amount, newReimbursement.dateSubmitted, newReimbursement.dateResolved, newReimbursement.description, newReimbursement.resolver, newReimbursement.status, newReimbursement.type])
        
        newReimbursement.reimbursementId = results.rows[0].reimbursement_id

        await client.query('COMMIT;')

        if (results.rowCount === 0) {
            throw new Error('Not Submitted')
        } else { 
            return newReimbursement
        }

    }catch(e){
        client && client.query('ROLLBACK;')
        if(e.message === 'Not Submitted'){
            throw new InvalidEntryError()
        }
        console.log(e)
        throw new Error('Unhandled Error Occured')

    }finally{
        client && client.release();
    }
}

// Update a Reimbursement
export async function updateReimbursement(updatedReimbursement: Reimbursement): Promise<Reimbursement>{
    
    let client: PoolClient
    
    try{
        client = await connectionPool.connect()
        
        await client.query('BEGIN;')

        if (!updatedReimbursement.reimbursementId) {
            throw new UserNotFoundError
        } else {

            if (updatedReimbursement.author) {
                let results = await client.query(`update flamehazesociety.reimbursements set "author" = $1 where "reimbursement_id" = $2;`, [updatedReimbursement.author, updatedReimbursement.reimbursementId])

                if (results.rowCount === 0) {
                    throw new Error('Reimbursement not found')
                }
            }

            if (updatedReimbursement.amount) {
                let results = await client.query(`update flamehazesociety.reimbursements set "amount" = $1 where "reimbursement_id" = $2;`, [updatedReimbursement.amount, updatedReimbursement.reimbursementId])

                if (results.rowCount === 0) {
                    throw new Error('Reimbursement not found')
                }
            }

            if (updatedReimbursement.dateSubmitted) {
                let results = await client.query(`update flamehazesociety.reimbursements set "dateSubmitted" = $1 where "reimbursement_id" = $2;`, [updatedReimbursement.dateSubmitted, updatedReimbursement.reimbursementId])

                if (results.rowCount === 0) {
                    throw new Error('Reimbursement not found')
                }
            }

            if (updatedReimbursement.dateResolved) {
                let results = await client.query(`update flamehazesociety.reimbursements set "dateResolved" = $1 where "reimbursement_id" = $2;`, [updatedReimbursement.dateResolved, updatedReimbursement.reimbursementId])

                if (results.rowCount === 0) {
                    throw new Error('Reimbursement not found')
                }
            }

            if (updatedReimbursement.description) {
                let results = await client.query(`update flamehazesociety.reimbursements set "description" = $1 where "reimbursement_id" = $2;`, [updatedReimbursement.description, updatedReimbursement.reimbursementId])

                if (results.rowCount === 0) {
                    throw new Error('Reimbursement not found')
                }
            }

            if (updatedReimbursement.resolver) {
                let results = await client.query(`update flamehazesociety.reimbursements set "resolver" = $1 where "reimbursement_id" = $2;`, [updatedReimbursement.resolver, updatedReimbursement.reimbursementId])

                if (results.rowCount === 0) {
                    throw new Error('Reimbursement not found')
                }
            }

            if (updatedReimbursement.status) {
                let results = await client.query(`update flamehazesociety.reimbursements set "status" = $1 where "reimbursement_id" = $2;`, [updatedReimbursement.status, updatedReimbursement.reimbursementId])

                if (results.rowCount === 0) {
                    throw new Error('Reimbursement not found')
                }
            }

            if (updatedReimbursement.type) {
        
                let results = await client.query(`update flamehazesociety.reimbursements set "type" = $1 where "reimbursement_id" = $2;`, [updatedReimbursement.type, updatedReimbursement.reimbursementId])

                if (results.rowCount === 0) {
                    throw new Error('Reimbursement not found')
                }
            }
    
            await client.query('COMMIT;')

            return updatedReimbursement
        }
    
    }catch(e){
        client && client.query('ROLLBACK;')
        if(e.message === 'Reimbursement not found'){
            throw new ResourceNotFoundError()
        }
        console.log(e)
        throw new Error('Unhandled Error Occured')

    }finally{
        client && client.release();
    }
}

// Delete a Reimbursement
export async function deleteReimbursement(deletedReimbursement: Reimbursement): Promise<Reimbursement>{
    
    let client: PoolClient
    
    try{
        client = await connectionPool.connect()
      
        let results = await client.query(`delete from flamehazesociety.reimbursements where "reimbursement_id" = $1`, [deletedReimbursement.reimbursementId])

        if(results.rowCount === 0){
            throw new Error('Reimbursement not found')
        }

        return deletedReimbursement

    }catch(e){
        if(e.message === 'Reimbursement not found'){
            throw new ResourceNotFoundError()
        }
        console.log(e)
        throw new Error('Unhandled Error Occured')
        
    }finally{
        client && client.release();
    }
}