import { config } from "dotenv";
config()

const jwtConfig = {
    appKey: process.env.APP_SECRET_KEY || 'secret'
}

export default jwtConfig