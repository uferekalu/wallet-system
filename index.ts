import express, { Request, Response } from 'express'
import helmet from 'helmet'
import compression from 'compression'
import cors from 'cors'
import { config } from 'dotenv'
import routes from './routes'
config()

const app = express()

app.use(helmet())

app.use(express.json())

app.use(express.urlencoded({ extended: true }))


app.use(compression())

app.use(cors())
app.options("*", cors())

app.use(routes)

const PORT = process.env.PORT || "3000"

if (process.env.NODE_ENV !== "test") {
    app.listen(PORT, () => console.log(`Server is running on port ${PORT}`))
}

export default app