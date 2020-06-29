import express, { Request, Response, NextFunction } from 'express'
import { User, Role } from '../models/User'
import { InvalidEntryError } from '../errors/InvalidEntryError'
import { getAllUsers, getUserById, saveOneUser, updateOneUser, deleteUser } from '../daos/user-dao'


export const userRouter = express.Router()

// Get all users
userRouter.get('/', async (req:Request,res:Response,next:NextFunction)=>{
    try {
        
        let allUsers = await getAllUsers() 
        res.json(allUsers)
    } catch (e) {
        next(e)
    }
})

//Get users by id
userRouter.get('/:id', async (req:Request, res:Response,next:NextFunction)=>{
    let {id} = req.params
    if(isNaN(+id)){
        
        res.status(400).send('Id must be a number')
    } else {
        try {
            let user = await getUserById(+id)
            res.json(user)
        } catch (e) {
            next(e)
        }
    }
})

// Save New User
userRouter.post('/', async (req: Request, res: Response, next: NextFunction) => {
   
    let { username, password, firstName, lastName, email, role } = req.body
    if (!username || !password || !firstName || !lastName || !email || !role) {
        next(new InvalidEntryError)
    } else {
        
        let newUser: User = {
            userId: 0,
            username,
            password,
            firstName,
            lastName,
            email,
            role,
        }

        try {
            let savedUser = await saveOneUser(newUser)
            res.json(savedUser)
        } catch (e) {
            next(e)
        }
    }
})
    
// Update User
userRouter.patch('/:id', async (req: Request, res: Response, next: NextFunction) => {
    let { id } = req.params
    if (isNaN(+id)) {
        
        res.status(400).send('Id needs to be a number')
    } else {
    
        let { userId, username, password, firstName, lastName, email, role} = req.body
        
        if (!userId) {
            next(new InvalidEntryError) 
        }

        if (userId != id) {
            next(new InvalidEntryError)
        }

        let updatedUser: User = {
            username,
            password,
            firstName,
            lastName,
            role,
            userId,
            email,
        }
        updatedUser.email = email || undefined
        updatedUser.username = username || undefined
        updatedUser.password = password || undefined
        updatedUser.role = role || undefined
        updatedUser.userId = userId || undefined
        updatedUser.firstName = firstName || undefined
        updatedUser.lastName = lastName || undefined
        
        try {
            await updateOneUser(updatedUser)

            res.send('You have succesfully updated this user')

        } catch (e) {
            next(e)
        }
    }
    })

// Delete User
userRouter.delete('/', async (req: Request, res: Response, next: NextFunction) => {
   
        let { userId } = req.body
    
        if (!userId) {
            next(new InvalidEntryError)
        } else {
            
        let deletedUser: User = {
            
            username: '',
            password: '',
            firstName: '',
            lastName: '',
            role: new Role(),
            userId,
            email: '',
            
        }
        
        try {
            await deleteUser(deletedUser)

            res.send('You have succesfully deleted this user')

        } catch (e) {
            next(e)
        }
    }
    })