import express, { Request, Response} from 'express'
import { userRouter, users, } from './routers/user-router'
import { reimbursementRouter } from './routers/reimbursement-router'
import { InvalidEntryError } from './errors/InvalidEntryError'
import { AuthenticationError } from './errors/authenticationError'

const app = express()

app.use(express.json())

app.use('/users', userRouter)
app.use('/reimbursements', reimbursementRouter)

app.post('/login', (req:Request, res:Response)=>{
    
    let username = req.body.username
    let password = req.body.password
    
    if(!username || !password){
        
        throw new InvalidEntryError()
    } else {
        let found = false
        for(const user of users) {
            if(user.username === username && user.password === password){
                
                req.session.user = user
                
                res.json(user)
                found = true
            }
        }
        if(!found){
            throw new AuthenticationError()
        }
    }
})

app.use((err, req, res, next) => {

    if (err.statusCode) {
        
        res.status(err.statusCode).send(err.message)
    } else {
       
        console.log(err)
        
        res.status(500).send('Oops, Something went wrong')
    }
})

app.listen(2006, () => {
    console.log('Server Has Started');
    
})