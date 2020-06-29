import express, { Request, Response, NextFunction } from 'express'
import { userRouter} from './routers/user-router'
import { reimbursementRouter } from './routers/reimbursement-router'
import { getUserByUsernameAndPassword } from './daos/user-dao'
import { AuthenticationError } from './errors/authenticationError'
import { loggingMiddleware } from './middleware/logging-middleware'
import { sessionMiddleware } from './middleware/session-middleware'



const app = express()

app.use(express.json())

app.use(loggingMiddleware)
app.use(sessionMiddleware)

app.use('/users', userRouter)
app.use('/reimbursements', reimbursementRouter)

app.post('/login', async (req:Request, res:Response, next:NextFunction)=>{
    // you could use destructuring, see ./routers/book-router
    let username = req.body.username
    let password = req.body.password
    // if I didn't get a usrname/password send an error and say give me both fields
    if(!username || !password){
        // make a custom http error and throw it or just send a res
        throw new AuthenticationError()
    } else {
        try{
            let user = await getUserByUsernameAndPassword(username, password)
            req.session.user = user
            res.json(user)
        }catch(e){
            next(e)
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