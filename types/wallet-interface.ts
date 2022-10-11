import { User } from "./user-interface"

export interface Wallet {
    id: number
    user_id: number
    wallet_code: string
    wallet_pin: number | null
    balance: number
}

export interface WalletData {
    user: User
    pin: number
    amount?: number
}

export interface FundData {
    user: User
    amount: number
}

export interface VerifyWalletData {
    user: User
    transaction_id: number
}