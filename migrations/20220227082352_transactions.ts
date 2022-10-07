import { Knex } from "knex";

export async function up(knex: Knex): Promise<any> {
    return knex.schema.createTable("transactions", function (table) {
        table.increments("id").primary()
        table.integer("user_id").notNullable()
        table.string("transaction_code").notNullable()
        table.string("transaction_reference").notNullable()
        table.decimal("amount", 12, 2).notNullable()
        table.string("description").notNullable()
        table.string("status", 80).notNullable()
        table.string("payment_method").notNullable()
        table.boolean("is_inflow").defaultTo(null)
        table.timestamps(true, true)
    })
}

export async function down(knex: Knex): Promise<any> {
    return knex.schema.dropTable("transactions")
}