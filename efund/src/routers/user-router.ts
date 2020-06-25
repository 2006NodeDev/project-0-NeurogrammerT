import express, { Request, Response, NextFunction } from 'express'
import { User, Role } from '../models/User'


export const userRouter = express.Router()

// Get all users
userRouter.get('/', (req:Request,res:Response,next:NextFunction)=>{
    res.json(users)
})

//Get users by id
userRouter.get('/:id', (req:Request, res:Response)=>{
    let {id} = req.params
    if(isNaN(+id)){
        
        res.status(400).send('Id must be a number')
    } else {
        let found = false
        for(const user of users){
            if(user.userId === +id){
                res.json(user)
                found = true
            }
        }
        if(!found){
            res.status(404).send('User Not Found')
        }
    }
})

export let users: User[] = [
    {
        userId: 1,
        username: 'FlameHazeShana',
        password: 'password',
        firstName: 'Shana',
        lastName: 'Sakai',
        email: 'sakais@fhs.net',
        role: {
            roleId: 1,
            role: 'Admin'
        }
    },
    {
        userId: 2,
        username: 'HumanTorchYuji',
        password: 'password',
        firstName: 'Yuji',
        lastName: 'Sakai',
        email: 'sakaiy@fhs.net',
        role: {
            roleId: 2,
            role: 'Finance Manager'
        }
    },
    {
        userId: 3,
        username: 'RibbonMasterMina',
        password: 'password',
        firstName: 'Wilhelmina',
        lastName: 'Carmel',
        email: 'carmelw@fhs.net',
        role: {
            roleId: 3,
            role: 'Employee'
          }
    },
    {
        userId: 4,
        username: 'BombshellDaw',
        password: 'password',
        firstName: 'Margery',
        lastName: 'Daw',
        email: 'dawm@fhs.net',
        role: {
            roleId: 3,
            role: 'Employee'
          }
    }
]

export let role: Role[] = [
    {
        roleId: 1,
        role: 'Admin'
    },
    {
        roleId: 2,
        role: 'Finance Manager'
    },
    {
        roleId: 1,
        role: 'User'
    }
]