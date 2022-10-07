"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require('ts-node/register');
const dotenv_1 = require("dotenv");
// Environment Variable Configuration 
(0, dotenv_1.config)();
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
    }
};
