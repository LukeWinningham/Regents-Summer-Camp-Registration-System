
import express from 'express'
import cors from 'cors'
import { PrismaClient } from '@prisma/client'
import registerRoute from './register.js'

const app = express()
const prisma = new PrismaClient()

app.use(cors())
app.use(express.json())

app.use('/api/register', registerRoute(prisma))

app.listen(4000, () => console.log('Backend running on http://localhost:4000'))
