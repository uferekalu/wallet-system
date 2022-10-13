import { config } from "dotenv";
config()
import { attachPaginate } from 'knex-paginate'

const environment = process.env.NODE_ENV || 'development'
const configuration = require('../knexfile')[environment]
const db = require('knex')(configuration)
attachPaginate()

export default db

