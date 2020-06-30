import express, { Request, Response, NextFunction } from 'express'
import { User, Role } from '../models/User'
import { getAllUsers, getUserById, saveOneUser, updateOneUser, deleteUser } from '../daos/user-dao'
import { authenticationMiddleware } from '../middleware/authentication-middleware'
import { authorizationMiddleware } from '../middleware/authorization-middleware'



export const userRouter = express.Router()

userRouter.use(authenticationMiddleware)

// Get all users
userRouter.get('/', authorizationMiddleware(['Admin']), async (req:Request,res:Response,next:NextFunction)=>{
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
userRouter.post('/', authorizationMiddleware(['Admin']), async (req: Request, res: Response, next: NextFunction) => {
   
    let { username, password, firstName, lastName, email, role } = req.body

    if (!username || username === Number) {
        res.status(400).send('You must enter a valid username as a string') 
    }
    if (!password || password === Number) {
        res.status(400).send('You must enter a valid password as a string') 
    }
    if (!firstName || firstName === Number) {
        res.status(400).send('You must enter a valid first name as a string') 
    }
    if (!lastName || lastName === Number) {
        res.status(400).send('You must enter a valid last name as a string') 
    }
    if (!email || email === Number) {
        res.status(400).send('You must enter a valid email as a string')
    }
    if (!role) {
        res.status(400).send('You must enter a valid role name and role Id as a class object for role: {role_name: "role", roleId: number} Valid role names and ids are: Admin(1), Finance Manager(2), Employee(3)') 
    }else {
        
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
userRouter.patch('/', authorizationMiddleware(['Admin']), async (req: Request, res: Response, next: NextFunction) => {
    
        let { userId, username, password, firstName, lastName, email, role} = req.body
        
        if (!userId || userId === String || userId < 1) {
            res.sendStatus(400).send('You must put in a valid user Id number')
        }
        if (username === Number) {
            res.status(400).send('You must enter a valid username as a string') 
    }
        if (password === Number) {
            res.status(400).send('You must enter a valid password as a string') 
        }
        if (firstName === Number) {
            res.status(400).send('You must enter a valid first anme as a string') 
        }
        if (lastName === Number) {
            res.status(400).send('You must enter a valid last name as a string') 
        }
        if (email === Number) {
            res.status(400).send('You must enter a valid email as a string')
        } else {
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
        }
            
        catch (e) {
            next(e)
        }
    }
    })

// Delete User
userRouter.delete('/', authorizationMiddleware(['Admin']), async (req: Request, res: Response, next: NextFunction) => {
   
        let { userId } = req.body
    
        if (!userId || userId === String || userId < 1) {
            res.sendStatus(400).send('You must put in a valid user Id number')
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