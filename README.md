# Cyber Block
This is my submission for Gitcoin L2 Rollathon: a Virtual Hackathon-

[#### DeFi, NFT, Game And Other DApps On Meter Network](https://gitcoin.co/issue/meterio/meter-bounty-program/6/100028846)


## Introduction
Cyber Block is a blockchain based social media web dapp where users can post content on chain and tip other users content in cryptocurrency!

It is currently running on Meter testnet only!

Live demo- [Cyber Block](https://calm-gnome-b0f34c.netlify.app/)   (Use meter testnet)

### Tech Stack used
- solidity for smart contract (**NOTE**: REMIX WAS USED FOR DEPLOYMENT ON METER TEST NETWORK)

More about configuring metamask with meter net can be found [here](https://docs.meter.io/developer-documentation/introduction).

- Moralis for storing user profile data such as username, pfp, banner and user login.

- web3 , web3uikit and react.

### Local development
Clone the repo into your desired folder.

cd into the directory

Run `yarn` to install dependencies. You can check package.json for this.

To run the project locally you will  be required to have a moralis server running. Create a moralis server from [here](https://moralis.io/) and then make a .env file and store the below environment variables.

`
REACT_APP_APP_ID = your moralis app id
`
`
REACT_APP_SERVER_URL = your moralis server url
`


then run,


`yarn start`


### Working
All the posts are stored on chain where the image attached to post is stored on ipfs using moralis. 

Tipping a post  is also on chain.

User profile editing and data related to user profile (other than the posts) are kept off chain to make it costless and easy to use. This profile data is also stored on moralis as a moralis object. 


### What's next 
- Follow/Unfollow feature
- Like Post feature
