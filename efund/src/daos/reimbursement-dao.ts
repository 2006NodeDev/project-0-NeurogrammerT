import { PoolClient } from "pg"
import { connectionPool } from "."
import { ReimbursementDTOtoReimbursementConverter } from "../utils/ReimbursementDTO-to-Reimbursement-converter"
import { Reimbursement } from "../models/Reimbursement"
import { InvalidEntryError } from "../errors/InvalidEntryError"


export async function getAllReimbursements():Promise<Reimbursement[]> {
    
    let client: PoolClient
    try {
      
        client = await connectionPool.connect() 
     
        let results = await client.query(`select rb."reimbursement_id", u."username" as "author", rb."amount", rb."dateSubmitted", rb."dateResolved", rb."description", u2."first_name" as "resolver", rs."status_name" as "status", rt."type_name" as "type"
        from flamehazesociety.reimbursements rb left join flamehazesociety.users u on rb."author" = u."user_id" left join flamehazesociety.users u2 on rb."resolver" = u2."user_id" left join flamehazesociety.reimbursement_status rs on rb."status" = rs."status_id" left join flamehazesociety.reimbursement_type rt on rb."type" = rt."type_id";`)
        return results.rows.map(ReimbursementDTOtoReimbursementConverter)
    } catch (e) {
         
        console.log(e)
        throw new Error('Unhandled Error Occured')
    } finally {
        
        client && client.release()
    }
}

// submit new reimbursement
export async function submitReimbursement(newReimbursement:Reimbursement):Promise<Reimbursement>{
    let client:PoolClient
    try{
        client = await connectionPool.connect()
        
        await client.query('BEGIN;')

        let results = await client.query(`insert into flamehazesociety.reimbursements ("author", "amount", "dateSubmitted", "dateResolved", "description", "resolver", "status", "type")
            values($1,$2,$3,$4,$5,$6,$7,$8) returning "reimbursement_id" `,[newReimbursement.author, newReimbursement.amount, newReimbursement.dateSubmitted, newReimbursement.dateResolved, newReimbursement.description, newReimbursement.resolver, newReimbursement.status, newReimbursement.type])
        newReimbursement.reimbursementId = results.rows[0].reimbursement_id
        await client.query('COMMIT;')
        return newReimbursement

    }catch(e){
        client && client.query('ROLLBACK;')
        if(e.message === 'Role Not Found'){
            throw new InvalidEntryError()
        }
        
        console.log(e)
        throw new Error('Unhandled Error Occured')
    }finally{
        client && client.release();
    }
}

// Update reimbursement
export async function updateReimbursement(updatedReimbursement:Reimbursement):Promise<Reimbursement>{
    let client:PoolClient
    try{
        client = await connectionPool.connect()
        
        await client.query('BEGIN;')
    
        if (updatedReimbursement.author) {
            let results = await client.query(`update flamehazesociety.reimbursements set "author" = $1 where "reimbursement_id" = $2;`, [updatedReimbursement.author, updatedReimbursement.reimbursementId])

            console.log(results);
        }

        if (updatedReimbursement.amount) {
            let results = await client.query(`update flamehazesociety.reimbursements set "amount" = $1 where "reimbursement_id" = $2;`, [updatedReimbursement.amount, updatedReimbursement.reimbursementId])

            console.log(results);
        }

        if (updatedReimbursement.dateSubmitted) {
            let results = await client.query(`update flamehazesociety.reimbursements set "dateSubmitted" = $1 where "reimbursement_id" = $2;`, [updatedReimbursement.dateSubmitted, updatedReimbursement.reimbursementId])

            console.log(results);
        }

        if (updatedReimbursement.dateResolved) {
            let results = await client.query(`update flamehazesociety.reimbursements set "dateResolved" = $1 where "reimbursement_id" = $2;`, [updatedReimbursement.dateResolved, updatedReimbursement.reimbursementId])

            console.log(results);
        }

        if (updatedReimbursement.description) {
            let results = await client.query(`update flamehazesociety.reimbursements set "description" = $1 where "reimbursement_id" = $2;`, [updatedReimbursement.description, updatedReimbursement.reimbursementId])

            console.log(results);
        }

        if (updatedReimbursement.resolver) {
            let results = await client.query(`update flamehazesociety.reimbursements set "resolver" = $1 where "reimbursement_id" = $2;`, [updatedReimbursement.resolver, updatedReimbursement.reimbursementId])

            console.log(results);
        }

        if (updatedReimbursement.status) {
            let results = await client.query(`update flamehazesociety.reimbursements set "status" = $1 where "reimbursement_id" = $2;`, [updatedReimbursement.status, updatedReimbursement.reimbursementId])

            console.log(results);
        }

        if (updatedReimbursement.type) {
        
            let results = await client.query(`update flamehazesociety.reimbursements set "type" = $1 where "reimbursement_id" = $2;`, [updatedReimbursement.type, updatedReimbursement.reimbursementId])

            console.log(results);
        }
    
        await client.query('COMMIT;')

        return updatedReimbursement
    
    }catch(e){
        client && client.query('ROLLBACK;')
     
        console.log(e)
        throw new Error('Unhandled Error Occured')
    }finally{
        client && client.release();
    }
}

// Delete reimbursement
export async function deleteReimbursement(deletedReimbursement:Reimbursement):Promise<Reimbursement>{
    let client:PoolClient
    try{
        client = await connectionPool.connect()
        
        await client.query('BEGIN;')
      
        await client.query(`delete from flamehazesociety.reimbursements where "reimbursement_id" = $1`, [deletedReimbursement.reimbursementId])

        await client.query('COMMIT;')

        return deletedReimbursement

    }catch(e){
        client && client.query('ROLLBACK;')
        
        console.log(e)
        throw new Error('Unhandled Error Occured')
    }finally{
        client && client.release();
    }
}