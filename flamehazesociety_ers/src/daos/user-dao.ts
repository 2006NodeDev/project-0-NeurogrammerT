import { User } from "../models/User"
import { PoolClient } from "pg"
import { connectionPool } from "."
import { UserDTOtoUserConvertor } from "../utils/UserDTO-to-User-converter"
import { UserNotFoundError } from "../errors/userNotFoundError"
import { InvalidEntryError } from "../errors/InvalidEntryError"
import { AuthenticationError } from "../errors/authenticationError"

// Get All Users
export async function getAllUsers(): Promise<User[]> {
    
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

// Get users by Id
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


//Find Users by Username and Password for Login
export async function getUserByUsernameAndPassword(username:string, password:string):Promise<User>{
    let client: PoolClient
    try {
        client = await connectionPool.connect()

        let results = await client.query(`select u."user_id", u."username" , u."password" , u."first_name", u."last_name", u."email" ,r."role_id" , r."role_name" from flamehazesociety.users u left join flamehazesociety.roles r on u."role" = r."role_id" where u."username" = $1 and u."password" = $2;`,[username, password])
        
        if(results.rowCount === 0){
            throw new Error('User Not Found')
        }
        return UserDTOtoUserConvertor(results.rows[0])

    } catch (e) {
        if(e.message === 'User Not Found'){
            throw new AuthenticationError()
        }
        console.log(e)
        throw new Error('Unhandled Error Occured')

    } finally {
        client && client.release()
    }
}


//Submit a New User
export async function saveOneUser(newUser:User):Promise<User>{
    let client:PoolClient
    try{
        client = await connectionPool.connect()

        await client.query('BEGIN;')

        let role = await client.query(`select r."role_id" from flamehazesociety.roles r where r."role_name" = $1 and role_id = $2`, [newUser.role["role"], newUser.role["roleId"]])
        if(role.rowCount === 0){
            throw new Error('Role Not Found')
        }
        role = role.rows[0].role_id

        let results = await client.query(`insert into flamehazesociety.users ("username", "password", "first_name", "last_name", "email", "role")
            values($1,$2,$3,$4,$5,$6) returning "user_id" `, [newUser.username, newUser.password, newUser.firstName, newUser.lastName, newUser.email, role])
        
        newUser.userId = results.rows[0].user_id

        await client.query('COMMIT;')

        if (results.rowCount === 0) {
            throw new Error('Not Submitted')
        } else {
            return newUser
        }

    }catch(e){
        client && client.query('ROLLBACK;')
        if(e.message === 'Role Not Found' || 'Not Submitted'){
            throw new InvalidEntryError()
        }
        console.log(e)
        throw new Error('Unhandled Error Occured')

    }finally{
        client && client.release();
    }
}

// Update a User
export async function updateOneUser(updatedUser:User):Promise<User>{
    let client:PoolClient
    try{
        client = await connectionPool.connect()
        
        await client.query('BEGIN;')
    
        if (updatedUser.username) {
            let results = await client.query(`update flamehazesociety.users set "username" = $1 where "user_id" = $2;`, [updatedUser.username, updatedUser.userId])

           if(results.rowCount === 0){
                throw new Error('User not found')
            }
        }

        if (updatedUser.password) {
            let results = await client.query(`update flamehazesociety.users set "password" = $1 where "user_id" = $2;`, [updatedUser.password, updatedUser.userId])

            if(results.rowCount === 0){
                throw new Error('User not found')
            }
        }

        if (updatedUser.firstName) {
            let results = await client.query(`update flamehazesociety.users set "first_name" = $1 where "user_id" = $2;`, [updatedUser.firstName, updatedUser.userId])

            if(results.rowCount === 0){
                throw new Error('User not found')
            }
        }

        if (updatedUser.lastName) {
            let results = await client.query(`update flamehazesociety.users set "last_name" = $1 where "user_id" = $2;`, [updatedUser.lastName, updatedUser.userId])

            if(results.rowCount === 0){
                throw new Error('User not found')
            }
        }

        if (updatedUser.email) {
            let results = await client.query(`update flamehazesociety.users set "email" = $1 where "user_id" = $2;`, [updatedUser.email, updatedUser.userId])

            if(results.rowCount === 0){
                throw new Error('User not found')
            }
        }

        if (updatedUser.role) {

            await client.query('BEGIN;')
            let role = await client.query(`select r."role_id" from flamehazesociety.roles r where r."role_name" = $1 and role_id = $2`, [updatedUser.role["role"], updatedUser.role["roleId"]])
        if(role.rowCount === 0){
            throw new Error('Role Not Found')
        }
        role = role.rows[0].role_id
        
            let results = await client.query(`update flamehazesociety.users set "role" = $1 where "user_id" = $2;`, [role, updatedUser.userId])

            if(results.rowCount === 0){
                throw new Error('User not found')
            }
        }
    
        await client.query('COMMIT;')

        return updatedUser
    
    }catch(e){
        client && client.query('ROLLBACK;')
        
        if (e.message === 'Role Not Found' || 'User not found') {
            throw new UserNotFoundError()
        }
        console.log(e)
        throw new Error('Unhandled Error Occured')

    }finally{
        client && client.release();
    }
}

// Delete a User
export async function deleteUser(deletedUser:User):Promise<User>{
    let client:PoolClient
    try{
        client = await connectionPool.connect()
      
        let results = await client.query(`delete from flamehazesociety.users where "user_id" = $1`, [deletedUser.userId])

        if(results.rowCount === 0){
            throw new Error('User not found')
        }
        return deletedUser

    }catch(e){
        if (e.message === 'User not found') {
            throw new UserNotFoundError()
        }
        console.log(e)
        throw new Error('Unhandled Error Occured')

    }finally{
        client && client.release();
    }
}