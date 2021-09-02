# Token Locker

Tool to lock you tokens for given period.

## Run this projects 

Run `yarn install && yarn start` at repo root to compile and run frontend.

Run `truffle compile && truffle migrate` at /ethereum to compile and deploy scripts

Truffle compiles and copies artifacts at /public/contracts to access them from react-app

# TODO 

- Add token lists
- Add networks - bsc, avax etc
- Create CosmWasm contracts for cw-20 tokens
- Create locks with linear and custom release schedule
- Create integrations with compound/aave to get yield while tokens are locked
