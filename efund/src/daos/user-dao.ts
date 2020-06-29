import { User } from "../models/User"
import { PoolClient } from "pg"
import { connectionPool } from "."
import { UserDTOtoUserConvertor } from "../utils/UserDTO-to-User-converter"
import { UserNotFoundError } from "../errors/userNotFoundError"
// import { AuthenticationError } from "../errors/authenticationError"
import { InvalidEntryError } from "../errors/InvalidEntryError"
import { AuthenticationError } from "../errors/authenticationError"

export async function getAllUsers():Promise<User[]> {
    
    let client: PoolClient
    try {
      
        client = await connectionPool.connect() 
     
        let results = await client.query(`select u."user_id", u."username" , u."password" , u."first_name", u."last_name", u."email" ,r."role_id" , r."role_name" from flamehazesociety.users u left join flamehazesociety.roles r on u."role" = r."role_id";`)
        return results.rows.map(UserDTOtoUserConvertor)
    } catch (e) {
         
        console.log(e)
        throw new Error('Unhandled Error Occured')
    } finally {
        
        client && client.release()
    }
}


export async function getUserById(id: number):Promise<User> {
    let client: PoolClient
    try {
      
        client = await connectionPool.connect()
      
        let results = await client.query(`select u."user_id", u."username" , u."password" , u."first_name", u."last_name", u."email" ,r."role_id" , r."role_name" from flamehazesociety.users u left join flamehazesociety.roles r on u."role" = r."role_id" where u."user_id" = $1;`,
            [id])
        
        if(results.rowCount === 0){
            throw new Error('User Not Found')
        }
        return UserDTOtoUserConvertor(results.rows[0])
    } catch (e) {
        if(e.message === 'User Not Found'){
            throw new UserNotFoundError()
        }
        
        console.log(e)
        throw new Error('Unhandled Error Occured')
    } finally {
        
        client && client.release()
    }
}


//find user by username and password ( login )

export async function getUserByUsernameAndPassword(username:string, password:string):Promise<User>{
    let client: PoolClient
    try {
        //get a connection
        client = await connectionPool.connect()
        //send the query
        let results = await client.query(`select u."user_id", u."username" , u."password" , u."first_name", u."last_name", u."email" ,r."role_id" , r."role_name" from flamehazesociety.users u left join flamehazesociety.roles r on u."role" = r."role_id" where u."username" = $1 and u."password" = $2;`,[username, password])
        
        if(results.rowCount === 0){
            throw new Error('User Not Found')
        }
        return UserDTOtoUserConvertor(results.rows[0])//there should only ever be one row
    } catch (e) {
        if(e.message === 'User Not Found'){
            throw new AuthenticationError()
        }
        //if we get an error we don't know 
        console.log(e)
        throw new Error('Unhandled Error Occured')
    } finally {
        //let the connectiopn go back to the pool
        client && client.release()
    }
}


// save one user
export async function saveOneUser(newUser:User):Promise<User>{
    let client:PoolClient
    try{
        client = await connectionPool.connect()
        
        await client.query('BEGIN;')
        let roleId = await client.query(`select r."role_id" from flamehazesociety.roles r where r."role_name" = $1`, [newUser.role["role"]])
        if(roleId.rowCount === 0){
            throw new Error('Role Not Found')
        }
        roleId = roleId.rows[0].role_id
        let results = await client.query(`insert into flamehazesociety.users ("username", "password", "first_name", "last_name", "email", "role")
            values($1,$2,$3,$4,$5,$6) returning "user_id" `,[newUser.username, newUser.password, newUser.firstName, newUser.lastName, newUser.email, roleId])
        newUser.userId = results.rows[0].user_id
        await client.query('COMMIT;')
        return newUser

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

// Update User
export async function updateOneUser(updatedUser:User):Promise<User>{
    let client:PoolClient
    try{
        client = await connectionPool.connect()
        
        await client.query('BEGIN;')
    
        if (updatedUser.username) {
            let results = await client.query(`update flamehazesociety.users set "username" = $1 where "user_id" = $2;`, [updatedUser.username, updatedUser.userId])

            console.log(results);
        }

        if (updatedUser.password) {
            let results = await client.query(`update flamehazesociety.users set "password" = $1 where "user_id" = $2;`, [updatedUser.password, updatedUser.userId])

            console.log(results);
        }

        if (updatedUser.firstName) {
            let results = await client.query(`update flamehazesociety.users set "first_name" = $1 where "user_id" = $2;`, [updatedUser.firstName, updatedUser.userId])

            console.log(results);
        }

        if (updatedUser.lastName) {
            let results = await client.query(`update flamehazesociety.users set "last_name" = $1 where "user_id" = $2;`, [updatedUser.lastName, updatedUser.userId])

            console.log(results);
        }

        if (updatedUser.email) {
            let results = await client.query(`update flamehazesociety.users set "email" = $1 where "user_id" = $2;`, [updatedUser.email, updatedUser.userId])

            console.log(results);
        }

        if (updatedUser.role) {

            await client.query('BEGIN;')
            let roleId = await client.query(`select r."role_id" from flamehazesociety.roles r where r."role_name" = $1`, [updatedUser.role["role"]])
            if(roleId.rowCount === 0){
                throw new Error('Role Not Found')
            }
            roleId = roleId.rows[0].role_id
        
            let results = await client.query(`update flamehazesociety.users set "role" = $1 where "user_id" = $2;`, [roleId, updatedUser.userId])

            console.log(results);
        }
    
        await client.query('COMMIT;')

        return updatedUser
    
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

// Delete User
export async function deleteUser(deletedUser:User):Promise<User>{
    let client:PoolClient
    try{
        client = await connectionPool.connect()
        
        await client.query('BEGIN;')
      
        await client.query(`delete from flamehazesociety.users where "user_id" = $1`, [deletedUser.userId])

        await client.query('COMMIT;')

        return deletedUser

    }catch(e){
        client && client.query('ROLLBACK;')
        
        console.log(e)
        throw new Error('Unhandled Error Occured')
    }finally{
        client && client.release();
    }
}