export interface Wallet {
    id: number
    user_id: number
    wallet_code: string
    wallet_pin: number | null
    balance: number
}