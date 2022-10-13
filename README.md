# The wallet system
This is an API system built with NodeJS, TypeScript, KnexJS ORM and MySQL as the database. It allows a user to create an account, fund their account, transfer funds to another user's account and withdraw funds from their account

# Features
- Basic Authentication (Register & Login)
- Set Wallet Pin
- Fund Wallet
- Verify Wallet Funding
- Fund Transfer
- Withdraw Fund
- Get Banks
- Get Transactions

# E-R Diagram Link
```
https://dbdesigner.page.link/XhBhfBrJmrHdcPwN8
```
# How to install

## Using Git (recommended)
1. Clone the project from github.

```
git clone https://github.com/uferekalu/wallet-system.git
```

## Using manual download ZIP

1. Download repository
2. Uncompress to your desired directory

## Install npm dependencies

```
npm install
```

## Setting up environments
1. You will find a file named `.env.example` on root directory of project.
2. Create a new file by copying and pasting the file and then renaming it to just `.env`

```
cp .env.example .env
```
3. The file `.env` is already ignored, so you never commit your credentials.
4. Change the values of the file to your environment. Helpful comments added to `.env.example` file to understand the constants.

## Running and resetting migrations

1. To run migrations
```
npm run migrate
```
2. To reset migrations
```
npm run migrate:reset
```

## Important
Because this is a TypeScript project, follow these steps to start the server locally
```
npm run build
```
This will generate the JavaScript files equivalent of the Typescript files in the root folder and output
them in the "dist" folder

```
npm run dev
```
It restarts the server whenver the index.ts file changes

```
npm run start
```
This starts the server from the compiled "index.js" in dist folder

# Author
Kalu Ufere

# POSTMAN LOCAL API TEST IMAGES
```
User registration
```
