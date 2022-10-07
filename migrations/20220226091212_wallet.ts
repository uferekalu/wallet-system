import { Knex } from "knex";

export async function up(knex: Knex): Promise<any> {
    return knex.schema.createTable("wallets", function (table) {
        table.increments("id").primary()
        table.integer("user_id").notNullable()
        table.string("wallet_code").notNullable()
        table.string("wallet_pin").defaultTo(null)
        table.decimal("balance", 12, 2).defaultTo(0)
        table.timestamps(true, true)
    })
}

export async function down(knex: Knex): Promise<any> {
    return knex.schema.dropTable("wallets")
}