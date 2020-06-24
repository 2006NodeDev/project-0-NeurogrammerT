import express from 'express'
import { userRouter, } from './routers/user-router'
import { reimbursementRouter } from './routers/reimbursement-router'

const app = express()

app.use(express.json())

app.use('/users', userRouter)
app.use('/reimbursements', reimbursementRouter)

app.listen(2006, () => {
    console.log('Server Has Started');
    
})