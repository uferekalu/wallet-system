import { config } from "dotenv";
import { attachPaginate } from 'knex-paginate'
config()

const environment = process.env.NODE_ENV || 'development'
const configuration = require('../knexfile')[environment]
const db = require('knex')(configuration)
attachPaginate()

export default db

