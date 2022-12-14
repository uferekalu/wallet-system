require('ts-node/register')
import { config } from 'dotenv'

// Environment Variable Configuration 
config()

module.exports = {
    development: {
        client: 'mysql',
        connection: {
            database: process.env.DB_NAME,
            user: process.env.DB_USER,
            password: process.env.DB_PASSWORD,
            port: process.env.DB_PORT
        },
        pool: {
            min: 2,
            max: 10
        },
        migrations: {
            tableName: 'knex_migrations'
        }
    },

    test: {
        client: 'mysql',
        connection: {
            database: process.env.TEST_DB_NAME,
            user: process.env.TEST_DB_USER,
            password: process.env.TEST_DB_PASSWORD,
            port: process.env.TEST_DB_PORT
        },
        pool: {
            min: 2,
            max: 10
        },
        migrations: {
            tableName: 'knex_migrations'
        }
    },
    
}