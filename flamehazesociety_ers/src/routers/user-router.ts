import express, { Request, Response, NextFunction } from 'express'
import { User, Role } from '../models/User'
import { getAllUsers, getUserById, saveOneUser, updateOneUser, deleteUser } from '../daos/user-dao'
import { authenticationMiddleware } from '../middleware/authentication-middleware'
import { authorizationMiddleware } from '../middleware/authorization-middleware'





export const userRouter = express.Router()

userRouter.use(authenticationMiddleware)

// Get All Users
userRouter.get('/', authorizationMiddleware(['Admin']), async (req: Request, res: Response, next: NextFunction) => {
    
    try {
        let allUsers = await getAllUsers() 
        res.json(allUsers)
    } catch (e) {
        next(e)
    }
})

//Get Users by id
userRouter.get('/:id', async (req: Request, res: Response, next: NextFunction) => {
    
    let { id } = req.params
    
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

// Save a New User
userRouter.post('/', authorizationMiddleware(['Admin']), async (req: Request, res: Response, next: NextFunction) => {
   
    let { username, password, firstName, lastName, email, role } = req.body

    if((username = String && username) && (password = String && password) && (firstName = String && firstName) && (lastName = String && lastName) && (email = String && email) && (role.role = String && role.role) && (role.roleId = Number && role.roleId)) {
        
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
    } else if((!username)){
        res.status(400).send("You must include a username. This username must be unique, not that I think you are or anything.")
    }else if((!password)){
        res.status(400).send("You must include a password. Don't use sappy stuff, I'm judging you.")
    }
    else if((!firstName)){
        res.status(400).send("You must include your first name. Not that I mind calling you swine.")
    }
    else if((!lastName)){
        res.status(400).send("You must include your last name. I need to know who to look up if you cross me.")
    }
    else if((!email)){
        res.status(400).send("You must include an email. Your last name, first initial and @fhs.net is the only valid option.")
    }
    else if((!role.role)){
        res.status(400).send("You must include a role. Valid roles are Admin(1), Finance Manager(2), Employee(3). Know your place.")
    }
    else if((!role.roleId)){
        res.status(400).send("You must include a roleId. Valid roles are Admin(1), Finance Manager(2), Employee(3). Only the Admin, a.k.a myself can update this info, so who's the real baka here?")
    }
})
    
// Update a User
userRouter.patch('/', authorizationMiddleware(['Admin']), async (req: Request, res: Response, next: NextFunction) => {
    
        let { userId, username, password, firstName, lastName, email, role} = req.body
        
        if((userId = Number && userId))  {
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
    } else if((!userId)){
        res.status(400).send("You must include a userId number for the user you wish to update.")
    }
    })

// Delete a User
userRouter.delete('/', authorizationMiddleware(['Admin']), async (req: Request, res: Response, next: NextFunction) => {
   
        let { userId } = req.body
    
        if((userId = Number && userId))  {
            
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
    }else if ((!userId)) {
        res.status(400).send("You must include a userId number for the user you wish to delete.")
    }
    })