import db from "../config/db";
import { Wallet } from "../types/wallet-interface";
import randomstring from 'randomstring'

const createWallet = async (userId: number): Promise<Wallet> => {
    const user = await db.select('*').from('users').where('id', userId).first()

    const generatedWalletCode = randomstring.generate({
        length: 7,
        charset: "alphanumeric",
        capitalization: "uppercase"
    })

    const wallet = await db("wallets").insert({
        user_id: user.id,
        wallet_code: generatedWalletCode
    })

    return wallet
}

export {
    createWallet
}