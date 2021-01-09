# OTHub Chainlink External Adapter

This chainlink adapter allows you to request data from most of the APIs provided by https://othub-testnet.origin-trail.network/dashboard and use them on chain.

OTHub API documentation can be found here: https://testnet-api.othub.info/docs/index.html

Update the HOST_URL environment variable in GCP to switch back and forth from testnet to mainnet or to your own host url.

You will need to run a chainlink node to hose the APIs yourself or you will need to wait until the adapter is listed on the Kovan adapter market place.

## Run your own adapter

Clone this repo 

```bash
git clone https://github.com/CosmiCloud/OTHub-EA.git
```

Enter into the newly-created directory

```bash
cd OTHub-EA
```

You can remove the existing git history by running:

```bash
rm -rf .git
```

See [Install Locally](#install-locally) for a quickstart

## Input Params

- ALL input params available in the othub api documentation are compatible with the adapter.

## Example Output

```bash
Result:  {
  jobRunID: '1',
  data: [
    {
      Identity: '0x77cb90599e850a6ab5a1d85f222b813c689bb9fc',
      OfferId: '0x3afb601c5260094ec6522257ccbb80882ea9ac5134135f57595c70a3fae07538',
      FinalizedTimestamp: '2021-01-06T03:07:49',
      HoldingTimeInMinutes: 60,
      Paidout: false,
      CanPayout: true,
      TokenAmountPerHolder: '120.429168673134480000',
      EndTimestamp: '2021-01-06T04:07:49',
      Status: 'Completed',
      IsOriginalHolder: true
    },
    result: 'Completed'
  ],
  result: 'Completed',
  statusCode: 200
}
```

## Supported APIs

- getHoldingAddress
- getHoldingAddresses
- getHoldingStorageAddresses
- getLitigationStorageAddresses
- getDC
- getDataCreators
- getDCJobs
- getDCProfileTransfers
- getDCLitigations
- getDataHolders
- getDH
- getDHJobs
- getDHPayouts
- getDHProfileTransfers
- getDHLitigations
- getCanTryPayout
- getJob

## Install Locally

Install dependencies:

```bash
yarn
```

### Test

Run the local tests:

```bash
yarn test
```

Natively run the application (defaults to port 8080):

### Run

```bash
yarn start
```

## Call the external adapter/API server

```bash
sudo curl -X POST -H "content-type:application/json" "http://localhost:8080/" --data '{ "id": 0, "data": { "action": "getDHJobs", "value": "Status", "dh_erc725_id": "0x77cb90599e850a6ab5a1d85f222b813c689bb9fc", "limit": "1", "page": "1", "OfferId_like": "0x3afb601c5260094ec6522257ccbb80882ea9ac5134135f57595c70a3fae07538" } }'
```

## Docker

If you wish to use Docker to run the adapter, you can build the image by running the following commands:

```bash
cd OTHub-EA
sudo docker build . -t othub-ea
```

Then run it with:

```bash
sudo docker run --name othub-ea -p 8080:8080 -it othub-ea:latest
```

## Serverless hosts

After [installing locally](#install-locally):

### Create the zip

```bash
sudo zip -r othub-ea.zip .
```

### Install to GCP

- In Functions, create a new function, choose to ZIP upload
- Click Browse and select the `othub-ea.zip` file
- Select a Storage Bucket to keep the zip in
- Function to execute: gcpservice
- Click More, Add variable (repeat for all environment variables)
  - NAME: HOST_URL
  - VALUE: "your host url* 
  (testnet = https://testnet-api.othub.info, mainnet = https://othub-api.origin-trail.network, or you can potentially use your own custom url if hosting othub apis)

### Chainlink Node Quick Start

see: https://docs.chain.link/docs/running-a-chainlink-node for more details on adding jobs/bridges to your GCP function.

sudo mkdir -p ~/.chainlink-kovan
cd ~/.chainlink-kovan

sudo nano .env

"ROOT=/chainlink
LOG_LEVEL=debug
ETH_CHAIN_ID=42
MIN_OUTGOING_CONFIRMATIONS=2
LINK_CONTRACT_ADDRESS=0xa36085F69e2889c224210F603D836748e7dC0088
CHAINLINK_TLS_PORT=0
SECURE_COOKIES=false
GAS_UPDATER_ENABLED=true
MINIMUM_CONTRACT_PAYMENT=10000000000000000
ALLOW_ORIGINS=*"
ETH_URL=wss://kovan.infura.io/ws/v3/*your infura endpoint ID here*
DATABASE_URL=postgresql://admin:admin@0.0.0.0:5432/chainlink_db?sslmode=disable

sudo docker run --name chainlink_db -p 5432:5432 -e POSTGRES_PASSWORD=admin -e POSTGRES_USER=admin -e POSTGRES_DB=chainlink_db -d postgres

sudo docker exec -it chainlink_db psql -U admin postgres

cd ~/.chainlink-kovan && sudo docker run --name chainlink_node -p 6688:6688 -v ~/.chainlink-kovan:/chainlink -it --network host --env-file=.env smartcontract/chainlink:0.9.4 local n 
